import { create } from 'zustand';

const DEFAULT_WALLPAPER = '/images/wallpapers/win95_bg.jpeg';
const DEFAULT_W = 640;
const DEFAULT_H = 440;

const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

let nextId = 1;
const makeId = () => `w${nextId++}`;

const centerPos = (w, h) => {
  if (typeof window === 'undefined') return { x: 80, y: 60 };
  const cx = Math.max(0, (window.innerWidth - w) / 2);
  const cy = Math.max(0, (window.innerHeight - h - 30) / 2);
  // small cascade offset based on open count
  return { x: cx, y: cy };
};

export const useDesktopStore = create((set, get) => ({
  openWindows: [],
  activeWindowId: null,
  zCounter: 100,
  wallpaper: loadJSON('wallpaper', DEFAULT_WALLPAPER),
  recycleBin: loadJSON('recycleBin', []),
  soundEnabled: loadJSON('soundEnabled', true),

  openWindow: (spec) => {
    const { openWindows, zCounter } = get();
    // If a window with the same singleton key is already open, focus it.
    if (spec.singleton) {
      const existing = openWindows.find(
        (w) => w.component === spec.component
      );
      if (existing) {
        get().focusWindow(existing.id);
        if (existing.minimized) get().minimizeWindow(existing.id);
        return existing.id;
      }
    }

    const w = spec.width ?? DEFAULT_W;
    const h = spec.height ?? DEFAULT_H;
    const cascade = openWindows.length * 24;
    const base = centerPos(w, h);
    const id = makeId();
    const newWin = {
      id,
      component: spec.component,
      title: spec.title ?? spec.component,
      icon: spec.icon ?? null,
      props: spec.props ?? {},
      x: spec.x ?? base.x + cascade,
      y: spec.y ?? base.y + cascade,
      w,
      h,
      minW: spec.minW ?? 320,
      minH: spec.minH ?? 240,
      minimized: false,
      zIndex: zCounter + 1,
      resizable: spec.resizable !== false,
    };
    set({
      openWindows: [...openWindows, newWin],
      activeWindowId: id,
      zCounter: zCounter + 1,
    });
    return id;
  },

  closeWindow: (id) => {
    const { openWindows, recycleBin, activeWindowId } = get();
    const win = openWindows.find((w) => w.id === id);
    if (!win) return;
    const nextBin = [
      ...recycleBin,
      { name: win.title, component: win.component, deletedAt: Date.now() },
    ].slice(-50);
    saveJSON('recycleBin', nextBin);
    const nextOpen = openWindows.filter((w) => w.id !== id);
    set({
      openWindows: nextOpen,
      recycleBin: nextBin,
      activeWindowId:
        activeWindowId === id
          ? nextOpen[nextOpen.length - 1]?.id ?? null
          : activeWindowId,
    });
  },

  minimizeWindow: (id) => {
    const { openWindows, activeWindowId } = get();
    const next = openWindows.map((w) =>
      w.id === id ? { ...w, minimized: !w.minimized } : w
    );
    set({
      openWindows: next,
      activeWindowId:
        activeWindowId === id
          ? next.filter((w) => !w.minimized).slice(-1)[0]?.id ?? null
          : activeWindowId,
    });
  },

  focusWindow: (id) => {
    const { openWindows, zCounter } = get();
    if (!openWindows.some((w) => w.id === id)) return;
    const newZ = zCounter + 1;
    set({
      openWindows: openWindows.map((w) =>
        w.id === id ? { ...w, zIndex: newZ, minimized: false } : w
      ),
      activeWindowId: id,
      zCounter: newZ,
    });
  },

  moveWindow: (id, x, y) => {
    set({
      openWindows: get().openWindows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    });
  },

  resizeWindow: (id, w, h, x, y) => {
    set({
      openWindows: get().openWindows.map((win) =>
        win.id === id ? { ...win, w, h, x, y } : win
      ),
    });
  },

  setWallpaper: (url) => {
    saveJSON('wallpaper', url);
    set({ wallpaper: url });
  },

  setSoundEnabled: (enabled) => {
    saveJSON('soundEnabled', enabled);
    set({ soundEnabled: enabled });
  },

  emptyBin: () => {
    saveJSON('recycleBin', []);
    set({ recycleBin: [] });
  },
}));

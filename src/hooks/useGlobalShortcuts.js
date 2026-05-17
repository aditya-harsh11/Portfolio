import { useEffect } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA']);

function isTyping(target) {
  if (!target) return false;
  if (target.isContentEditable) return true;
  if (target.tagName && TYPING_TAGS.has(target.tagName)) return true;
  return false;
}

export function useGlobalShortcuts() {
  useEffect(() => {
    const onKey = (e) => {
      const store = useDesktopStore.getState();
      const active = store.activeWindowId;

      // Esc closes the active window (unless typing or in a game window where
      // some games use Esc themselves)
      if (e.key === 'Escape' && !isTyping(e.target) && active) {
        // Avoid swallowing Esc when the active window is the Terminal — it
        // doesn't bind Esc but its focus stays inside the input.
        store.closeWindow(active);
        return;
      }

      // Alt+Tab → cycle through open, non-minimized windows
      if (e.key === 'Tab' && e.altKey) {
        e.preventDefault();
        const list = store.openWindows.filter((w) => !w.minimized);
        if (list.length < 2) return;
        const idx = list.findIndex((w) => w.id === active);
        const next = list[(idx + 1) % list.length];
        if (next) store.focusWindow(next.id);
      }

      // Ctrl+M → toggle minimize on active window
      if (e.key === 'm' && e.ctrlKey && active && !isTyping(e.target)) {
        e.preventDefault();
        store.minimizeWindow(active);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

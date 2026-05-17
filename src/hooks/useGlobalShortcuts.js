import { useEffect } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA']);

function isTyping(target) {
  if (!target) return false;
  if (target.isContentEditable) return true;
  if (target.tagName && TYPING_TAGS.has(target.tagName)) return true;
  return false;
}

// Keep this small. Browsers/OSes claim Alt+Tab, Ctrl+M, Alt+F4, etc. — so we
// only own keys that don't conflict.
export function useGlobalShortcuts() {
  useEffect(() => {
    const onKey = (e) => {
      const store = useDesktopStore.getState();
      const active = store.activeWindowId;

      // Esc closes the active window — but never while the user is typing.
      if (e.key === 'Escape' && !isTyping(e.target) && active) {
        store.closeWindow(active);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

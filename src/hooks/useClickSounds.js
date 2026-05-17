import { useEffect } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';
import { soundManager } from '../utils/soundManager';

export function useClickSounds() {
  const enabled = useDesktopStore((s) => s.soundEnabled);

  useEffect(() => {
    soundManager.setEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    const down = () => soundManager.playDown();
    const up = () => soundManager.playUp();
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup', up);
    };
  }, []);
}

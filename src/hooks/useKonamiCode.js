import { useEffect, useRef } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';

const SEQ = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode() {
  const triggerConfetti = useDesktopStore((s) => s.triggerConfetti);
  const idxRef = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      const expected = SEQ[idxRef.current];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        idxRef.current += 1;
        if (idxRef.current >= SEQ.length) {
          idxRef.current = 0;
          triggerConfetti();
        }
      } else {
        // Allow false-start: if user pressed the first key, reset to 1, else 0
        idxRef.current = key === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [triggerConfetti]);
}

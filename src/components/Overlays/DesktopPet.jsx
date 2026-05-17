import { useEffect, useRef, useState } from 'react';
import './DesktopPet.css';

const SPEED = 50; // px per second
const STATES = ['walk', 'walk', 'idle', 'sleep'];

export function DesktopPet() {
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [dir, setDir] = useState(1);
  const [mode, setMode] = useState('walk');
  const [reaction, setReaction] = useState(null);
  const stateRef = useRef({ pos: { x: 200, y: 200 }, dir: 1, mode: 'walk' });

  useEffect(() => {
    let raf;
    let last = performance.now();
    let modeTimer = 0;
    let modeUntil = performance.now() + 3000;

    const pickMode = () => {
      const next = STATES[Math.floor(Math.random() * STATES.length)];
      stateRef.current.mode = next;
      setMode(next);
      if (next === 'walk' && Math.random() < 0.5) {
        stateRef.current.dir = -stateRef.current.dir;
        setDir(stateRef.current.dir);
      }
      modeUntil = performance.now() + 2500 + Math.random() * 4000;
    };

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const s = stateRef.current;
      if (s.mode === 'walk') {
        s.pos.x += s.dir * SPEED * dt;
        const bound = window.innerWidth - 64;
        if (s.pos.x < 0) {
          s.pos.x = 0;
          s.dir = 1;
          setDir(1);
        } else if (s.pos.x > bound) {
          s.pos.x = bound;
          s.dir = -1;
          setDir(-1);
        }
        setPos({ x: s.pos.x, y: s.pos.y });
      }
      if (now >= modeUntil) pickMode();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const place = () => {
      const y = Math.max(60, window.innerHeight - 100);
      stateRef.current.pos.y = y;
      setPos((p) => ({ ...p, y }));
    };
    place();
    window.addEventListener('resize', place);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', place);
    };
  }, []);

  const onClick = () => {
    setReaction('!');
    setTimeout(() => setReaction(null), 1000);
  };

  const glyph = mode === 'sleep' ? '😴' : '🐈';

  return (
    <div
      className="desktop-pet"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `scaleX(${dir})`,
      }}
      onClick={onClick}
      title="A friendly desktop pet"
    >
      {reaction ? <div className="pet-reaction">{reaction}</div> : null}
      <div className="pet-glyph">{glyph}</div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import './DesktopPet.css';

const SPEED = 50; // px per second
const STATES = ['walk', 'walk', 'idle', 'sleep'];

const SAYINGS = [
  'meow.',
  'i live in your taskbar.',
  'try typing "matrix" in the terminal.',
  'aditya feeds me CUDA cores.',
  '*purrs in binary*',
  'have you tried Minesweeper yet?',
  'the Konami code does something.',
  'i\'ve seen the BSOD. it\'s beautiful.',
  'i nap. i wander. i judge your wallpaper.',
  '404: motivation not found.',
  'hire aditya. (he didn\'t pay me to say this. mostly.)',
  'right-click on Minesweeper to flag tiles.',
  'lane segmentation? more like *line* segmentation. *winks*',
  'i hold strong opinions on tabs vs spaces.',
  'tip: press Esc to close the active window.',
];

export function DesktopPet() {
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [dir, setDir] = useState(1);
  const [mode, setMode] = useState('walk');
  const [bubble, setBubble] = useState(null);
  const stateRef = useRef({ pos: { x: 200, y: 200 }, dir: 1, mode: 'walk' });
  const bubbleTimer = useRef(null);

  useEffect(() => {
    let raf;
    let last = performance.now();
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
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    };
  }, []);

  const onClick = (e) => {
    e.stopPropagation();
    // pop a speech bubble; stop the pet briefly so it doesn't run off
    const saying = SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
    setBubble(saying);
    stateRef.current.mode = 'idle';
    setMode('idle');
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 3500);
  };

  const glyph = mode === 'sleep' ? '😴' : '🐈';

  return (
    <div
      className="desktop-pet"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onClick}
      title="A friendly desktop pet"
    >
      {bubble ? (
        <div className="pet-bubble win95-outset">
          <div className="pet-bubble-text">{bubble}</div>
        </div>
      ) : null}
      <div className="pet-glyph" style={{ transform: `scaleX(${dir})` }}>
        {glyph}
      </div>
    </div>
  );
}

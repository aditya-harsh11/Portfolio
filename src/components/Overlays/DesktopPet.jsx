import { useEffect, useRef, useState } from 'react';
import './DesktopPet.css';

const SPEED = 50; // px per second
const STATES = ['walk', 'walk', 'idle', 'sleep'];

const SAYINGS = [
  'quack.',
  'tell me about your bug.',
  'have you tried turning it off and on again?',
  'i am a rubber duck. talk to me.',
  '*judges your code silently*',
  'try the Konami code.',
  'press Esc to close the active window.',
  'have you tried Minesweeper yet?',
  '*nods sympathetically at your stack trace*',
  '404: motivation not found.',
  'hire aditya. (he didn\'t pay me to say this. mostly.)',
  'rubber duck > stack overflow.',
  'i float in your debugger.',
  'tip: ask your problem out loud.',
  'i hold strong opinions on tabs vs spaces.',
  'the bug is on line 47. trust me.',
];

function RubberDuck() {
  // Classic yellow bath-toy rubber duck, ~36px tall.
  return (
    <svg
      viewBox="0 0 44 40"
      width="40"
      height="36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* body */}
      <ellipse cx="24" cy="26" rx="16" ry="11" fill="#ffd84d" stroke="#000" strokeWidth="1.5" />
      {/* tail */}
      <path d="M9 22 L4 18 L8 23 Z" fill="#ffd84d" stroke="#000" strokeWidth="1.5" strokeLinejoin="miter" />
      {/* head */}
      <circle cx="14" cy="14" r="10" fill="#ffd84d" stroke="#000" strokeWidth="1.5" />
      {/* hair tuft */}
      <path d="M13 4 Q14 1 16 4" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      {/* beak */}
      <path d="M4 14 Q-1 16 4 19 L9 18 Q9 15 9 13 Z" fill="#ff9b1c" stroke="#000" strokeWidth="1.4" strokeLinejoin="miter" />
      <line x1="3" y1="17" x2="9" y2="16.5" stroke="#000" strokeWidth="0.8" />
      {/* eye */}
      <circle cx="12" cy="12" r="2" fill="#fff" stroke="#000" strokeWidth="0.8" />
      <circle cx="12.4" cy="12.4" r="1" fill="#000" />
      {/* wing */}
      <path d="M22 22 Q28 22 32 27" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
      {/* highlight */}
      <path d="M18 8 Q21 7 23 9" fill="none" stroke="#fff7c0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
    const saying = SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
    setBubble(saying);
    stateRef.current.mode = 'idle';
    setMode('idle');
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 1800);
  };

  const sleeping = mode === 'sleep';

  return (
    <div
      className="desktop-pet"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onClick}
      title="A friendly rubber duck. Click me."
    >
      {bubble ? (
        <div className="pet-bubble win95-outset">
          <div className="pet-bubble-text">{bubble}</div>
        </div>
      ) : null}
      <div className="pet-glyph" style={{ transform: `scaleX(${dir})` }}>
        {sleeping ? <span className="pet-sleep">😴</span> : <RubberDuck />}
      </div>
    </div>
  );
}

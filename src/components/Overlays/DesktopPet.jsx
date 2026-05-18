import { useEffect, useRef, useState } from 'react';
import './DesktopPet.css';

const SPEED = 50; // px per second
const STATES = ['walk', 'walk', 'idle', 'sleep'];

const SAYINGS = [
  // duck-debugging staples
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
  // site tips
  'browsing a portfolio? open Projects.',
  'try typing "tree" in the Terminal — there\'s a whole file system in there.',
  'Konami code: ↑ ↑ ↓ ↓ ← → ← → B A. just saying.',
  'recruiters: aditya loves coffee and 4.0 GPAs equally.',
  'Settings lets you change the wallpaper.',
  'try "matrix" in the Terminal. or "bsod" if you\'re feeling brave.',
  'drag any desktop icon to a new spot — positions persist.',
  'right-click a Minesweeper tile to flag it.',
  'nine games in here. find them all in the Games folder.',
  'you can resize any window from the edges or corners.',
  'aditya pulled a 4.0/4.0 once. it stuck.',
  'hire him. (the duck made me say that.)',
  'the Recycle Bin remembers windows you\'ve closed.',
  'in the Terminal, hit Tab to autocomplete paths.',
  'type "neofetch" in the Terminal. you won\'t regret it.',
  'try " anything" in the Terminal.',
  'type "theme amber" in the Terminal to swap colors.',
  'open Settings to mute the click sounds.',
  'My Computer → PORTFOLIO has the full resume as files. try cat on any of them.',
  'looking for a software engineer? let\'s talk.',
  'GitHub: aditya-harsh11. stars and follows accepted as currency.',
  'CS @ UW-Madison, class of 2028. available for summer 2026 internships.',
  '90% of aditya\'s code is asserts. the other 10% trips them.',
  'type "hack" in the Terminal. enjoy.',
  'try the Internet icon. there\'s a dino in there.',
];

function RubberDuck() {
  return (
    <img
      src="/images/duck.png"
      width={44}
      height={44}
      alt=""
      draggable={false}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
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

import { useEffect, useRef, useState } from 'react';
import './Clippy.css';

const STORAGE_KEY = 'clippy:disabled';
const FIRST_DELAY_MS = 5000;
const REAPPEAR_MIN_MS = 30000;
const REAPPEAR_MAX_MS = 40000;

const SAYINGS = [
  // classic Clippy openers
  'It looks like you\'re browsing a portfolio. Would you like some help?',
  'It looks like you\'re trying to read source code. Open the Terminal.',
  'Hi! I\'m Clippy. Have you tried the Konami code yet?',
  // debugging staples
  'tell me about your bug.',
  'have you tried turning it off and on again?',
  'It looks like you need someone to talk to. I\'m listening.',
  'judges your code silently',
  'nods sympathetically at your stack trace',
  '404: motivation not found.',
  'hire aditya. (he didn\'t pay me to say this. mostly.)',
  'rubber duck > stack overflow.',
  'i hold strong opinions on tabs vs spaces.',
  'the bug is on line 47. trust me.',
  // site tips
  'have you tried Minesweeper yet?',
  'try typing "tree" in the Terminal — there\'s a whole file system in there.',
  'Settings lets you change the wallpaper.',
  'try "matrix" in the Terminal. or "bsod" if you\'re feeling brave.',
  'drag any desktop icon to a new spot — positions persist.',
  'nine games in here. find them all in the Games folder.',
  'you can resize any window from the edges or corners.',
  'aditya pulled a 4.0/4.0 once. it stuck.',
  'the Recycle Bin remembers windows you\'ve closed.',
  'in the Terminal, hit Tab to autocomplete paths.',
  'type "neofetch" in the Terminal. you won\'t regret it.',
  'type "theme amber" in the Terminal to swap colors.',
  'open Settings to mute the click sounds.',
  'My Computer → PORTFOLIO has the full resume as files. try cat on any of them.',
  'looking for a software engineer? let\'s talk.',
  'GitHub: aditya-harsh11. stars and follows accepted as currency.',
  'Aditya is available for summer 2026 internships.',
  '90% of aditya\'s code is asserts. the other 10% trips them.',
  'type "hack" in the Terminal. enjoy.',
  'try the Internet icon. there\'s a dino in there.',
];

function pickSaying(prev) {
  if (SAYINGS.length <= 1) return SAYINGS[0];
  let next = SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
  while (next === prev) {
    next = SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
  }
  return next;
}

export function Clippy() {
  const [disabled, setDisabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(false);
  const [saying, setSaying] = useState('');
  const reappearTimer = useRef(null);
  const lastSaying = useRef('');

  useEffect(() => {
    if (disabled) return undefined;

    const show = () => {
      const next = pickSaying(lastSaying.current);
      lastSaying.current = next;
      setSaying(next);
      setVisible(true);
    };

    reappearTimer.current = setTimeout(show, FIRST_DELAY_MS);

    return () => {
      if (reappearTimer.current) clearTimeout(reappearTimer.current);
    };
  }, [disabled]);

  const scheduleNext = () => {
    if (reappearTimer.current) clearTimeout(reappearTimer.current);
    const delay =
      REAPPEAR_MIN_MS + Math.random() * (REAPPEAR_MAX_MS - REAPPEAR_MIN_MS);
    reappearTimer.current = setTimeout(() => {
      const next = pickSaying(lastSaying.current);
      lastSaying.current = next;
      setSaying(next);
      setVisible(true);
    }, delay);
  };

  const onDismiss = () => {
    setVisible(false);
    scheduleNext();
  };

  const onDisable = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // localStorage unavailable — still hide for this session
    }
    if (reappearTimer.current) clearTimeout(reappearTimer.current);
    setVisible(false);
    setDisabled(true);
  };

  if (disabled || !visible) return null;

  return (
    <div className="clippy-root" role="dialog" aria-label="Clippy assistant">
      <div className="clippy-bubble win95-outset">
        <div className="clippy-bubble-text">{saying}</div>
        <div className="clippy-bubble-actions">
          <button className="win95-button clippy-btn" onClick={onDismiss}>
            Dismiss
          </button>
          <button className="win95-button clippy-btn" onClick={onDisable}>
            Don&apos;t show again
          </button>
        </div>
      </div>
      <img
        className="clippy-img"
        src="/images/clippy.png"
        alt="Clippy"
        draggable={false}
      />
    </div>
  );
}

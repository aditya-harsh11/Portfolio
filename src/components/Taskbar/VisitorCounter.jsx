import { useEffect, useState } from 'react';
import './VisitorCounter.css';

const KEY = 'visitorCount';
const SESSION_FLAG = 'visitCounted';

function pad(n, len) {
  return n.toString().padStart(len, '0');
}

// Local-only visit counter. Increments once per browser session.
// Swap for a real counter API later if you want a global count — keep this
// pure-local so the site has zero third-party dependencies by default.
export function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let raw = Number(localStorage.getItem(KEY)) || 0;
    if (sessionStorage.getItem(SESSION_FLAG) !== '1') {
      raw += 1;
      localStorage.setItem(KEY, String(raw));
      sessionStorage.setItem(SESSION_FLAG, '1');
    }
    setCount(raw);
  }, []);

  return (
    <div className="visitor-counter" title="Local visit count (this browser)">
      {count === null
        ? '------'.split('').map((d, i) => (
            <span key={i} className="vc-digit">
              {d}
            </span>
          ))
        : pad(count, 6)
            .split('')
            .map((d, i) => (
              <span key={i} className="vc-digit">
                {d}
              </span>
            ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import './VisitorCounter.css';

const KEY = 'visitorCount';
const SESSION_FLAG = 'visitCounted';
const ENDPOINT = 'https://api.counterapi.dev/v1/aditya-portfolio/visits';

function pad(n, len) {
  return n.toString().padStart(len, '0');
}

// Global visit counter via counterapi.dev (free, no auth).
// Increments once per browser session (sessionStorage de-dupes refreshes).
// Falls back to last cached value if the API is unreachable.
export function VisitorCounter() {
  const [count, setCount] = useState(() => {
    const cached = Number(localStorage.getItem(KEY));
    return Number.isFinite(cached) && cached > 0 ? cached : null;
  });

  useEffect(() => {
    const shouldIncrement = sessionStorage.getItem(SESSION_FLAG) !== '1';
    const url = shouldIncrement ? `${ENDPOINT}/up` : `${ENDPOINT}/`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        const n = j?.count;
        if (typeof n !== 'number') return;
        setCount(n);
        localStorage.setItem(KEY, String(n));
        if (shouldIncrement) sessionStorage.setItem(SESSION_FLAG, '1');
      })
      .catch(() => {});
  }, []);

  const digits = (count === null ? '------' : pad(count, 6)).split('');

  return (
    <div className="visitor-counter" title="Global visit count">
      {digits.map((d, i) => (
        <span key={i} className="vc-digit">
          {d}
        </span>
      ))}
    </div>
  );
}

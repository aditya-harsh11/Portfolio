import { useEffect, useState } from 'react';

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const i = setInterval(tick, 15000);
    return () => clearInterval(i);
  }, []);
  return now;
}

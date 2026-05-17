import { useClock } from '../../hooks/useClock';

function fmt(d) {
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function Clock() {
  const now = useClock();
  return (
    <div className="clock" title={now.toLocaleString()}>
      {fmt(now)}
    </div>
  );
}

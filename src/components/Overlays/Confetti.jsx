import { useEffect, useMemo } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import './Confetti.css';

const COLORS = ['#ff4040', '#40c0ff', '#ffd040', '#40ff80', '#c040ff', '#ff80c0'];

export function Confetti() {
  const active = useDesktopStore((s) => s.confettiActive);
  const dismiss = useDesktopStore((s) => s.dismissConfetti);

  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 220 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 2.5 + Math.random() * 4,
      delay: Math.random() * 1.5,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      size: 5 + Math.random() * 10,
    }));
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(dismiss, 7000);
    return () => clearTimeout(t);
  }, [active, dismiss]);

  if (!active) return null;

  return (
    <div className="confetti-overlay">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

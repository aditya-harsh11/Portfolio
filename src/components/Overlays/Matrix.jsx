import { useEffect, useRef } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import './Matrix.css';

const CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ABCDEFGH';

export function Matrix() {
  const active = useDesktopStore((s) => s.matrixActive);
  const dismiss = useDesktopStore((s) => s.dismissMatrix);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const fontSize = 16;
    let cols = 0;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -canvas.height);
    };
    resize();
    // Fill initial black background so we don't see desktop bleed through.
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.addEventListener('resize', resize);

    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = now - last;
      if (dt > 50) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillText(char, i * fontSize, drops[i]);
          drops[i] += fontSize;
          if (drops[i] > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
        }
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Auto exit after 10s
    const auto = setTimeout(dismiss, 10000);

    // Grace period before listening for dismiss — otherwise the keypress/click
    // that triggered the matrix call closes it immediately.
    const onDismiss = () => dismiss();
    const armId = setTimeout(() => {
      document.addEventListener('keydown', onDismiss);
      document.addEventListener('mousedown', onDismiss);
    }, 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(auto);
      clearTimeout(armId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('keydown', onDismiss);
      document.removeEventListener('mousedown', onDismiss);
    };
  }, [active, dismiss]);

  if (!active) return null;
  return (
    <div className="matrix-overlay">
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="matrix-hint">click or press any key to exit</div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import '../games.css';

const W = 520;
const H = 360;
const PADDLE_W = 8;
const PADDLE_H = 64;
const PADDLE_SPEED = 6;
const BALL_R = 6;

export function Pong() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ball: { x: W / 2, y: H / 2, vx: 4, vy: 3 },
    keys: { up: false, down: false },
    paused: false,
  });
  const [scores, setScores] = useState({ player: 0, ai: 0 });

  const reset = (winner) => {
    const s = stateRef.current;
    s.ball.x = W / 2;
    s.ball.y = H / 2;
    s.ball.vx = (winner === 'player' ? -1 : 1) * 4;
    s.ball.vy = (Math.random() - 0.5) * 6;
  };

  useEffect(() => {
    const onDown = (e) => {
      const s = stateRef.current;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') s.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') s.keys.down = true;
      if (e.key === 'p' || e.key === 'P') s.paused = !s.paused;
    };
    const onUp = (e) => {
      const s = stateRef.current;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') s.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') s.keys.down = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useEffect(() => {
    let raf;
    const loop = () => {
      const s = stateRef.current;
      if (!s.paused) {
        // player movement
        if (s.keys.up) s.playerY = Math.max(0, s.playerY - PADDLE_SPEED);
        if (s.keys.down) s.playerY = Math.min(H - PADDLE_H, s.playerY + PADDLE_SPEED);
        // ai movement: chase ball y
        const center = s.aiY + PADDLE_H / 2;
        if (s.ball.y < center - 10) s.aiY -= 4;
        else if (s.ball.y > center + 10) s.aiY += 4;
        s.aiY = Math.max(0, Math.min(H - PADDLE_H, s.aiY));
        // ball
        s.ball.x += s.ball.vx;
        s.ball.y += s.ball.vy;
        // wall bounce
        if (s.ball.y < BALL_R) {
          s.ball.y = BALL_R;
          s.ball.vy = -s.ball.vy;
        }
        if (s.ball.y > H - BALL_R) {
          s.ball.y = H - BALL_R;
          s.ball.vy = -s.ball.vy;
        }
        // paddle bounce — player (left)
        if (
          s.ball.x - BALL_R <= PADDLE_W &&
          s.ball.y >= s.playerY &&
          s.ball.y <= s.playerY + PADDLE_H
        ) {
          s.ball.x = PADDLE_W + BALL_R;
          s.ball.vx = -s.ball.vx * 1.04;
          s.ball.vy += ((s.ball.y - (s.playerY + PADDLE_H / 2)) / PADDLE_H) * 4;
        }
        // paddle bounce — AI (right)
        if (
          s.ball.x + BALL_R >= W - PADDLE_W &&
          s.ball.y >= s.aiY &&
          s.ball.y <= s.aiY + PADDLE_H
        ) {
          s.ball.x = W - PADDLE_W - BALL_R;
          s.ball.vx = -s.ball.vx * 1.04;
          s.ball.vy += ((s.ball.y - (s.aiY + PADDLE_H / 2)) / PADDLE_H) * 4;
        }
        // scoring
        if (s.ball.x < -10) {
          setScores((sc) => ({ ...sc, ai: sc.ai + 1 }));
          reset('ai');
        } else if (s.ball.x > W + 10) {
          setScores((sc) => ({ ...sc, player: sc.player + 1 }));
          reset('player');
        }
      }
      // draw
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#444';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(W / 2, 0);
        ctx.lineTo(W / 2, H);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, s.playerY, PADDLE_W, PADDLE_H);
        ctx.fillRect(W - PADDLE_W, s.aiY, PADDLE_W, PADDLE_H);
        ctx.beginPath();
        ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="game-window">
      <div className="game-hud">
        <div>You: <strong>{scores.player}</strong></div>
        <div>CPU: <strong>{scores.ai}</strong></div>
        <div className="game-status right">↑/↓ or W/S to move · P pause</div>
      </div>
      <div className="game-stage win95-inset">
        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />
      </div>
    </div>
  );
}

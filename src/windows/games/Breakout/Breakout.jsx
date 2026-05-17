import { useEffect, useRef, useState } from 'react';
import '../games.css';

const W = 480;
const H = 380;
const PADDLE_W = 80;
const PADDLE_H = 10;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_W = W / BRICK_COLS;
const BRICK_H = 18;
const BRICK_PAD = 2;
const COLORS = ['#ff3838', '#ff9933', '#ffd83d', '#33d978', '#3399ff'];

const BALL_SPEED = 2.2;
const PADDLE_SPEED = 5;

function newBricks() {
  const out = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      out.push({ r, c, alive: true });
    }
  }
  return out;
}

export function Breakout() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    ball: { x: W / 2, y: H - 40, vx: BALL_SPEED, vy: -BALL_SPEED },
    bricks: newBricks(),
    lives: 3,
    over: false,
    won: false,
    keys: { left: false, right: false },
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState('play');

  const reset = () => {
    stateRef.current = {
      paddleX: W / 2 - PADDLE_W / 2,
      ball: { x: W / 2, y: H - 40, vx: BALL_SPEED, vy: -BALL_SPEED },
      bricks: newBricks(),
      lives: 3,
      over: false,
      won: false,
      keys: { left: false, right: false },
    };
    setScore(0);
    setLives(3);
    setStatus('play');
  };

  useEffect(() => {
    const onDown = (e) => {
      const s = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') s.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') s.keys.right = true;
      if (e.key === 'r' || e.key === 'R') reset();
    };
    const onUp = (e) => {
      const s = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') s.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') s.keys.right = false;
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
      if (!s.over && !s.won) {
        if (s.keys.left) s.paddleX = Math.max(0, s.paddleX - PADDLE_SPEED);
        if (s.keys.right) s.paddleX = Math.min(W - PADDLE_W, s.paddleX + PADDLE_SPEED);
        const b = s.ball;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < BALL_R || b.x > W - BALL_R) b.vx = -b.vx;
        if (b.y < BALL_R) b.vy = -b.vy;
        // paddle collision
        if (
          b.y + BALL_R >= H - PADDLE_H - 6 &&
          b.x >= s.paddleX &&
          b.x <= s.paddleX + PADDLE_W &&
          b.vy > 0
        ) {
          b.vy = -b.vy;
          b.vx += ((b.x - (s.paddleX + PADDLE_W / 2)) / PADDLE_W) * 1.4;
          // cap vx so it doesn't spiral out of control
          if (Math.abs(b.vx) > BALL_SPEED * 1.6) {
            b.vx = Math.sign(b.vx) * BALL_SPEED * 1.6;
          }
        }
        if (b.y > H + BALL_R) {
          s.lives -= 1;
          setLives(s.lives);
          if (s.lives <= 0) {
            s.over = true;
            setStatus('lose');
          } else {
            b.x = W / 2;
            b.y = H - 40;
            b.vx = BALL_SPEED * (Math.random() < 0.5 ? -1 : 1);
            b.vy = -BALL_SPEED;
          }
        }
        // bricks
        for (const brick of s.bricks) {
          if (!brick.alive) continue;
          const bx = brick.c * BRICK_W + BRICK_PAD;
          const by = brick.r * BRICK_H + BRICK_PAD + 20;
          const bw = BRICK_W - BRICK_PAD * 2;
          const bh = BRICK_H - BRICK_PAD * 2;
          if (b.x + BALL_R > bx && b.x - BALL_R < bx + bw && b.y + BALL_R > by && b.y - BALL_R < by + bh) {
            brick.alive = false;
            b.vy = -b.vy;
            setScore((sc) => sc + 10);
          }
        }
        if (s.bricks.every((br) => !br.alive)) {
          s.won = true;
          setStatus('win');
        }
      }
      // draw
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        // bricks
        for (const brick of s.bricks) {
          if (!brick.alive) continue;
          ctx.fillStyle = COLORS[brick.r % COLORS.length];
          const bx = brick.c * BRICK_W + BRICK_PAD;
          const by = brick.r * BRICK_H + BRICK_PAD + 20;
          ctx.fillRect(bx, by, BRICK_W - BRICK_PAD * 2, BRICK_H - BRICK_PAD * 2);
        }
        // paddle
        ctx.fillStyle = '#fff';
        ctx.fillRect(s.paddleX, H - PADDLE_H - 6, PADDLE_W, PADDLE_H);
        // ball
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
        <div>Score: <strong>{score}</strong></div>
        <div>Lives: <strong>{lives}</strong></div>
        <div className="game-status right">
          {status === 'lose'
            ? 'GAME OVER — R to restart'
            : status === 'win'
            ? 'YOU WIN — R to play again'
            : '← → or A/D · R reset'}
        </div>
      </div>
      <div className="game-stage win95-inset">
        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import './DinoGame.css';

const W = 600;
const H = 180;
const GROUND = 150;
const GRAVITY = 2100;
const JUMP_V = -560;
const DINO_X = 40;
const DINO_W = 56;
const DINO_H = 56;
const DINO_COLOR = '#535353';
// Tighter collision hitbox: skip the transparent margins + tail of the sprite
const HIT_OFFSET_X = 14;
const HIT_W = 32;
const HIT_OFFSET_Y = 6;

function drawDino(ctx, img, x, y, dead) {
  if (!img.complete || img.naturalWidth === 0) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, x, y, DINO_W, DINO_H);
  if (dead) {
    // Overlay X eyes on top of the sprite's eye area.
    const ex = x + Math.round(DINO_W * 0.66);
    const ey = y + Math.round(DINO_H * 0.13);
    ctx.fillStyle = '#fff';
    ctx.fillRect(ex, ey, 6, 6);
    ctx.fillStyle = DINO_COLOR;
    ctx.fillRect(ex, ey, 2, 2);
    ctx.fillRect(ex + 4, ey, 2, 2);
    ctx.fillRect(ex + 2, ey + 2, 2, 2);
    ctx.fillRect(ex, ey + 4, 2, 2);
    ctx.fillRect(ex + 4, ey + 4, 2, 2);
  }
}

function drawCactus(ctx, ox, h) {
  ctx.fillStyle = '#535353';
  const top = GROUND - h;
  const trunkX = ox + 4;
  ctx.fillRect(trunkX, top, 6, h);
  ctx.fillRect(trunkX + 1, top - 1, 4, 1);
  // Left arm
  const armY = top + Math.max(4, Math.floor(h * 0.40));
  ctx.fillRect(trunkX - 5, armY, 5, 2);
  ctx.fillRect(trunkX - 5, armY - 6, 2, 8);
  // Right arm
  const armY2 = top + Math.max(8, Math.floor(h * 0.20));
  ctx.fillRect(trunkX + 6, armY2, 5, 2);
  ctx.fillRect(trunkX + 9, armY2 - 6, 2, 8);
}

export function DinoGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('ie:dinoHigh') || '0', 10)
  );
  const [gameOver, setGameOver] = useState(false);
  const highRef = useRef(0);
  highRef.current = highScore;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = W;
    canvas.height = H;

    const dinoImg = new Image();
    dinoImg.src = '/images/chrome-dino.png';

    const state = {
      dinoY: 0,
      dinoVy: 0,
      obstacles: [],
      speed: 240,
      spawnIn: 1.4,
      elapsed: 0,
      over: false,
      started: false,
    };

    const reset = () => {
      state.dinoY = 0;
      state.dinoVy = 0;
      state.obstacles = [];
      state.speed = 240;
      state.spawnIn = 1.4;
      state.elapsed = 0;
      state.over = false;
      state.started = true;
      setScore(0);
      setGameOver(false);
    };

    const jump = () => {
      if (state.over) {
        reset();
        return;
      }
      if (!state.started) {
        state.started = true;
      }
      if (state.dinoY === 0) state.dinoVy = JUMP_V;
    };

    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Spacebar') {
        e.preventDefault();
        jump();
      }
    };
    document.addEventListener('keydown', onKey);
    canvas.addEventListener('mousedown', jump);

    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (state.started && !state.over) {
        state.elapsed += dt;
        state.speed += dt * 6;

        state.dinoVy += GRAVITY * dt;
        state.dinoY += state.dinoVy * dt;
        if (state.dinoY > 0) {
          state.dinoY = 0;
          state.dinoVy = 0;
        }

        state.spawnIn -= dt;
        if (state.spawnIn <= 0) {
          // Cluster size: 55% single, 30% pair, 15% triple
          const r = Math.random();
          const count = r < 0.55 ? 1 : r < 0.85 ? 2 : 3;
          const isTall = Math.random() < 0.25;
          const baseH = isTall ? 38 + Math.random() * 8 : 24 + Math.random() * 10;
          for (let k = 0; k < count; k++) {
            state.obstacles.push({
              x: W + k * 16,
              w: 14,
              h: isTall ? baseH : 22 + Math.random() * 14,
            });
          }
          state.spawnIn = 1.0 + Math.random() * 1.4 + count * 0.25;
        }

        state.obstacles.forEach((o) => {
          o.x -= state.speed * dt;
        });
        state.obstacles = state.obstacles.filter((o) => o.x > -50);

        const dinoTop = GROUND - DINO_H + state.dinoY;
        const hbX = DINO_X + HIT_OFFSET_X;
        const hbW = HIT_W;
        for (const o of state.obstacles) {
          if (
            o.x < hbX + hbW &&
            o.x + o.w > hbX &&
            GROUND - o.h < dinoTop + DINO_H - HIT_OFFSET_Y
          ) {
            state.over = true;
            const final = Math.floor(state.elapsed * 10);
            setScore(final);
            setGameOver(true);
            if (final > highRef.current) {
              setHighScore(final);
              localStorage.setItem('ie:dinoHigh', String(final));
            }
            break;
          }
        }

        setScore(Math.floor(state.elapsed * 10));
      }

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.fillStyle = '#535353';
      ctx.fillRect(0, GROUND, W, 1);
      // Ground pebbles, scrolling
      const offset = state.started ? (state.elapsed * state.speed) % 30 : 0;
      for (let gx = -offset; gx < W; gx += 30) {
        ctx.fillRect(gx, GROUND + 3, 6, 1);
        ctx.fillRect(gx + 14, GROUND + 5, 3, 1);
      }

      // Dino
      const dy = GROUND - DINO_H + state.dinoY;
      drawDino(ctx, dinoImg, DINO_X, dy, state.over);

      // Obstacles (black cactuses)
      state.obstacles.forEach((o) => drawCactus(ctx, o.x, o.h));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="dino-page">
      <div className="dino-error-banner">
        <div className="dino-err-icon">⚠</div>
        <div>
          <strong>No internet</strong>
          <div className="dino-err-sub">Try:
            <br />• Checking the network cables, modem, and router
            <br />• Reconnecting to Wi-Fi
            <br />• Pressing SPACE
          </div>
        </div>
      </div>
      <div className="dino-stage">
        <div className="dino-score">
          HI {String(Math.max(highScore, score)).padStart(5, '0')}{' '}
          <span className="dino-score-cur">{String(score).padStart(5, '0')}</span>
        </div>
        <canvas ref={canvasRef} className="dino-canvas" />
        {gameOver ? (
          <div className="dino-overlay">
            <div className="dino-go">G A M E &nbsp; O V E R</div>
            <div className="dino-hint">space / click to restart</div>
          </div>
        ) : score === 0 ? (
          <div className="dino-overlay dino-overlay-start">
            <div className="dino-hint">press SPACE or click to start</div>
          </div>
        ) : null}
      </div>
      <div className="dino-footer">ERR_INTERNET_DISCONNECTED</div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import './Snake.css';

const COLS = 28;
const ROWS = 20;
const CELL = 18;
const W = COLS * CELL;
const H = ROWS * CELL;
const BASE_SPEED = 140; // ms per tick
const SPEED_FLOOR = 60;

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function randCell(snake) {
  while (true) {
    const c = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!snake.some((s) => s.x === c.x && s.y === c.y)) return c;
  }
}

function initialSnake() {
  return [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ];
}

export function Snake() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    snake: initialSnake(),
    dir: { x: 1, y: 0 },
    pendingDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    alive: true,
    paused: false,
    score: 0,
  });
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(() => {
    const v = Number(localStorage.getItem('snakeHigh'));
    return Number.isFinite(v) ? v : 0;
  });
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const reset = () => {
    stateRef.current = {
      snake: initialSnake(),
      dir: { x: 1, y: 0 },
      pendingDir: { x: 1, y: 0 },
      food: randCell(initialSnake()),
      alive: true,
      paused: false,
      score: 0,
    };
    setScore(0);
    setGameOver(false);
    setPaused(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setPaused((p) => {
          stateRef.current.paused = !p;
          return !p;
        });
        e.preventDefault();
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        reset();
        e.preventDefault();
        return;
      }
      const d = DIRS[e.key];
      if (!d) return;
      const cur = stateRef.current.dir;
      // Disallow reversing onto self
      if (cur.x + d.x === 0 && cur.y + d.y === 0) return;
      stateRef.current.pendingDir = d;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let raf;
    let lastTick = performance.now();
    let tickMs = BASE_SPEED;

    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, H);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(W, y * CELL);
        ctx.stroke();
      }

      // food
      const { snake, food } = stateRef.current;
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

      // snake
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#aaffaa' : '#33dd33';
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });

      // eyes on head
      const head = snake[0];
      const { dir } = stateRef.current;
      ctx.fillStyle = '#000';
      const eyeOffsets = [
        { x: 5, y: 5 },
        { x: CELL - 7, y: 5 },
      ];
      eyeOffsets.forEach((o) => {
        ctx.fillRect(
          head.x * CELL + o.x + dir.x * 2,
          head.y * CELL + o.y + dir.y * 2,
          2,
          2
        );
      });
    };

    const tick = () => {
      const s = stateRef.current;
      if (!s.alive || s.paused) return;
      s.dir = s.pendingDir;
      const head = s.snake[0];
      const nx = head.x + s.dir.x;
      const ny = head.y + s.dir.y;

      // walls
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
        s.alive = false;
        setGameOver(true);
        return;
      }
      // self
      if (s.snake.some((seg) => seg.x === nx && seg.y === ny)) {
        s.alive = false;
        setGameOver(true);
        return;
      }

      const newHead = { x: nx, y: ny };
      const ate = nx === s.food.x && ny === s.food.y;
      const newSnake = ate ? [newHead, ...s.snake] : [newHead, ...s.snake.slice(0, -1)];
      s.snake = newSnake;
      if (ate) {
        s.food = randCell(newSnake);
        s.score += 10;
        setScore(s.score);
        if (s.score > high) {
          setHigh(s.score);
          localStorage.setItem('snakeHigh', String(s.score));
        }
        tickMs = Math.max(SPEED_FLOOR, BASE_SPEED - Math.floor(s.score / 40) * 8);
      }
    };

    const loop = (now) => {
      if (now - lastTick >= tickMs) {
        tick();
        lastTick = now;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [high]);

  return (
    <div className="snake-window">
      <div className="snake-hud">
        <div>Score: <strong>{score}</strong></div>
        <div>High: <strong>{high}</strong></div>
        <div className="snake-status">
          {gameOver ? 'GAME OVER — R to restart' : paused ? 'PAUSED — P to resume' : 'Arrow keys / WASD · P pause · R reset'}
        </div>
      </div>
      <div className="snake-canvas-wrap win95-inset">
        <canvas ref={canvasRef} width={W} height={H} className="snake-canvas" />
      </div>
    </div>
  );
}

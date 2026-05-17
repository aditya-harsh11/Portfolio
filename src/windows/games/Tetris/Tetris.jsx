import { useEffect, useRef, useState } from 'react';
import '../games.css';

const COLS = 10;
const ROWS = 20;
const CELL = 22;
const W = COLS * CELL;
const H = ROWS * CELL;

const COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const KEYS = Object.keys(SHAPES);

function emptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function rotate(shape) {
  const h = shape.length;
  const w = shape[0].length;
  const out = Array.from({ length: w }, () => Array(h).fill(0));
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      out[c][h - 1 - r] = shape[r][c];
    }
  }
  return out;
}

function collide(grid, shape, ox, oy) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (!shape[r][c]) continue;
      const x = ox + c;
      const y = oy + r;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && grid[y][x]) return true;
    }
  }
  return false;
}

function merge(grid, shape, color, ox, oy) {
  const next = grid.map((row) => row.slice());
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c] && oy + r >= 0) next[oy + r][ox + c] = color;
    }
  }
  return next;
}

function newPiece() {
  const t = KEYS[Math.floor(Math.random() * KEYS.length)];
  return {
    type: t,
    shape: SHAPES[t].map((row) => row.slice()),
    color: COLORS[t],
    x: Math.floor((COLS - SHAPES[t][0].length) / 2),
    y: -1,
  };
}

export function Tetris() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    grid: emptyGrid(),
    piece: newPiece(),
    over: false,
    paused: false,
    score: 0,
    lines: 0,
  });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const reset = () => {
    stateRef.current = {
      grid: emptyGrid(),
      piece: newPiece(),
      over: false,
      paused: false,
      score: 0,
      lines: 0,
    };
    setScore(0);
    setLines(0);
    setOver(false);
    setPaused(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      const s = stateRef.current;
      if (e.key === 'r' || e.key === 'R') {
        reset();
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        s.paused = !s.paused;
        setPaused(s.paused);
        return;
      }
      if (s.over || s.paused) return;
      const p = s.piece;
      if (e.key === 'ArrowLeft') {
        if (!collide(s.grid, p.shape, p.x - 1, p.y)) p.x -= 1;
      } else if (e.key === 'ArrowRight') {
        if (!collide(s.grid, p.shape, p.x + 1, p.y)) p.x += 1;
      } else if (e.key === 'ArrowDown') {
        if (!collide(s.grid, p.shape, p.x, p.y + 1)) p.y += 1;
      } else if (e.key === 'ArrowUp' || e.key === 'x' || e.key === 'X') {
        const rotated = rotate(p.shape);
        if (!collide(s.grid, rotated, p.x, p.y)) p.shape = rotated;
      } else if (e.key === ' ') {
        e.preventDefault();
        while (!collide(s.grid, p.shape, p.x, p.y + 1)) p.y += 1;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let raf;
    let lastDrop = performance.now();
    let dropEvery = 600;

    const tick = () => {
      const s = stateRef.current;
      if (s.over || s.paused) return;
      const p = s.piece;
      if (!collide(s.grid, p.shape, p.x, p.y + 1)) {
        p.y += 1;
      } else {
        s.grid = merge(s.grid, p.shape, p.color, p.x, p.y);
        // clear lines
        const kept = s.grid.filter((row) => row.some((cell) => !cell));
        const cleared = ROWS - kept.length;
        const newGrid = [
          ...Array.from({ length: cleared }, () => Array(COLS).fill(null)),
          ...kept,
        ];
        s.grid = newGrid;
        s.lines += cleared;
        s.score += [0, 40, 100, 300, 1200][cleared] || 0;
        setLines(s.lines);
        setScore(s.score);
        dropEvery = Math.max(100, 600 - Math.floor(s.lines / 10) * 50);

        s.piece = newPiece();
        if (collide(s.grid, s.piece.shape, s.piece.x, s.piece.y + 1)) {
          s.over = true;
          setOver(true);
        }
      }
    };

    const draw = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      const s = stateRef.current;
      // grid
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (s.grid[r][c]) {
            ctx.fillStyle = s.grid[r][c];
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          }
        }
      }
      // piece
      const p = s.piece;
      ctx.fillStyle = p.color;
      for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[0].length; c++) {
          if (p.shape[r][c]) {
            const x = (p.x + c) * CELL;
            const y = (p.y + r) * CELL;
            if (y >= 0) ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
          }
        }
      }
      // grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
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
    };

    const loop = (now) => {
      if (now - lastDrop >= dropEvery) {
        tick();
        lastDrop = now;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="game-window">
      <div className="game-hud">
        <div>Score: <strong>{score}</strong></div>
        <div>Lines: <strong>{lines}</strong></div>
        <div className="game-status right">
          {over ? 'GAME OVER — R to restart' : paused ? 'PAUSED' : '← → ↓ to move · ↑ rotate · space drop · P pause · R reset'}
        </div>
      </div>
      <div className="game-stage win95-inset">
        <canvas ref={canvasRef} width={W} height={H} className="game-canvas" />
      </div>
    </div>
  );
}

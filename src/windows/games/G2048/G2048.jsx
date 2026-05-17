import { useEffect, useState } from 'react';
import '../games.css';
import './G2048.css';

const N = 4;

function emptyGrid() {
  return Array.from({ length: N }, () => Array(N).fill(0));
}

function spawn(grid) {
  const empties = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) empties.push([r, c]);
  if (empties.length === 0) return grid;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return grid;
}

function newGame() {
  return spawn(spawn(emptyGrid()));
}

function slideRow(row) {
  const filtered = row.filter((x) => x);
  const out = [];
  let gained = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      out.push(filtered[i] * 2);
      gained += filtered[i] * 2;
      i += 1;
    } else {
      out.push(filtered[i]);
    }
  }
  while (out.length < N) out.push(0);
  return { row: out, gained };
}

function moveLeft(grid) {
  let gained = 0;
  let moved = false;
  const next = grid.map((row) => {
    const before = row.join(',');
    const { row: nr, gained: g } = slideRow(row);
    gained += g;
    if (nr.join(',') !== before) moved = true;
    return nr;
  });
  return { grid: next, gained, moved };
}

function rotateCW(grid) {
  const out = emptyGrid();
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) out[c][N - 1 - r] = grid[r][c];
  return out;
}

const move = (dir, grid) => {
  let g = grid.map((r) => r.slice());
  let rotations = 0;
  if (dir === 'up') rotations = 3;
  else if (dir === 'right') rotations = 2;
  else if (dir === 'down') rotations = 1;
  for (let i = 0; i < rotations; i++) g = rotateCW(g);
  const { grid: ng, gained, moved } = moveLeft(g);
  let out = ng;
  for (let i = 0; i < (4 - rotations) % 4; i++) out = rotateCW(out);
  return { grid: out, gained, moved };
};

function canMove(grid) {
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (!grid[r][c]) return true;
      if (c < N - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < N - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  return false;
}

const TILE_COLORS = {
  0: '#cdc1b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

export function G2048() {
  const [grid, setGrid] = useState(newGame);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('g2048Best')) || 0);

  const reset = () => {
    setGrid(newGame());
    setScore(0);
  };

  useEffect(() => {
    const map = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
      a: 'left',
      d: 'right',
      w: 'up',
      s: 'down',
    };
    const onKey = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        reset();
        return;
      }
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      setGrid((g) => {
        const { grid: ng, gained, moved } = move(dir, g);
        if (!moved) return g;
        setScore((s) => {
          const next = s + gained;
          if (next > best) {
            setBest(next);
            localStorage.setItem('g2048Best', String(next));
          }
          return next;
        });
        return spawn(ng);
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [best]);

  const over = !canMove(grid);

  return (
    <div className="game-window">
      <div className="game-hud">
        <div>Score: <strong>{score}</strong></div>
        <div>Best: <strong>{best}</strong></div>
        <div className="game-status right">
          {over ? 'GAME OVER — R to restart' : 'arrow keys / WASD · R reset'}
        </div>
      </div>
      <div className="game-stage">
        <div className="g2048-grid">
          {grid.map((row, r) =>
            row.map((v, c) => (
              <div
                key={`${r}-${c}`}
                className="g2048-cell"
                style={{
                  background: TILE_COLORS[v] || '#3c3a32',
                  color: v <= 4 ? '#776e65' : '#fff',
                  fontSize: v >= 1000 ? 20 : v >= 100 ? 24 : 28,
                }}
              >
                {v ? v : ''}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

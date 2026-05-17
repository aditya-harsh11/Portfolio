import { useState } from 'react';
import '../games.css';
import './LightsOut.css';

const N = 5;

function emptyGrid() {
  return Array.from({ length: N }, () => Array(N).fill(false));
}

function randomGrid() {
  // Start from solved, apply random moves to guarantee solvability
  const g = emptyGrid();
  for (let i = 0; i < 8 + Math.floor(Math.random() * 6); i++) {
    const r = Math.floor(Math.random() * N);
    const c = Math.floor(Math.random() * N);
    toggle(g, r, c);
  }
  return g;
}

function toggle(grid, r, c) {
  const positions = [
    [r, c],
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ];
  for (const [nr, nc] of positions) {
    if (nr >= 0 && nr < N && nc >= 0 && nc < N) grid[nr][nc] = !grid[nr][nc];
  }
}

export function LightsOut() {
  const [grid, setGrid] = useState(randomGrid);
  const [moves, setMoves] = useState(0);

  const click = (r, c) => {
    const next = grid.map((row) => row.slice());
    toggle(next, r, c);
    setGrid(next);
    setMoves((m) => m + 1);
  };

  const reset = () => {
    setGrid(randomGrid());
    setMoves(0);
  };

  const won = grid.every((row) => row.every((cell) => !cell));

  return (
    <div className="game-window">
      <div className="game-hud">
        <div>Moves: <strong>{moves}</strong></div>
        <div className="game-status right">
          {won ? 'Solved! Click "New" for another.' : 'Click a tile to toggle it and its neighbors'}
        </div>
        <button className="win95-button" onClick={reset}>New</button>
      </div>
      <div className="game-stage">
        <div className="lo-grid">
          {grid.map((row, r) =>
            row.map((on, c) => (
              <button
                key={`${r}-${c}`}
                className={`lo-cell ${on ? 'on' : ''}`}
                onClick={() => click(r, c)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

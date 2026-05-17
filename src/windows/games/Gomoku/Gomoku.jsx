import { useEffect, useState } from 'react';
import '../games.css';
import './Gomoku.css';

const N = 12;

function emptyBoard() {
  return Array.from({ length: N }, () => Array(N).fill(null));
}

const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function checkWin(board, r, c, player) {
  for (const [dr, dc] of DIRS) {
    let count = 1;
    for (let step = 1; step < 5; step++) {
      const nr = r + dr * step;
      const nc = c + dc * step;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N || board[nr][nc] !== player) break;
      count += 1;
    }
    for (let step = 1; step < 5; step++) {
      const nr = r - dr * step;
      const nc = c - dc * step;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N || board[nr][nc] !== player) break;
      count += 1;
    }
    if (count >= 5) return true;
  }
  return false;
}

// Heuristic for AI: score each cell on potential lines
function scoreCell(board, r, c, player) {
  if (board[r][c]) return -Infinity;
  let total = 0;
  for (const [dr, dc] of DIRS) {
    let mine = 0;
    let opp = 0;
    for (let step = -4; step <= 4; step++) {
      const nr = r + dr * step;
      const nc = c + dc * step;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      const v = board[nr][nc];
      if (v === player) mine += 1;
      else if (v) opp += 1;
    }
    total += mine * mine + opp * 0.9 * 0.9 * 0.9;
  }
  return total + Math.random();
}

function aiMove(board) {
  let best = -Infinity;
  let bestMove = null;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const offense = scoreCell(board, r, c, 'W');
      const defense = scoreCell(board, r, c, 'B') * 1.1;
      const s = Math.max(offense, defense);
      if (s > best) {
        best = s;
        bestMove = [r, c];
      }
    }
  }
  return bestMove;
}

export function Gomoku() {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState('B');
  const [winner, setWinner] = useState(null);

  const reset = () => {
    setBoard(emptyBoard());
    setTurn('B');
    setWinner(null);
  };

  const play = (r, c) => {
    if (winner || board[r][c] || turn !== 'B') return;
    const next = board.map((row) => row.slice());
    next[r][c] = 'B';
    setBoard(next);
    if (checkWin(next, r, c, 'B')) {
      setWinner('B');
      return;
    }
    setTurn('W');
  };

  useEffect(() => {
    if (turn !== 'W' || winner) return;
    const t = setTimeout(() => {
      const mv = aiMove(board);
      if (!mv) return;
      const [r, c] = mv;
      const next = board.map((row) => row.slice());
      next[r][c] = 'W';
      setBoard(next);
      if (checkWin(next, r, c, 'W')) setWinner('W');
      else setTurn('B');
    }, 250);
    return () => clearTimeout(t);
  }, [turn, board, winner]);

  return (
    <div className="game-window">
      <div className="game-hud">
        <div>You: <strong>● Black</strong></div>
        <div>CPU: <strong>○ White</strong></div>
        <div className="game-status right">
          {winner
            ? winner === 'B'
              ? 'You win!'
              : 'CPU wins.'
            : turn === 'B'
            ? 'Your turn'
            : 'Thinking…'}
        </div>
        <button className="win95-button" onClick={reset}>New game</button>
      </div>
      <div className="game-stage">
        <div
          className="gomoku-board"
          style={{
            gridTemplateColumns: `repeat(${N}, 26px)`,
            gridTemplateRows: `repeat(${N}, 26px)`,
          }}
        >
          {board.map((row, r) =>
            row.map((v, c) => (
              <button
                key={`${r}-${c}`}
                className="gomoku-cell"
                onClick={() => play(r, c)}
                disabled={!!v || !!winner || turn !== 'B'}
              >
                {v === 'B' ? <span className="stone black" /> : v === 'W' ? <span className="stone white" /> : null}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import '../games.css';
import './Minesweeper.css';

const ROWS = 12;
const COLS = 14;
const MINES = 22;

function makeBoard() {
  const cells = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adj: 0,
    }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!cells[r][c].mine) {
      cells[r][c].mine = true;
      placed += 1;
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (cells[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && cells[nr][nc].mine) {
            count += 1;
          }
        }
      }
      cells[r][c].adj = count;
    }
  }
  return cells;
}

const NUMBER_COLORS = [
  '',
  '#0000ff',
  '#008000',
  '#ff0000',
  '#000080',
  '#800000',
  '#008080',
  '#000000',
  '#808080',
];

export function Minesweeper() {
  const [board, setBoard] = useState(makeBoard);
  const [state, setState] = useState('play'); // play / win / lose
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || state !== 'play') return;
    const i = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, [started, state]);

  const reset = () => {
    setBoard(makeBoard());
    setState('play');
    setFlags(0);
    setTime(0);
    setStarted(false);
  };

  const reveal = (r, c) => {
    if (state !== 'play') return;
    if (!started) setStarted(true);
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop();
      const cell = next[cr][cc];
      if (cell.revealed || cell.flagged) continue;
      cell.revealed = true;
      if (cell.mine) {
        setBoard(next);
        setState('lose');
        return;
      }
      if (cell.adj === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) stack.push([nr, nc]);
          }
        }
      }
    }
    setBoard(next);
    const revealed = next.flat().filter((cl) => cl.revealed).length;
    if (revealed === ROWS * COLS - MINES) setState('win');
  };

  const toggleFlag = (r, c) => {
    if (state !== 'play') return;
    if (!started) setStarted(true);
    const cell = board[r][c];
    if (cell.revealed) return;
    const next = board.map((row) => row.map((cl) => ({ ...cl })));
    next[r][c].flagged = !cell.flagged;
    setBoard(next);
    setFlags((f) => f + (next[r][c].flagged ? 1 : -1));
  };

  return (
    <div className="game-window">
      <div className="game-hud">
        <div className="ms-counter">{String(MINES - flags).padStart(3, '0')}</div>
        <button
          className="ms-face win95-button"
          onClick={reset}
          title="New game"
        >
          {state === 'lose' ? '😵' : state === 'win' ? '😎' : '🙂'}
        </button>
        <div className="ms-counter right">{String(time).padStart(3, '0')}</div>
      </div>
      <div className="game-stage">
        <div
          className="ms-grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 24px)`,
            gridTemplateRows: `repeat(${ROWS}, 24px)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                className={`ms-cell ${cell.revealed ? 'revealed' : ''} ${
                  cell.mine && cell.revealed ? 'mine' : ''
                }`}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(r, c);
                }}
                style={
                  cell.revealed && cell.adj > 0
                    ? { color: NUMBER_COLORS[cell.adj] }
                    : undefined
                }
              >
                {cell.revealed
                  ? cell.mine
                    ? '💣'
                    : cell.adj > 0
                    ? cell.adj
                    : ''
                  : cell.flagged
                  ? '🚩'
                  : ''}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

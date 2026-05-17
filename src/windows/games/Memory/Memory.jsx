import { useEffect, useState } from 'react';
import '../games.css';
import './Memory.css';

const SYMBOLS = ['🐍', '🎮', '🖥', '🎵', '🚀', '🛰', '⚙', '🤖'];

function shuffleDeck() {
  const deck = [...SYMBOLS, ...SYMBOLS].map((sym, i) => ({
    id: i,
    sym,
    flipped: false,
    matched: false,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function Memory() {
  const [cards, setCards] = useState(shuffleDeck);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [best, setBest] = useState(
    () => Number(localStorage.getItem('memoryBest')) || 0
  );

  const reset = () => {
    setCards(shuffleDeck());
    setSelected([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    if (selected.length !== 2) return;
    setMoves((m) => m + 1);
    const [a, b] = selected;
    if (cards[a].sym === cards[b].sym) {
      const next = cards.map((c, i) =>
        i === a || i === b ? { ...c, matched: true } : c
      );
      setCards(next);
      setMatches((n) => n + 1);
      setSelected([]);
    } else {
      const t = setTimeout(() => {
        const next = cards.map((c, i) =>
          i === a || i === b ? { ...c, flipped: false } : c
        );
        setCards(next);
        setSelected([]);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [selected]);

  useEffect(() => {
    if (matches === SYMBOLS.length) {
      const prev = Number(localStorage.getItem('memoryBest')) || 0;
      if (prev === 0 || moves < prev) {
        localStorage.setItem('memoryBest', String(moves));
        setBest(moves);
      }
    }
  }, [matches, moves]);

  const flip = (i) => {
    if (selected.length === 2) return;
    if (cards[i].flipped || cards[i].matched) return;
    const next = cards.map((c, idx) => (idx === i ? { ...c, flipped: true } : c));
    setCards(next);
    setSelected((s) => [...s, i]);
  };

  const won = matches === SYMBOLS.length;

  return (
    <div className="game-window">
      <div className="game-hud">
        <div>Moves: <strong>{moves}</strong></div>
        <div>Matches: <strong>{matches} / {SYMBOLS.length}</strong></div>
        <div>Best: <strong>{best || '—'}</strong></div>
        <button className="win95-button right" onClick={reset}>New game</button>
      </div>
      <div className="game-stage">
        <div className="memory-grid">
          {cards.map((card, i) => (
            <button
              key={card.id}
              className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${
                card.matched ? 'matched' : ''
              }`}
              onClick={() => flip(i)}
            >
              <span className="memory-front">?</span>
              <span className="memory-back">{card.sym}</span>
            </button>
          ))}
        </div>
        {won ? (
          <div className="memory-win">🎉 Solved in {moves} moves!</div>
        ) : null}
      </div>
    </div>
  );
}

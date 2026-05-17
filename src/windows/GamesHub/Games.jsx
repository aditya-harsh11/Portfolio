import { useState } from 'react';
import { GAMES } from '../../data/games';
import { useDesktopStore } from '../../store/useDesktopStore';
import './Games.css';

export function Games() {
  const [selected, setSelected] = useState(GAMES[0]);
  const openWindow = useDesktopStore((s) => s.openWindow);

  const launch = (g) => {
    openWindow({
      component: g.id,
      title: `${g.label}.exe`,
      icon: g.emoji,
      width: g.width,
      height: g.height,
      singleton: true,
    });
  };

  return (
    <div className="games-window">
      <aside className="games-list win95-inset win95-scrollbar">
        {GAMES.map((g) => (
          <button
            key={g.id}
            className={`games-item ${selected.id === g.id ? 'active' : ''}`}
            onClick={() => setSelected(g)}
            onDoubleClick={() => launch(g)}
          >
            <span className="games-emoji">{g.emoji}</span>
            <span>{g.label}</span>
          </button>
        ))}
      </aside>
      <main className="games-detail win95-inset">
        <h2 className="games-title">{selected.emoji} {selected.label}</h2>
        <p className="games-blurb">{selected.blurb}</p>
        <div className="games-section">
          <div className="games-section-h">How to Play</div>
          <div className="games-controls">{selected.controls}</div>
        </div>
        <button className="win95-button games-launch" onClick={() => launch(selected)}>
          ▶ Open
        </button>
      </main>
    </div>
  );
}

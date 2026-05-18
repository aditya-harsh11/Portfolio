import { Suspense, lazy } from 'react';
import { About } from '../../windows/About/About';
import { Projects } from '../../windows/Projects/Projects';
import { Contact } from '../../windows/Contact/Contact';
import { Terminal } from '../../windows/Terminal/Terminal';
import { Explorer } from '../../windows/Explorer/Explorer';
import { Notepad } from '../../windows/Notepad/Notepad';
import { Settings } from '../../windows/Settings/Settings';
import { RecycleBin } from '../../windows/RecycleBin/RecycleBin';
import { Games } from '../../windows/GamesHub/Games';

// Lazy-loaded — split into separate chunks so the initial page load doesn't
// pull in canvas-heavy game code or the music player.
const MusicPlayer = lazy(() =>
  import('../../windows/MusicPlayer/MusicPlayer').then((m) => ({ default: m.MusicPlayer }))
);
const InternetExplorer = lazy(() =>
  import('../../windows/InternetExplorer/InternetExplorer').then((m) => ({
    default: m.InternetExplorer,
  }))
);
const Snake = lazy(() =>
  import('../../windows/games/Snake/Snake').then((m) => ({ default: m.Snake }))
);
const Minesweeper = lazy(() =>
  import('../../windows/games/Minesweeper/Minesweeper').then((m) => ({
    default: m.Minesweeper,
  }))
);
const Tetris = lazy(() =>
  import('../../windows/games/Tetris/Tetris').then((m) => ({ default: m.Tetris }))
);
const G2048 = lazy(() =>
  import('../../windows/games/G2048/G2048').then((m) => ({ default: m.G2048 }))
);
const Pong = lazy(() =>
  import('../../windows/games/Pong/Pong').then((m) => ({ default: m.Pong }))
);
const Breakout = lazy(() =>
  import('../../windows/games/Breakout/Breakout').then((m) => ({ default: m.Breakout }))
);
const MemoryGame = lazy(() =>
  import('../../windows/games/Memory/Memory').then((m) => ({ default: m.Memory }))
);
const Gomoku = lazy(() =>
  import('../../windows/games/Gomoku/Gomoku').then((m) => ({ default: m.Gomoku }))
);
const LightsOut = lazy(() =>
  import('../../windows/games/LightsOut/LightsOut').then((m) => ({ default: m.LightsOut }))
);

const REGISTRY = {
  About,
  Projects,
  Contact,
  Terminal,
  Explorer,
  Notepad,
  Settings,
  RecycleBin,
  Games,
  MusicPlayer,
  InternetExplorer,
  Snake,
  Minesweeper,
  Tetris,
  G2048,
  Pong,
  Breakout,
  Memory: MemoryGame,
  Gomoku,
  LightsOut,
};

function LoadingPane() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'MS Sans Serif, Tahoma, sans-serif',
        fontSize: 12,
        color: '#404040',
        background: '#c0c0c0',
      }}
    >
      Loading…
    </div>
  );
}

export function WindowContentRouter({ win }) {
  const Component = REGISTRY[win.component];
  if (!Component) {
    return (
      <div className="p-4 text-sm">
        <p>Unknown window: <code>{win.component}</code></p>
      </div>
    );
  }
  return (
    <Suspense fallback={<LoadingPane />}>
      <Component {...(win.props || {})} winId={win.id} />
    </Suspense>
  );
}

import { About } from '../../windows/About/About';
import { Projects } from '../../windows/Projects/Projects';
import { Contact } from '../../windows/Contact/Contact';
import { Terminal } from '../../windows/Terminal/Terminal';
import { Explorer } from '../../windows/Explorer/Explorer';
import { Notepad } from '../../windows/Notepad/Notepad';
import { Settings } from '../../windows/Settings/Settings';
import { RecycleBin } from '../../windows/RecycleBin/RecycleBin';
import { Games } from '../../windows/GamesHub/Games';
import { MusicPlayer } from '../../windows/MusicPlayer/MusicPlayer';

import { Snake } from '../../windows/games/Snake/Snake';
import { Minesweeper } from '../../windows/games/Minesweeper/Minesweeper';
import { Tetris } from '../../windows/games/Tetris/Tetris';
import { G2048 } from '../../windows/games/G2048/G2048';
import { Pong } from '../../windows/games/Pong/Pong';
import { Breakout } from '../../windows/games/Breakout/Breakout';
import { Memory } from '../../windows/games/Memory/Memory';
import { Gomoku } from '../../windows/games/Gomoku/Gomoku';
import { LightsOut } from '../../windows/games/LightsOut/LightsOut';

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
  // games
  Snake,
  Minesweeper,
  Tetris,
  G2048,
  Pong,
  Breakout,
  Memory,
  Gomoku,
  LightsOut,
};

export function WindowContentRouter({ win }) {
  const Component = REGISTRY[win.component];
  if (!Component) {
    return (
      <div className="p-4 text-sm">
        <p>Unknown window: <code>{win.component}</code></p>
      </div>
    );
  }
  return <Component {...(win.props || {})} winId={win.id} />;
}

import { About } from '../../windows/About/About';
import { Projects } from '../../windows/Projects/Projects';
import { Contact } from '../../windows/Contact/Contact';
import { Terminal } from '../../windows/Terminal/Terminal';
import { Snake } from '../../windows/games/Snake/Snake';
import { Explorer } from '../../windows/Explorer/Explorer';
import { Notepad } from '../../windows/Notepad/Notepad';
import { Settings } from '../../windows/Settings/Settings';
import { RecycleBin } from '../../windows/RecycleBin/RecycleBin';

const REGISTRY = {
  About,
  Projects,
  Contact,
  Terminal,
  Snake,
  Explorer,
  Notepad,
  Settings,
  RecycleBin,
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

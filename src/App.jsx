import { Desktop } from './components/Desktop/Desktop';
import { WindowManager } from './components/Window/WindowManager';
import { Taskbar } from './components/Taskbar/Taskbar';
import { useClickSounds } from './hooks/useClickSounds';
import './App.css';

function App() {
  useClickSounds();

  return (
    <>
      <Desktop />
      <WindowManager />
      <Taskbar />
    </>
  );
}

export default App;

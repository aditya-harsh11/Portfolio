import { Desktop } from './components/Desktop/Desktop';
import { WindowManager } from './components/Window/WindowManager';
import { Taskbar } from './components/Taskbar/Taskbar';
import { BSOD } from './components/Overlays/BSOD';
import { Matrix } from './components/Overlays/Matrix';
import { Confetti } from './components/Overlays/Confetti';
import { useClickSounds } from './hooks/useClickSounds';
import { useKonamiCode } from './hooks/useKonamiCode';
import './App.css';

function App() {
  useClickSounds();
  useKonamiCode();

  return (
    <>
      <Desktop />
      <WindowManager />
      <Taskbar />
      <BSOD />
      <Matrix />
      <Confetti />
    </>
  );
}

export default App;

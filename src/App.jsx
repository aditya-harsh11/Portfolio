import { Desktop } from './components/Desktop/Desktop';
import { WindowManager } from './components/Window/WindowManager';
import { Taskbar } from './components/Taskbar/Taskbar';
import { BSOD } from './components/Overlays/BSOD';
import { Matrix } from './components/Overlays/Matrix';
import { Confetti } from './components/Overlays/Confetti';
import { DesktopPet } from './components/Overlays/DesktopPet';
import { InstallWizard } from './components/Overlays/InstallWizard';
import { MobileView } from './components/Mobile/MobileView';
import { useClickSounds } from './hooks/useClickSounds';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import './App.css';

function App() {
  useClickSounds();
  useKonamiCode();
  useGlobalShortcuts();

  return (
    <>
      <Desktop />
      <DesktopPet />
      <WindowManager />
      <Taskbar />
      <BSOD />
      <Matrix />
      <Confetti />
      <InstallWizard />
      <MobileView />
    </>
  );
}

export default App;

import { useDesktopStore } from '../../store/useDesktopStore';
import { Window } from './Window';

export function WindowManager() {
  const windows = useDesktopStore((s) => s.openWindows);
  return (
    <>
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}
    </>
  );
}

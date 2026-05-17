import { useEffect, useMemo, useState } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import './BSOD.css';

const ERRORS = [
  'KMODE_EXCEPTION_NOT_HANDLED',
  'IRQL_NOT_LESS_OR_EQUAL',
  'PAGE_FAULT_IN_NONPAGED_AREA',
  'CRITICAL_PROCESS_DIED',
  'UNEXPECTED_KERNEL_MODE_TRAP',
  'STOP: 0x0000007B  INACCESSIBLE_BOOT_DEVICE',
];

export function BSOD() {
  const active = useDesktopStore((s) => s.bsodActive);
  const dismiss = useDesktopStore((s) => s.dismissBSOD);
  const [rebooting, setRebooting] = useState(false);
  const code = useMemo(
    () => ERRORS[Math.floor(Math.random() * ERRORS.length)],
    [active]
  );

  useEffect(() => {
    if (!active) {
      setRebooting(false);
      return;
    }
    const onKey = () => start();
    const onClick = () => start();
    let timer;
    const start = () => {
      if (rebooting) return;
      setRebooting(true);
      timer = setTimeout(() => {
        dismiss();
      }, 1500);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      if (timer) clearTimeout(timer);
    };
  }, [active, rebooting, dismiss]);

  if (!active) return null;

  if (rebooting) {
    return (
      <div className="bsod-overlay bsod-reboot">
        <div>Rebooting…</div>
      </div>
    );
  }

  return (
    <div className="bsod-overlay">
      <div className="bsod-inner">
        <p>A fatal exception has occurred at <strong>0x00001A4D</strong>.</p>
        <p>{code}</p>
        <br />
        <p>The current application will be terminated.</p>
        <p>* Press any key to terminate the application.</p>
        <p>* Press any key to continue _</p>
        <br />
        <p className="bsod-prompt">Press any key to continue _</p>
      </div>
    </div>
  );
}

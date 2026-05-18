import { useEffect, useMemo, useRef, useState } from 'react';
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

  // Track the timer in a ref so we don't blow it away every time `rebooting`
  // changes — the older effect deps caused the auto-dismiss to never fire.
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setRebooting(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }

    const start = () => {
      if (timerRef.current) return;
      setRebooting(true);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        dismiss();
      }, 1500);
    };

    // Small grace period so the triggering keypress/click doesn't insta-reboot
    const armId = setTimeout(() => {
      document.addEventListener('keydown', start);
      document.addEventListener('mousedown', start);
    }, 250);

    return () => {
      clearTimeout(armId);
      document.removeEventListener('keydown', start);
      document.removeEventListener('mousedown', start);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, dismiss]);

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
        <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
        <br />
        <p className="bsod-prompt">Press any key to continue _</p>
      </div>
    </div>
  );
}

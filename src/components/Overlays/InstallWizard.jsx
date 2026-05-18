import { useEffect, useRef, useState } from 'react';
import './InstallWizard.css';

const KEY = 'adityaOSInstalled';

const STEPS = [
  {
    id: 'welcome',
    title: 'Setup — Welcome',
    body: () => (
      <>
        <h2>Welcome to AdityaOS Setup</h2>
        <p>
          - This wizard will install <strong>AdityaOS 1.0</strong> (the portfolio
          you're looking at) on this browser tab.
        </p>
        <p>
          - Estimated install time: about 8 seconds. Click <strong>Next</strong>
          {' '}to continue.
        </p>
      </>
    ),
  },
  {
    id: 'eula',
    title: 'Setup — License Agreement',
    body: () => (
      <>
        <h2>End User License Agreement</h2>
        <div className="wiz-eula win95-inset-thin">
          <p>By installing AdityaOS, you agree to the following terms:</p>
          <ol>
            <li>1. You will not write code without using version control.</li>
            <li>2. You will respect tab vs. spaces conventions of any repo you join.</li>
            <li>
              3. You acknowledge that the recruiter reading this is encouraged to
              consider Aditya for interesting roles.
            </li>
            <li>4. No warranty. No refunds. Just vibes.</li>
            <li>5. Effective immediately, until you close this tab.</li>
          </ol>
        </div>
      </>
    ),
  },
  {
    id: 'components',
    title: 'Setup — Select Components',
    body: () => (
      <>
        <h2>Components to install</h2>
        <p>All components are required for a complete experience.</p>
        <ul className="wiz-checklist">
          <li><input type="checkbox" defaultChecked disabled /> Desktop &amp; Windows</li>
          <li><input type="checkbox" defaultChecked disabled /> Terminal + File System</li>
          <li><input type="checkbox" defaultChecked disabled /> 9 mini-games</li>
          <li><input type="checkbox" defaultChecked disabled /> Music Player</li>
          <li><input type="checkbox" defaultChecked disabled /> Easter eggs (Konami, BSOD, Matrix)</li>
          <li><input type="checkbox" defaultChecked disabled /> Desktop Pet</li>
        </ul>
      </>
    ),
  },
];

export function InstallWizard() {
  const [open, setOpen] = useState(() => localStorage.getItem(KEY) !== '1');
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('config'); // config | installing | done
  const timerRef = useRef(null);

  useEffect(() => {
    const onRun = () => {
      setStep(0);
      setProgress(0);
      setPhase('config');
      setOpen(true);
    };
    window.addEventListener('runInstallWizard', onRun);
    return () => window.removeEventListener('runInstallWizard', onRun);
  }, []);

  useEffect(() => {
    if (phase !== 'installing') return;
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timerRef.current);
          setPhase('done');
          return 100;
        }
        return p + 4 + Math.random() * 6;
      });
    }, 300);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  if (!open) return null;

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setPhase('installing');
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = () => {
    localStorage.setItem(KEY, '1');
    setOpen(false);
  };

  const renderConfig = () => {
    const s = STEPS[step];
    // No Cancel anywhere. Back only appears once the user is past Welcome AND
    // EULA — i.e. on the Components step (step 2).
    const showBack = step >= 2;
    return (
      <>
        <div className="wiz-titlebar win95-titlebar">
          <span>{s.title}</span>
        </div>
        <div className="wiz-content">
          <div className="wiz-sidebar" />
          <div className="wiz-main">{s.body()}</div>
        </div>
        <div className="wiz-buttons">
          <div style={{ flex: 1 }} />
          {showBack ? (
            <button className="win95-button" onClick={back}>
              &lt; Back
            </button>
          ) : null}
          <button className="win95-button" onClick={next}>
            {step === STEPS.length - 1 ? 'Install' : 'Next >'}
          </button>
        </div>
      </>
    );
  };

  const renderInstalling = () => (
    <>
      <div className="wiz-titlebar win95-titlebar">
        <span>Installing AdityaOS…</span>
      </div>
      <div className="wiz-content">
        <div className="wiz-sidebar" />
        <div className="wiz-main">
          <h2>Installing components</h2>
          <p className="wiz-status">
            {progress < 30
              ? 'Unpacking desktop primitives…'
              : progress < 55
                ? 'Generating File System…'
                : progress < 80
                  ? 'Wiring up easter eggs…'
                  : progress < 100
                    ? 'Calibrating the duck…'
                    : 'Finalizing…'}
          </p>
          <div className="wiz-progress win95-inset-thin">
            <div
              className="wiz-progress-fill"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="wiz-percent">{Math.min(100, Math.floor(progress))}%</p>
        </div>
      </div>
      <div className="wiz-buttons">
        <div style={{ flex: 1 }} />
      </div>
    </>
  );

  const renderDone = () => (
    <>
      <div className="wiz-titlebar win95-titlebar">
        <span>Setup Complete</span>
      </div>
      <div className="wiz-content">
        <div className="wiz-sidebar" />
        <div className="wiz-main">
          <h2>All done!</h2>
          <p>AdityaOS 1.0 has been installed successfully.</p>
          <p>Have a look around. Try the Terminal, Settings, and Games icons.</p>

        </div>
      </div>
      <div className="wiz-buttons">
        <div style={{ flex: 1 }} />
        <button className="win95-button" onClick={finish}>
          Finish
        </button>
      </div>
    </>
  );

  return (
    <div className="wiz-overlay">
      <div className="wiz-dialog win95-outset">
        {phase === 'config'
          ? renderConfig()
          : phase === 'installing'
            ? renderInstalling()
            : renderDone()}
      </div>
    </div>
  );
}

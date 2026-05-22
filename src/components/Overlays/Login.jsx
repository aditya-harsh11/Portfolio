import { useState } from 'react';
import './Login.css';

// Win95 "Welcome to Windows" login, recreated for AdityaOS. Shows on every
// visit (no persistence). Any credentials log you in — and, in true Windows 95
// fashion, so do Cancel and the title-bar close button.
export function Login() {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  if (!open) return null;

  const login = () => setOpen(false);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') login();
  };

  return (
    <div className="login-overlay">
      <div className="login-dialog win95-outset">
        <div className="login-titlebar win95-titlebar">
          <span className="login-title">Welcome to AdityaOS</span>
          <div className="win95-titlebar-buttons">
            <button className="win95-titlebar-button" title="Help" tabIndex={-1}>?</button>
            <button
              className="win95-titlebar-button"
              onClick={login}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="login-body">
          <img className="login-key" src="/images/icons/login-key.png" alt="" />

          <div className="login-center">
            <p className="login-prompt">
              Type a user name and password to log on to AdityaOS.
            </p>
            <div className="login-row">
              <span className="login-label">User name:</span>
              <div className="login-input-wrap win95-inset-thin">
                <input
                  className="login-input"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck="false"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>
            <div className="login-row">
              <span className="login-label">Password:</span>
              <div className="login-input-wrap win95-inset-thin">
                <input
                  type="password"
                  className="login-input"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="login-buttons">
            <button className="win95-button login-btn" onClick={login}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
}

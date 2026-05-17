import { useState } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import './Settings.css';

const WALLPAPERS = [
  { id: 'default', label: 'Win95 Clouds', url: '/images/wallpapers/win95_bg.jpeg' },
  { id: 'teal', label: 'Teal', url: '', color: '#008080' },
  { id: 'navy', label: 'Navy', url: '', color: '#000080' },
  { id: 'maroon', label: 'Maroon', url: '', color: '#800000' },
  { id: 'olive', label: 'Olive', url: '', color: '#808000' },
  { id: 'forest', label: 'Forest', url: '', color: '#005f3a' },
  { id: 'matrix', label: 'Matrix Black', url: '', color: '#000000' },
];

function colorDataUrl(hex) {
  // 1x1 svg as data url so we don't need real wallpaper images
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'><rect width='1' height='1' fill='${hex}'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export function Settings() {
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const setWallpaper = useDesktopStore((s) => s.setWallpaper);
  const soundEnabled = useDesktopStore((s) => s.soundEnabled);
  const setSoundEnabled = useDesktopStore((s) => s.setSoundEnabled);
  const soundVolume = useDesktopStore((s) => s.soundVolume);
  const setSoundVolume = useDesktopStore((s) => s.setSoundVolume);
  const [tab, setTab] = useState('background');

  const apply = (w) => {
    if (w.color) {
      // Embed color as inline data url, distinguish via prefix
      setWallpaper(`color:${w.color}`);
    } else {
      setWallpaper(w.url);
    }
  };

  const previewBg =
    wallpaper.startsWith('color:')
      ? { backgroundColor: wallpaper.slice('color:'.length) }
      : wallpaper
      ? { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover' }
      : { backgroundColor: '#008080' };

  return (
    <div className="settings-window">
      <div className="settings-tabs">
        {[
          { id: 'background', label: 'Background' },
          { id: 'sound', label: 'Sound' },
          { id: 'about', label: 'About' },
        ].map((t) => (
          <button
            key={t.id}
            className={`settings-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="settings-body win95-inset">
        {tab === 'background' && (
          <div className="settings-pane">
            <div className="settings-monitor">
              <div className="settings-monitor-frame">
                <div className="settings-monitor-screen" style={previewBg} />
              </div>
              <div className="settings-monitor-base" />
            </div>

            <div className="settings-walls">
              <div className="settings-label">Select a background:</div>
              <ul className="settings-wall-list win95-inset-thin">
                {WALLPAPERS.map((w) => {
                  const selected =
                    (w.color && wallpaper === `color:${w.color}`) ||
                    (!w.color && wallpaper === w.url);
                  return (
                    <li
                      key={w.id}
                      className={`settings-wall ${selected ? 'selected' : ''}`}
                      onClick={() => apply(w)}
                    >
                      {w.label}
                    </li>
                  );
                })}
              </ul>
              <button
                className="win95-button"
                onClick={() => setWallpaper('')}
                style={{ marginTop: 8 }}
              >
                None (solid teal)
              </button>
            </div>
          </div>
        )}

        {tab === 'sound' && (
          <div className="settings-pane settings-pane-narrow">
            <label className="settings-row">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              Enable mouse click sounds
            </label>
            <label className="settings-row">
              Volume:
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                disabled={!soundEnabled}
              />
              <span>{Math.round(soundVolume * 100)}%</span>
            </label>
          </div>
        )}

        {tab === 'about' && (
          <div className="settings-pane settings-pane-narrow">
            <p><strong>AdityaOS</strong> v1.0.0</p>
            <p>Build 2026.05 · Vite + React</p>
            <p>(c) 2026 Aditya Harshavardhan</p>
            <p style={{ marginTop: 10 }}>
              This is a portfolio site styled as a Windows 95 desktop. None of the
              settings here change anything outside this browser tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// silence unused-export lint warnings
void colorDataUrl;

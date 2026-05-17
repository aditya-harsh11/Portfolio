import { useState, useEffect, useRef } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { StartMenu } from './StartMenu';
import { Clock } from './Clock';
import './Taskbar.css';

export function Taskbar() {
  const [startOpen, setStartOpen] = useState(false);
  const openWindows = useDesktopStore((s) => s.openWindows);
  const activeId = useDesktopStore((s) => s.activeWindowId);
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!startOpen) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setStartOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [startOpen]);

  const onTaskClick = (w) => {
    if (w.minimized) {
      focusWindow(w.id);
    } else if (activeId === w.id) {
      minimizeWindow(w.id);
    } else {
      focusWindow(w.id);
    }
  };

  return (
    <div ref={containerRef} className="taskbar win95-outset">
      <button
        className={`start-button win95-button ${startOpen ? 'pressed' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setStartOpen((v) => !v);
        }}
      >
        <span className="start-flag">⊞</span>
        <span>Start</span>
      </button>

      <div className="task-divider" />

      <div className="taskbar-windows">
        {openWindows.map((w) => (
          <button
            key={w.id}
            className={`taskbar-window-btn win95-button ${
              activeId === w.id && !w.minimized ? 'pressed' : ''
            }`}
            onClick={() => onTaskClick(w)}
            title={w.title}
          >
            {w.icon ? <span className="mr-1">{w.icon}</span> : null}
            <span className="truncate">{w.title}</span>
          </button>
        ))}
      </div>

      <Clock />

      {startOpen ? (
        <StartMenu
          onClose={() => setStartOpen(false)}
        />
      ) : null}
    </div>
  );
}

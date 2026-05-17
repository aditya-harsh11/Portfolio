import { useState } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { desktopIcons } from '../../data/icons';
import { DesktopIcon } from './DesktopIcon';
import './Desktop.css';

const GRID_X = 16;
const GRID_Y = 16;
const COL = 88;
const ROW = 96;

function defaultLayout() {
  const out = {};
  desktopIcons.forEach((icon, i) => {
    out[icon.id] = {
      x: GRID_X,
      y: GRID_Y + i * ROW,
    };
  });
  return out;
}

export function Desktop() {
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const openWindow = useDesktopStore((s) => s.openWindow);
  const [positions, setPositions] = useState(() => {
    try {
      const raw = localStorage.getItem('iconPositions');
      return raw ? JSON.parse(raw) : defaultLayout();
    } catch {
      return defaultLayout();
    }
  });

  const updatePos = (id, pos) => {
    const next = { ...positions, [id]: pos };
    setPositions(next);
    try {
      localStorage.setItem('iconPositions', JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const launchIcon = (icon) => {
    if (icon.link) {
      window.open(icon.link, '_blank', 'noopener,noreferrer');
      return;
    }
    openWindow({
      component: icon.component,
      title: icon.title ?? icon.label,
      icon: icon.emoji,
      width: icon.width,
      height: icon.height,
      singleton: icon.singleton,
    });
  };

  const bgStyle = wallpaper
    ? { backgroundImage: `url(${wallpaper})` }
    : { backgroundColor: '#008080' };

  return (
    <div className="desktop-root" style={bgStyle}>
      <div className="desktop-icons">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            position={positions[icon.id] ?? { x: GRID_X, y: GRID_Y }}
            onDrop={(pos) => updatePos(icon.id, pos)}
            onOpen={() => launchIcon(icon)}
          />
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { desktopIcons } from '../../data/icons';
import { DesktopIcon } from './DesktopIcon';
import './Desktop.css';

const GRID_X = 16;
const GRID_Y = 16;
const COL_W = 90;
const ROW_H = 92;
const PER_COL = 4;

function defaultLayout() {
  const out = {};
  desktopIcons.forEach((icon, i) => {
    const col = Math.floor(i / PER_COL);
    const row = i % PER_COL;
    out[icon.id] = {
      x: GRID_X + col * COL_W,
      y: GRID_Y + row * ROW_H,
    };
  });
  return out;
}

export function Desktop() {
  const wallpaper = useDesktopStore((s) => s.wallpaper);
  const openWindow = useDesktopStore((s) => s.openWindow);
  // v3: 3-column grouped layout (me / fun / system).
  const [positions, setPositions] = useState(() => {
    try {
      const raw = localStorage.getItem('iconPositions.v3');
      return raw ? JSON.parse(raw) : defaultLayout();
    } catch {
      return defaultLayout();
    }
  });

  const updatePos = (id, pos) => {
    const next = { ...positions, [id]: pos };
    setPositions(next);
    try {
      localStorage.setItem('iconPositions.v3', JSON.stringify(next));
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

  const bgStyle = !wallpaper
    ? { backgroundColor: '#008080' }
    : wallpaper.startsWith('color:')
    ? { backgroundColor: wallpaper.slice('color:'.length) }
    : { backgroundImage: `url(${wallpaper})` };

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

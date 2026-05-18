import { useEffect, useRef, useState } from 'react';

const DRAG_THRESHOLD = 5;
const DOUBLE_CLICK_MS = 350;

export function DesktopIcon({ icon, position, onDrop, onOpen }) {
  const [selected, setSelected] = useState(false);
  const [livePos, setLivePos] = useState(position);
  const elRef = useRef(null);
  const lastClickRef = useRef(0);

  // Sync prop changes when not actively dragging
  useEffect(() => {
    setLivePos(position);
  }, [position.x, position.y]);

  // Click outside to deselect
  useEffect(() => {
    if (!selected) return;
    const onDocDown = (e) => {
      if (elRef.current && !elRef.current.contains(e.target)) {
        setSelected(false);
      }
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [selected]);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelected(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = elRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    let dragging = false;
    let latestPos = livePos;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragging = true;
      const parent = elRef.current.parentElement.getBoundingClientRect();
      latestPos = {
        x: Math.max(0, ev.clientX - parent.left - offsetX),
        y: Math.max(0, ev.clientY - parent.top - offsetY),
      };
      setLivePos(latestPos);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (dragging) {
        onDrop(latestPos);
      } else {
        const now = Date.now();
        if (now - lastClickRef.current < DOUBLE_CLICK_MS) {
          onOpen();
          lastClickRef.current = 0;
        } else {
          lastClickRef.current = now;
        }
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      ref={elRef}
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      style={{ left: livePos.x, top: livePos.y }}
      onMouseDown={onMouseDown}
      onKeyDown={onKey}
      tabIndex={0}
      role="button"
      aria-label={icon.label}
    >
      {icon.image ? (
        <img src={icon.image} alt="" className="glyph-img" draggable={false} />
      ) : (
        <div
          className={`glyph${/^[\x20-\x7E]+$/.test(icon.emoji) ? ' text-glyph' : ''}`}
        >
          {icon.emoji}
        </div>
      )}
      <div className="label">{icon.label}</div>
    </div>
  );
}

import { Rnd } from 'react-rnd';
import { useDesktopStore } from '../../store/useDesktopStore';
import { WindowContentRouter } from './WindowContentRouter';
import './Window.css';

export function Window({ win }) {
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const moveWindow = useDesktopStore((s) => s.moveWindow);
  const resizeWindow = useDesktopStore((s) => s.resizeWindow);
  const toggleMaximize = useDesktopStore((s) => s.toggleMaximize);
  const activeId = useDesktopStore((s) => s.activeWindowId);

  if (win.minimized) return null;

  const active = activeId === win.id;

  return (
    <Rnd
      size={{ width: win.w, height: win.h }}
      position={{ x: win.x, y: win.y }}
      minWidth={win.minW}
      minHeight={win.minH}
      bounds="parent"
      dragHandleClassName="win95-titlebar"
      enableResizing={win.resizable && !win.maximized}
      disableDragging={win.maximized}
      onDragStart={() => focusWindow(win.id)}
      onMouseDown={() => focusWindow(win.id)}
      onDragStop={(_e, d) => moveWindow(win.id, d.x, d.y)}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        resizeWindow(
          win.id,
          parseInt(ref.style.width, 10),
          parseInt(ref.style.height, 10),
          pos.x,
          pos.y
        );
      }}
      style={{ zIndex: win.zIndex }}
      className="win95-window-shell"
    >
      <div className="win95-window win95-outset">
        <div className={`win95-titlebar ${active ? '' : 'inactive'}`}>
          <div
            className="win95-titlebar-title"
            onDoubleClick={() => {
              if (win.resizable) toggleMaximize(win.id);
            }}
          >
            {win.icon ? <span>{win.icon}</span> : null}
            <span>{win.title}</span>
          </div>
          <div className="win95-titlebar-buttons">
            <button
              className="win95-titlebar-button"
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(win.id);
              }}
              aria-label="Minimize"
              title="Minimize"
            >
              _
            </button>
            {win.resizable ? (
              <button
                className="win95-titlebar-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize(win.id);
                }}
                aria-label={win.maximized ? 'Restore' : 'Maximize'}
                title={win.maximized ? 'Restore' : 'Maximize'}
              >
                {win.maximized ? '❐' : '□'}
              </button>
            ) : null}
            <button
              className="win95-titlebar-button"
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
        <div className="win95-window-body">
          <WindowContentRouter win={win} />
        </div>
      </div>
    </Rnd>
  );
}

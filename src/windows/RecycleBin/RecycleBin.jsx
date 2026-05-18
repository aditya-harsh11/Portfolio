import { useDesktopStore } from '../../store/useDesktopStore';
import './RecycleBin.css';

function relativeTime(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function RecycleBin() {
  const items = useDesktopStore((s) => s.recycleBin);
  const emptyBin = useDesktopStore((s) => s.emptyBin);

  return (
    <div className="recycle-window">
      <div className="recycle-toolbar">
        <button
          className="win95-button"
          onClick={emptyBin}
          disabled={items.length === 0}
        >
          🗑 Empty Recycle Bin
        </button>
        <span className="recycle-count">
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="recycle-grid win95-inset win95-scrollbar">
        {items.length === 0 ? (
          <div className="recycle-empty">
            <img
              className="recycle-empty-icon"
              src="/images/icons/recycle-bin.png"
              alt=""
            />
            <div>The Recycle Bin is empty.</div>
            <div className="muted">Closed windows appear here.</div>
          </div>
        ) : (
          <table className="recycle-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Date Deleted</th>
              </tr>
            </thead>
            <tbody>
              {items
                .slice()
                .reverse()
                .map((it, i) => (
                  <tr key={i}>
                    <td>📄 {it.name}</td>
                    <td>{it.component} Window</td>
                    <td>{relativeTime(it.deletedAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="win95-statusbar">
        <div className="win95-statusbar-cell">
          {items.length} object(s)
        </div>
      </div>
    </div>
  );
}

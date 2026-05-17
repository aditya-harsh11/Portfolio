import { useState } from 'react';
import {
  FS,
  ROOT_PATH,
  resolveNode,
  parentPath,
  joinChild,
} from '../../data/fileSystem';
import { useDesktopStore } from '../../store/useDesktopStore';
import './Explorer.css';

function buildTreeJSX(node, path, currentPath, navigate, depth = 0) {
  if (!node || node.type !== 'dir') return null;
  const isOpen = currentPath.startsWith(path);
  return (
    <ul className="tree-list" style={{ paddingLeft: depth === 0 ? 0 : 14 }}>
      <li>
        <button
          className={`tree-node ${currentPath === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          {isOpen ? '📂' : '📁'} {node.name}
        </button>
        {isOpen
          ? Object.values(node.children)
              .filter((c) => c.type === 'dir')
              .map((child) =>
                buildTreeJSX(
                  child,
                  joinChild(path, child.name),
                  currentPath,
                  navigate,
                  depth + 1
                )
              )
          : null}
      </li>
    </ul>
  );
}

export function Explorer({ path: initialPath }) {
  const [path, setPath] = useState(initialPath || 'C:\\PORTFOLIO');
  const [history, setHistory] = useState([initialPath || 'C:\\PORTFOLIO']);
  const [histIdx, setHistIdx] = useState(0);
  const openWindow = useDesktopStore((s) => s.openWindow);

  const node = resolveNode(path);
  const items = node && node.type === 'dir' ? Object.values(node.children) : [];

  const navigate = (next) => {
    setPath(next);
    const truncated = history.slice(0, histIdx + 1);
    setHistory([...truncated, next]);
    setHistIdx(truncated.length);
  };

  const back = () => {
    if (histIdx > 0) {
      setHistIdx(histIdx - 1);
      setPath(history[histIdx - 1]);
    }
  };

  const forward = () => {
    if (histIdx < history.length - 1) {
      setHistIdx(histIdx + 1);
      setPath(history[histIdx + 1]);
    }
  };

  const up = () => {
    const p = parentPath(path);
    if (p !== path) navigate(p);
  };

  const open = (child) => {
    const childPath = joinChild(path, child.name);
    if (child.type === 'dir') {
      navigate(childPath);
    } else {
      openWindow({
        component: 'Notepad',
        title: `${child.name} — Notepad`,
        icon: '📄',
        width: 560,
        height: 440,
        props: { path: childPath },
      });
    }
  };

  return (
    <div className="explorer-window">
      <div className="explorer-toolbar">
        <button
          className="win95-button"
          onClick={back}
          disabled={histIdx === 0}
          title="Back"
        >
          ← Back
        </button>
        <button
          className="win95-button"
          onClick={forward}
          disabled={histIdx === history.length - 1}
          title="Forward"
        >
          → Forward
        </button>
        <button className="win95-button" onClick={up} title="Up">
          ↑ Up
        </button>
        <div className="explorer-address">
          <span>Address:</span>
          <input className="win95-inset-thin" value={path} readOnly />
        </div>
      </div>

      <div className="explorer-body">
        <aside className="explorer-tree win95-inset win95-scrollbar">
          {buildTreeJSX(FS, ROOT_PATH.replace(/\\$/, ''), path, navigate)}
        </aside>
        <main className="explorer-grid win95-inset win95-scrollbar">
          {items.length === 0 ? (
            <div className="explorer-empty">(empty)</div>
          ) : (
            items.map((child) => (
              <button
                key={child.name}
                className="explorer-item"
                onDoubleClick={() => open(child)}
                title={child.name}
              >
                <div className="explorer-icon">
                  {child.type === 'dir' ? '📁' : child.ext === 'exe' ? '🖥️' : '📄'}
                </div>
                <div className="explorer-label">{child.name}</div>
              </button>
            ))
          )}
        </main>
      </div>

      <div className="win95-statusbar">
        <div className="win95-statusbar-cell">{items.length} object(s)</div>
        <div className="win95-statusbar-cell">{path}</div>
      </div>
    </div>
  );
}

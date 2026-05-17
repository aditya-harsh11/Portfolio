import { useMemo, useState } from 'react';
import { resolveNode } from '../../data/fileSystem';
import './Notepad.css';

export function Notepad({ path }) {
  const [currentPath] = useState(path || 'C:\\PORTFOLIO\\README.txt');
  const node = useMemo(() => resolveNode(currentPath), [currentPath]);

  const content =
    node && node.type === 'file'
      ? node.content
      : `Cannot open: ${currentPath}\n\nFile not found.`;

  const lines = content.split('\n');
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;

  return (
    <div className="notepad-window">
      <div className="notepad-menubar">
        <span className="notepad-menu">File</span>
        <span className="notepad-menu">Edit</span>
        <span className="notepad-menu">Search</span>
        <span className="notepad-menu">Help</span>
      </div>
      <textarea
        className="notepad-area win95-scrollbar"
        readOnly
        value={content}
      />
      <div className="win95-statusbar notepad-statusbar">
        <div className="win95-statusbar-cell notepad-path" title={currentPath}>
          {currentPath}
        </div>
        <div className="win95-statusbar-cell">Lines: {lines.length}</div>
        <div className="win95-statusbar-cell">Words: {words}</div>
        <div className="win95-statusbar-cell">Chars: {chars}</div>
      </div>
    </div>
  );
}

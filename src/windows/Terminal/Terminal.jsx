import { useEffect, useRef, useState } from 'react';
import { profile, projects, skills, contact } from '../../data/content';
import './Terminal.css';

const THEMES = {
  green: { bg: '#000', fg: '#33ff66' },
  amber: { bg: '#1a1100', fg: '#ffb000' },
  blue: { bg: '#000022', fg: '#9cf' },
  white: { bg: '#000', fg: '#eee' },
  red: { bg: '#180000', fg: '#ff5050' },
  purple: { bg: '#100018', fg: '#cc88ff' },
};

const BANNER = String.raw`
    ___    ____  ___ _________  ___    _   __ ____
   /   |  / __ \/ _ /_  __/   \/   |  / | / // __ \
  / /| | / / / / // / / / / /| / /| | /  |/ // /_/ /
 / ___ |/ /_/ / // /_/ / / ___ / ___ |/ /|  // _, _/
/_/  |_|/_____/\___//_/ /_/  |_/_/  |_/_/ |_//_/ |_|

  type 'help' for commands · 'theme amber' to change colors
`;

const BOOT = [
  'AdityaOS [Version 1.0.0]',
  '(c) 2026 Aditya Harshavardhan. All rights reserved.',
  '',
];

export function Terminal() {
  const [lines, setLines] = useState([...BOOT, BANNER]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [themeName, setThemeName] = useState('green');
  const [cwd, setCwd] = useState('C:\\PORTFOLIO');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const theme = THEMES[themeName];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const print = (...rows) => {
    setLines((prev) => [...prev, ...rows.flat()]);
  };

  const runCommand = (raw) => {
    const trimmed = raw.trim();
    print(`${cwd}> ${trimmed}`);
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(/\s+/);
    const c = cmd.toLowerCase();

    switch (c) {
      case 'help':
      case '?':
        print([
          'Available commands:',
          '  help, ?              show this list',
          '  whoami               show profile summary',
          '  about                show bio',
          '  projects             list projects',
          '  skills               list skills by category',
          '  contact              contact info',
          '  ls, dir              list files in cwd',
          '  cat <file>           print file',
          '  clear, cls           clear screen',
          '  theme <name>         green, amber, blue, white, red, purple',
          '  date                 print current date/time',
          '  echo <text>          print text',
          '  neofetch             fancy system info',
          '  exit                 print exit message',
          '',
        ]);
        break;

      case 'whoami':
        print([
          `${profile.name}`,
          `${profile.role}`,
          `${profile.school}`,
          `tagline: ${profile.tagline}`,
          '',
        ]);
        break;

      case 'about':
        print([...profile.bio, '']);
        break;

      case 'projects':
        print(
          projects.flatMap((p) => [
            `> ${p.title}`,
            `  ${p.blurb}`,
            `  stack: ${p.stack.join(', ')}`,
            `  link:  ${p.link}`,
            '',
          ])
        );
        break;

      case 'skills':
        print(
          Object.entries(skills).flatMap(([k, v]) => [
            `[${k}]`,
            `  ${v.join(', ')}`,
            '',
          ])
        );
        break;

      case 'contact':
        print([
          `email:    ${contact.email}`,
          `github:   ${contact.github}`,
          `linkedin: ${contact.linkedin}`,
          `location: ${contact.location}`,
          '',
        ]);
        break;

      case 'ls':
      case 'dir':
        print([
          ' Directory of ' + cwd,
          '',
          ' <DIR>   PROJECTS',
          ' <DIR>   AWARDS',
          '         README.txt',
          '         resume.pdf',
          '         contact.txt',
          '',
        ]);
        break;

      case 'cat':
      case 'type': {
        const file = args[0]?.toLowerCase();
        if (!file) return print(['Usage: cat <file>', '']);
        if (file === 'readme.txt') {
          print([
            `Hi, I'm ${profile.name}.`,
            profile.tagline,
            '',
            'Type "about" for bio or "projects" to see what I\'ve built.',
            '',
          ]);
        } else if (file === 'contact.txt') {
          print([
            `email:    ${contact.email}`,
            `github:   ${contact.github}`,
            `linkedin: ${contact.linkedin}`,
            '',
          ]);
        } else {
          print([`cat: ${file}: file not found`, '']);
        }
        break;
      }

      case 'clear':
      case 'cls':
        setLines([]);
        break;

      case 'theme': {
        const name = args[0]?.toLowerCase();
        if (!name) {
          print(['Themes: ' + Object.keys(THEMES).join(', '), '']);
        } else if (THEMES[name]) {
          setThemeName(name);
          print([`theme set to ${name}`, '']);
        } else {
          print([`unknown theme: ${name}`, '']);
        }
        break;
      }

      case 'date':
        print([new Date().toString(), '']);
        break;

      case 'echo':
        print([args.join(' '), '']);
        break;

      case 'neofetch':
        print([
          '       .-""-.',
          `      / .--. \\     ${profile.name}@AdityaOS`,
          `     | |    | |    -----------`,
          '     | |.-""-.|    OS: AdityaOS 1.0',
          `     |//      \\|    Host: Browser`,
          `     ||        ||    Shell: jsh 1.0`,
          `      \\\\\\____///    Theme: ${themeName}`,
          `       '------'     Uptime: forever`,
          '',
        ]);
        break;

      case 'cd':
        // accept any path silently — no real fs yet
        if (!args[0]) print([cwd, '']);
        else if (args[0] === '..') {
          const parts = cwd.split('\\');
          if (parts.length > 1) parts.pop();
          setCwd(parts.join('\\') || 'C:');
          print(['']);
        } else {
          setCwd(`${cwd}\\${args[0].toUpperCase()}`);
          print(['']);
        }
        break;

      case 'exit':
        print(['Connection closed by remote host.', '']);
        break;

      default:
        print([`'${cmd}' is not recognized. Type 'help'.`, '']);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = input;
      setInput('');
      setHistory((h) => [...h, value]);
      setHistIdx(-1);
      runCommand(value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(nextIdx);
      setInput(history[nextIdx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const nextIdx = histIdx + 1;
      if (nextIdx >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  return (
    <div
      className="terminal-window"
      style={{ background: theme.bg, color: theme.fg }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="terminal-scroll win95-scrollbar">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
        <div className="terminal-prompt">
          <span>{cwd}&gt;&nbsp;</span>
          <input
            ref={inputRef}
            className="terminal-input"
            style={{ color: theme.fg, caretColor: theme.fg }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

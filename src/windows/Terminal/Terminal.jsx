import { useEffect, useRef, useState } from 'react';
import { profile, projects, skills, contact } from '../../data/content';
import {
  FS,
  ROOT_PATH,
  resolveNode,
  parentPath,
  joinChild,
  buildTree,
  splitPath,
} from '../../data/fileSystem';
import { useDesktopStore } from '../../store/useDesktopStore';
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

  type 'help' for commands · 'tree' for file system · 'matrix' to wake up
`;

const BOOT = [
  'AdityaOS [Version 1.0.0]',
  '(c) 2026 Aditya Harshavardhan. All rights reserved.',
  '',
];

const FORTUNES = [
  'The best code is the code you don\'t have to write.',
  'A 4.0 GPA is not a personality. (But it does help.)',
  'Latency is the silent killer of UX.',
  'Real-time means real-time. Not "after the GC pauses."',
  'Ship it, then iterate. Or iterate forever and never ship.',
  'Edge inference > round trip to a GPU farm — when you can swing it.',
];

function (msg) {
  const top = ' ' + '_'.repeat(msg.length + 2);
  const bottom = ' ' + '-'.repeat(msg.length + 2);
  return [
    top,
    `< ${msg} >`,
    bottom,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ];
}

function resolveRelative(cwd, target) {
  if (!target) return cwd;
  // Absolute path?
  if (/^[A-Za-z]:/.test(target)) return target;
  if (target.startsWith('\\') || target.startsWith('/')) {
    return 'C:' + target.replace(/\//g, '\\');
  }
  // Relative
  const parts = splitPath(cwd);
  target
    .replace(/\//g, '\\')
    .split('\\')
    .filter(Boolean)
    .forEach((seg) => {
      if (seg === '..') {
        if (parts.length > 1) parts.pop();
      } else if (seg !== '.') {
        parts.push(seg);
      }
    });
  return parts[0] + (parts.length > 1 ? '\\' + parts.slice(1).join('\\') : '\\');
}

export function Terminal() {
  const [lines, setLines] = useState([...BOOT, BANNER]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [themeName, setThemeName] = useState('green');
  const [cwd, setCwd] = useState('C:\\PORTFOLIO');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const triggerBSOD = useDesktopStore((s) => s.triggerBSOD);
  const triggerMatrix = useDesktopStore((s) => s.triggerMatrix);

  const theme = THEMES[themeName];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const print = (...rows) => setLines((prev) => [...prev, ...rows.flat()]);

  const printAnimated = async (rows, delayMs = 40) => {
    for (const r of rows) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      setLines((prev) => [...prev, r]);
    }
  };

  const runCommand = async (raw) => {
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
          '  whoami               profile summary',
          '  about                bio',
          '  projects             list projects',
          '  skills               list skills by category',
          '  contact              contact info',
          '  ls, dir [path]       list directory',
          '  cd <path>            change directory (.. for parent)',
          '  cat, type <file>     print file',
          '  tree                 directory tree from cwd',
          '  pwd                  print working directory',
          '  clear, cls           clear screen',
          '  theme <name>         green, amber, blue, white, red, purple',
          '  date                 current date/time',
          '  echo <text>          print text',
          '  neofetch             system info',
          '  banner               show banner',
          '  fortune              random quip',
          '   <text>        a cow says something',
          '  matrix               enter the matrix',
          '  bsod                 simulate windows crash',
          '  exit                 print exit message',
          '',
        ]);
        break;

      case 'whoami':
        print([
          profile.name,
          profile.role,
          profile.school,
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
            `> ${p.title}${p.tagline ? `   [${p.tagline}]` : ''}`,
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
          `phone:    ${contact.phone}`,
          `github:   ${contact.github}`,
          `linkedin: ${contact.linkedin}`,
          `location: ${contact.location}`,
          '',
        ]);
        break;

      case 'pwd':
        print([cwd, '']);
        break;

      case 'ls':
      case 'dir': {
        const target = args[0] ? resolveRelative(cwd, args[0]) : cwd;
        const node = resolveNode(target);
        if (!node) {
          print([`${args[0] ?? target}: not found`, '']);
          break;
        }
        if (node.type !== 'dir') {
          print([node.name, '']);
          break;
        }
        const rows = [` Directory of ${target}`, ''];
        Object.values(node.children).forEach((child) => {
          if (child.type === 'dir') rows.push(` <DIR>   ${child.name}`);
          else rows.push(`         ${child.name}`);
        });
        rows.push('');
        print(rows);
        break;
      }

      case 'cd': {
        if (!args[0]) {
          print([cwd, '']);
          break;
        }
        if (args[0] === '..') {
          setCwd(parentPath(cwd));
          print(['']);
          break;
        }
        if (args[0] === '\\' || args[0] === '/') {
          setCwd(ROOT_PATH.replace(/\\$/, ''));
          print(['']);
          break;
        }
        const target = resolveRelative(cwd, args[0]);
        const node = resolveNode(target);
        if (!node) {
          print([`The system cannot find the path specified: ${args[0]}`, '']);
        } else if (node.type !== 'dir') {
          print([`Not a directory: ${args[0]}`, '']);
        } else {
          setCwd(target.replace(/\\$/, '') || ROOT_PATH);
          print(['']);
        }
        break;
      }

      case 'cat':
      case 'type': {
        if (!args[0]) {
          print(['Usage: cat <file>', '']);
          break;
        }
        const target = resolveRelative(cwd, args[0]);
        const node = resolveNode(target);
        if (!node) {
          print([`${args[0]}: file not found`, '']);
        } else if (node.type !== 'file') {
          print([`${args[0]}: is a directory`, '']);
        } else {
          print([...node.content.split('\n'), '']);
        }
        break;
      }

      case 'tree':
        print([...buildTree(cwd), '']);
        break;

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

      case 'banner':
        print([BANNER]);
        break;

      case 'fortune':
        print([FORTUNES[Math.floor(Math.random() * FORTUNES.length)], '']);
        break;

      case '':
        print([...(args.join(' ') || 'moo.'), '']);
        break;

      case 'neofetch':
        print([
          '       .-""-.',
          `      / .--. \\     ${profile.handle}@AdityaOS`,
          `     | |    | |    -----------`,
          '     | |.-""-.|    OS: AdityaOS 1.0',
          `     |//      \\|    Host: Browser`,
          `     ||        ||    Shell: jsh 1.0`,
          `      \\\\\\____///    Theme: ${themeName}`,
          `       '------'     Uptime: forever`,
          '',
        ]);
        break;

      case 'matrix':
        print(['Wake up, Neo…', '']);
        triggerMatrix();
        break;

      case 'bsod':
        print(['Simulating critical system error…', '']);
        await new Promise((r) => setTimeout(r, 600));
        triggerBSOD();
        break;

      case 'hack':
        print(['INITIATING HACK SEQUENCE…', '']);
        // eslint-disable-next-line no-await-in-loop
        await printAnimated(
          [
            '> Bypassing firewall…',
            '> Cracking passwords…  done.',
            '> Pivoting through router…',
            '> Reading mainframe…',
            '> Locating target node…',
            '> Decrypting Aditya.zip…',
            '> ACCESS GRANTED.',
            '(Disclaimer: this was theater.)',
            '',
          ],
          200
        );
        break;

      case 'sudo':
        print(['Nice try. This isn\'t Linux.', '']);
        break;

      case 'rm':
        print([`rm: cannot remove '${args.join(' ')}': everything is sacred`, '']);
        break;

      case 'exit':
        print(['Connection closed by remote host.', '']);
        break;

      default:
        print([`'${cmd}' is not recognized. Type 'help'.`, '']);
    }
  };

  const tabComplete = () => {
    const m = input.match(/^(\S+\s+)(\S*)$/);
    if (!m) return;
    const prefix = m[1];
    const partial = m[2];
    const sepIdx = Math.max(partial.lastIndexOf('\\'), partial.lastIndexOf('/'));
    const baseRel = sepIdx >= 0 ? partial.slice(0, sepIdx + 1) : '';
    const stem = sepIdx >= 0 ? partial.slice(sepIdx + 1) : partial;
    const dirPath = baseRel ? resolveRelative(cwd, baseRel) : cwd;
    const node = resolveNode(dirPath);
    if (!node || node.type !== 'dir') return;
    const candidates = Object.values(node.children).filter((c) =>
      c.name.toLowerCase().startsWith(stem.toLowerCase())
    );
    if (candidates.length === 1) {
      const c = candidates[0];
      const suffix = c.type === 'dir' ? '\\' : '';
      setInput(`${prefix}${baseRel}${c.name}${suffix}`);
    } else if (candidates.length > 1) {
      print([candidates.map((c) => c.name).join('  '), '']);
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      tabComplete();
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
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

// keep FS import alive even if unused in some branches
void FS;

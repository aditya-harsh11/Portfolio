import { useEffect, useRef, useState } from 'react';
import { profile, projects, skills, contact, education, experience } from '../../data/content';
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
    _    ____ ___ _______   ___
   / \  |  _ \_ _|_   _\ \ / / \
  / _ \ | | | | |  | |  \ V / _ \
 / ___ \| |_| | |  | |   | |/ ___ \
/_/   \_\____/___| |_|   |_/_/   \_\

  type 'help' for commands
`;

const BOOT = [
  'AdityaOS [Version 1.0.0]',
  '(c) 2026 Aditya Harshavardhan. All rights reserved.',
  '',
];

const FORTUNES = [
  'Most things become easier once you start.',
  'The bug was obvious in hindsight.',
  'Good ideas usually start as side projects.',
  'If it works and nobody complains, ship it.',
  'Coffee first. Architecture later.',
  'The hardest part is usually getting started.',
  'Somehow, it works better at 2 AM.',
  'Perfect is very expensive.',
  'Every project has one file nobody wants to touch.',
  'A surprisingly large amount of life is debugging.',
  'Nothing motivates like a deadline you ignored.',
  'There\'s always one more tiny fix.',
  'The README is a work of fiction.',
  'Simple scales better than clever.',
  'Today\'s shortcut is tomorrow\'s technical debt.',
  'Good software feels invisible.',
  'The first version is supposed to be rough.',
  'If you\'re stuck, go for a walk.',
  'Everything is temporary except legacy code.',
  'The best projects are built out of curiosity.',
  'Some problems disappear after restarting everything.',
  'People care about things that feel fast.',
  'The second monitor is emotional support.',
  'Most breakthroughs happen after confusion.',
  'You probably don\'t need another framework.',
  'Small improvements compound quickly.',
  'Behind every clean demo is mild panic.',
  'Sleep is an underrated optimization.',
  'Building things > talking about building things.',
  'Future you will appreciate the comments.',
  'Madison winters are ideal for staying inside and coding.',
  'Hackathons are just caffeine-powered group projects.',
  'Real-time systems are only fun after they finally work.',
  'There\'s a 90% chance the issue is one missing line.',
  'The demo always works better in rehearsal.',
  '4.0 GPA, questionable sleep schedule.',
  'Turning random ideas into projects is the fun part.',
  'The best learning happens when you build something slightly too ambitious.',
  'Nothing builds character like debugging five minutes before a presentation.',
  'Every side project starts with "this should be simple."',
  'The best UI is the one nobody has to think about.',
  'Fast is a feature.',
  'Somehow the smallest bug takes the longest to find.',
  'Most of engineering is trial, error, and Stack Overflow.',
  'The project that almost broke you usually teaches the most.',
];

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

  const printProgress = async (label, totalMs = 1800) => {
    const width = 24;
    const steps = 20;
    const render = (i) => {
      const filled = Math.round((i / steps) * width);
      const pct = Math.round((i / steps) * 100);
      return `${label} [${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${String(pct).padStart(3)}%`;
    };
    setLines((prev) => [...prev, render(0)]);
    for (let i = 1; i <= steps; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, totalMs / steps));
      const next = render(i);
      setLines((prev) => [...prev.slice(0, -1), next]);
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
          '',
          '  about                bio',
          '  education            schools and coursework',
          '  experience           work history',
          '  skills               list skills by category',
          '  projects             list projects',
          '  contact              contact info',
          '',
          '  ls, dir [path]       list directory',
          '  cd <path>            change directory (.. for parent)',
          '  cat, type <file>     print file',
          '  tree                 directory tree from cwd',
          '  pwd                  print working directory',
          '',
          '  clear, cls           clear screen',
          '  theme <name>         green, amber, blue, white, red, purple',
          '  banner               show banner',
          '  echo <text>          print text',
          '',
          '  neofetch             system info',
          '  fortune              random quip',
          '  matrix               enter the matrix',
          '  bsod                 simulate windows crash',
          '  hack                 become a hacker',
          '  format               delete system32 (don\'t)',
          '',
          '  help, ?              show this list',
          '  exit                 print exit message',
          '',
        ]);
        break;

      case 'about':
        print([...profile.bio, '']);
        break;

      case 'education':
        print(
          education.flatMap((ed) => [
            ed.school,
            `  ${ed.degree}`,
            `  ${ed.dates}   GPA: ${ed.gpa}`,
            `  coursework: ${ed.coursework.join(', ')}`,
            '',
          ])
        );
        break;

      case 'experience':
        print(
          experience.flatMap((e) => [
            `> ${e.title} — ${e.org}`,
            `  ${e.location} · ${e.dates}`,
            ...e.bullets.map((b) => `  • ${b}`),
            '',
          ])
        );
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

      case 'echo':
        print([args.join(' '), '']);
        break;

      case 'banner':
        print([BANNER]);
        break;

      case 'fortune':
        print([FORTUNES[Math.floor(Math.random() * FORTUNES.length)], '']);
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
        print(['[ INITIATING HACK SEQUENCE ]', '']);
        await printAnimated(
          [
            '[*] Scanning network 192.168.1.0/24…',
            '[*] Port scan in progress…',
            '[+] Found host: TARGET-MAINFRAME (192.168.1.42)',
            '[+] Open ports: 22, 80, 443, 3389',
            '[*] Probing for vulnerabilities…',
            '[+] CVE-1995-PORTFOLIO detected.',
            '[*] Breaking in…',
          ],
          180
        );
        await printProgress('    Cracking root password   ', 1800);
        await printAnimated(
          [
            '[+] Authentication bypassed.',
            '[*] Establishing reverse shell…',
            '[+] Shell acquired.',
            '[*] Exfiltrating files…',
          ],
          180
        );
        await printProgress('    Downloading aditya.zip   ', 1800);
        await printAnimated(
          [
            '[+] Transfer complete: 3.7 GB',
            '[*] Clearing logs…',
            '[+] Logs wiped.',
            '',
            '  ╔════════════════════════════════╗',
            '  ║     A C C E S S   G R A N T E D     ║',
            '  ╚════════════════════════════════╝',
            '',
            '(Disclaimer: this was theater. No mainframes were harmed.)',
            '',
          ],
          120
        );
        break;

      case 'format':
      case 'rmrf': {
        const wantsSystem32 =
          c === 'rmrf' || args.join(' ').toLowerCase().includes('system32');
        print([
          wantsSystem32
            ? 'sudo rm -rf C:\\WINDOWS\\SYSTEM32'
            : 'format C:',
          '',
          'WARNING: this will permanently erase C:\\WINDOWS\\SYSTEM32',
          'Proceed with deletion? [Y/n] Y',
          '',
        ]);
        await printAnimated(
          [
            '> Unmounting volume…',
            '> Acquiring exclusive lock…',
            '> Removing critical system files…',
          ],
          200
        );
        await printProgress('    Deleting SYSTEM32        ', 2200);
        await printAnimated(
          [
            '  removed: kernel32.dll',
            '  removed: user32.dll',
            '  removed: ntoskrnl.exe',
            '  removed: explorer.exe',
            '  removed: every important thing',
            '',
            'Format complete. 0 bytes free.',
            '',
            'A critical system error has occurred…',
            '',
          ],
          140
        );
        await new Promise((r) => setTimeout(r, 600));
        triggerBSOD();
        break;
      }

      case 'sudo': {
        const sub = args.join(' ').toLowerCase();
        if (sub.startsWith('rm') && sub.includes('system32')) {
          await runCommand('rmrf system32');
          break;
        }
        if (sub === 'hack' || sub === 'become a hacker' || sub.startsWith('hack')) {
          await runCommand('hack');
          break;
        }
        print(['Nice try. This isn\'t Linux.', '']);
        break;
      }

      case 'rm':
        if (args.join(' ').toLowerCase().includes('system32')) {
          await runCommand('rmrf system32');
          break;
        }
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

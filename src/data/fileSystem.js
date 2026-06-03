// Fake file system shared between Terminal (ls/cd/cat/tree) and Explorer.
//
// Node shapes:
//   { type: 'dir',  name, children: { childName: node, ... } }
//   { type: 'file', name, content: string, ext?: string }

import { profile, contact, education, experience, projects, skills } from './content';

const lines = (...rows) => rows.flat().join('\n');

const projectFile = (p) =>
  lines(
    p.title,
    '='.repeat(p.title.length),
    p.tagline ? p.tagline : '',
    '',
    p.blurb,
    '',
    `Stack: ${p.stack.join(', ')}`,
    `Link:  ${p.link}`
  );

const experienceFile = (e) =>
  lines(
    `${e.title} — ${e.org}`,
    `${e.location} · ${e.dates}`,
    '',
    ...e.bullets.map((b) => `• ${b}`)
  );

const file = (name, content, ext) => ({ type: 'file', name, content, ext });
const dir = (name, children) => ({ type: 'dir', name, children });

export const FS = dir('C:', {
  PORTFOLIO: dir('PORTFOLIO', {
    'README.txt': file(
      'README.txt',
      lines(
        `Hi, I'm ${profile.name}.`,
        profile.tagline,
        '',
        profile.role,
        profile.school,
        '',
        'Browse PROJECTS for what I\'ve built, EXPERIENCE for work history,',
        'AWARDS for recognitions, or open CONTACT.txt to reach me.',
        '',
        'Type "help" for shell commands.'
      ),
      'txt'
    ),
    'CONTACT.txt': file(
      'CONTACT.txt',
      lines(
        `Email:    ${contact.email}`,
        `GitHub:   ${contact.github}`,
        `LinkedIn: ${contact.linkedin}`,
        `Location: ${contact.location}`
      ),
      'txt'
    ),
    'ABOUT.txt': file(
      'ABOUT.txt',
      lines(...profile.bio.flatMap((p) => [p, ''])),
      'txt'
    ),
    PROJECTS: dir(
      'PROJECTS',
      Object.fromEntries(
        projects.map((p) => {
          const name = `${p.title.replace(/\s+/g, '_')}.txt`;
          return [name, file(name, projectFile(p), 'txt')];
        })
      )
    ),
    EXPERIENCE: dir(
      'EXPERIENCE',
      Object.fromEntries(
        experience.map((e, i) => {
          const name = `${i + 1}_${e.org.replace(/\s+/g, '_')}.txt`;
          return [name, file(name, experienceFile(e), 'txt')];
        })
      )
    ),
    EDUCATION: dir(
      'EDUCATION',
      Object.fromEntries(
        education.map((ed) => {
          const name = `${ed.school.replace(/[\s—-]+/g, '_')}.txt`;
          return [
            name,
            file(
              name,
              lines(
                ed.school,
                ed.degree,
                ed.dates,
                `GPA: ${ed.gpa}`,
                '',
                'Coursework:',
                ...ed.coursework.map((c) => `  • ${c}`)
              ),
              'txt'
            ),
          ];
        })
      )
    ),
    ...(profile.awards && profile.awards.length > 0
      ? {
          AWARDS: dir('AWARDS', {
            'awards.txt': file(
              'awards.txt',
              lines(...profile.awards.map((a) => `★ ${a}`)),
              'txt'
            ),
          }),
        }
      : {}),
    SKILLS: dir('SKILLS', {
      'skills.txt': file(
        'skills.txt',
        lines(
          ...Object.entries(skills).flatMap(([cat, list]) => [
            `[${cat}]`,
            `  ${list.join(', ')}`,
            '',
          ])
        ),
        'txt'
      ),
    }),
  }),
  WINDOWS: dir('WINDOWS', {
    SYSTEM32: dir('SYSTEM32', {
      'config.sys': file(
        'config.sys',
        lines(
          'DEVICE=C:\\WINDOWS\\HIMEM.SYS',
          'DEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS',
          'DOS=HIGH,UMB',
          'FILES=30',
          'BUFFERS=20',
          'LASTDRIVE=Z',
          'SHELL=C:\\COMMAND.COM /P /E:512'
        ),
        'sys'
      ),
      'definitely_not_a_virus.exe': file(
        'definitely_not_a_virus.exe',
        lines(
          'THIS FILE IS DEFINITELY NOT A VIRUS.',
          '',
          'It contains zero malicious payloads, zero crypto miners,',
          'and zero attempts to exfiltrate your browser history.',
          '',
          'If you ran it: too late. Your free trial of personality has expired.',
          '',
          '(joking. this is just a text file. you cannot run .exe in a browser.)'
        ),
        'exe'
      ),
    }),
    'win.ini': file(
      'win.ini',
      lines(
        '[wallpaper]',
        'background=clouds',
        '[mouse]',
        'doubleClickSpeed=350'
      ),
      'ini'
    ),
  }),
  GAMES: dir('GAMES', {
    'snake.exe': file('snake.exe', '<binary> — open Games to play', 'exe'),
    'minesweeper.exe': file('minesweeper.exe', '<binary> — open Games to play', 'exe'),
    'tetris.exe': file('tetris.exe', '<binary> — open Games to play', 'exe'),
    '2048.exe': file('2048.exe', '<binary> — open Games to play', 'exe'),
    'pong.exe': file('pong.exe', '<binary> — open Games to play', 'exe'),
    'breakout.exe': file('breakout.exe', '<binary> — open Games to play', 'exe'),
    'memory.exe': file('memory.exe', '<binary> — open Games to play', 'exe'),
    'gomoku.exe': file('gomoku.exe', '<binary> — open Games to play', 'exe'),
    'lightsout.exe': file('lightsout.exe', '<binary> — open Games to play', 'exe'),
  }),
});

// ---------- helpers ----------

export const ROOT_PATH = 'C:\\';

export function splitPath(path) {
  // 'C:\\PORTFOLIO\\PROJECTS' -> ['C:', 'PORTFOLIO', 'PROJECTS']
  return path.split(/[\\/]+/).filter(Boolean);
}

export function joinPath(parts) {
  if (parts.length === 0) return ROOT_PATH;
  return parts[0] + '\\' + parts.slice(1).join('\\');
}

export function resolveNode(path) {
  const parts = splitPath(path);
  if (parts.length === 0 || parts[0].toUpperCase() !== 'C:') return null;
  let node = FS;
  for (let i = 1; i < parts.length; i++) {
    if (node.type !== 'dir') return null;
    const key = Object.keys(node.children).find(
      (k) => k.toUpperCase() === parts[i].toUpperCase()
    );
    if (!key) return null;
    node = node.children[key];
  }
  return node;
}

export function listDir(path) {
  const node = resolveNode(path);
  if (!node || node.type !== 'dir') return null;
  return Object.values(node.children);
}

export function readFile(path) {
  const node = resolveNode(path);
  if (!node || node.type !== 'file') return null;
  return node.content;
}

export function parentPath(path) {
  const parts = splitPath(path);
  if (parts.length <= 1) return ROOT_PATH;
  return joinPath(parts.slice(0, -1));
}

export function joinChild(path, childName) {
  const normalized = path.endsWith('\\') ? path.slice(0, -1) : path;
  return `${normalized}\\${childName}`;
}

export function buildTree(path = ROOT_PATH, depth = 0, maxDepth = 4) {
  const node = resolveNode(path);
  if (!node) return [];
  const out = [];
  const indent = '  '.repeat(depth);
  out.push(`${indent}${node.type === 'dir' ? '📁' : '📄'} ${node.name}`);
  if (node.type === 'dir' && depth < maxDepth) {
    Object.values(node.children).forEach((child) => {
      out.push(...buildTree(joinChild(path, child.name), depth + 1, maxDepth));
    });
  }
  return out;
}

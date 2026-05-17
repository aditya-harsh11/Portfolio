// Desktop icons + start menu items.
// Each entry: { id, label, emoji, component, title, width, height, singleton, link? }

export const desktopIcons = [
  {
    id: 'about',
    label: 'About Me',
    emoji: '👤',
    component: 'About',
    title: 'About Me',
    width: 620,
    height: 480,
    singleton: true,
  },
  {
    id: 'projects',
    label: 'Projects',
    emoji: '📁',
    component: 'Projects',
    title: 'Projects',
    width: 680,
    height: 520,
    singleton: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    emoji: '✉️',
    component: 'Contact',
    title: 'Contact',
    width: 480,
    height: 420,
    singleton: true,
  },
  {
    id: 'terminal',
    label: 'Terminal',
    emoji: '🖥️',
    component: 'Terminal',
    title: 'Terminal — cmd.exe',
    width: 720,
    height: 460,
    singleton: true,
  },
  {
    id: 'snake',
    label: 'Snake',
    emoji: '🐍',
    component: 'Snake',
    title: 'Snake.exe',
    width: 540,
    height: 460,
    singleton: true,
  },
  {
    id: 'github',
    label: 'GitHub',
    emoji: '🐱',
    link: 'https://github.com/yourhandle', // TODO
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    emoji: '💼',
    link: 'https://linkedin.com/in/yourhandle', // TODO
  },
];

export const startMenuItems = [
  { id: 'about', label: 'About Me', emoji: '👤' },
  { id: 'projects', label: 'Projects', emoji: '📁' },
  { id: 'terminal', label: 'Terminal', emoji: '🖥️' },
  { id: 'contact', label: 'Contact', emoji: '✉️' },
  { id: 'snake', label: 'Snake', emoji: '🐍' },
  { separator: true },
  { id: 'github', label: 'GitHub', emoji: '🐱' },
  { id: 'linkedin', label: 'LinkedIn', emoji: '💼' },
];

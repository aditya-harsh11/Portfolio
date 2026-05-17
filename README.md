# Aditya — Portfolio 95

A Windows 95–themed portfolio site. Draggable windows, a fake terminal, click sounds, Snake.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
```

## Stack

- Vite + React 19
- Tailwind CSS 3 + handwritten Win95 CSS utilities (`src/components/win95/win95.css`)
- Zustand for window state
- react-rnd for window drag + resize

## Where things live

| What | Path |
| --- | --- |
| Your content (bio, projects, skills, contact) | `src/data/content.js` |
| Desktop icons + start menu items | `src/data/icons.js` |
| App shell | `src/App.jsx` |
| Window store | `src/store/useDesktopStore.js` |
| Win95 visual primitives | `src/components/win95/win95.css` |
| Window chrome (drag/resize/title bar) | `src/components/Window/` |
| Desktop + icon drag | `src/components/Desktop/` |
| Taskbar + Start menu + clock | `src/components/Taskbar/` |
| Individual windows | `src/windows/<Name>/` |
| Snake | `src/windows/games/Snake/` |
| Fonts + audio | `src/assets/fonts/`, `public/audio/` |

## Phases

Phase 1 (current): desktop, taskbar, About / Projects / Contact / Terminal / Snake.
Phase 2: fake file system, Explorer, Notepad, Settings, Recycle Bin, easter eggs.
Phase 3: more games, music player, desktop pet, install wizard.
Phase 4: responsive, accessibility, lazy-loading, SEO.

## TODO before sharing

- Replace placeholder text in `src/data/content.js` (your bio, projects, contact links).
- Replace `https://github.com/yourhandle` / LinkedIn URLs in `content.js` and `icons.js`.
- Drop a real profile photo into `public/images/` and reference it from `About.jsx`.

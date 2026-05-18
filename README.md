# Aditya — Portfolio 95

A Windows 95–themed portfolio site. Draggable windows, a working terminal with a
fake file system, click sounds, 9 mini-games, a desktop pet, BSOD, and
a Konami-code easter egg.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
npm run preview  # serve the production build locally
```

## Deploy to Vercel

```bash
npm i -g vercel       # one-time
vercel                # first deploy — preview URL
vercel --prod         # promote to production
```

`vercel.json` is committed; Vercel auto-detects Vite and uses
`npm run build` → `dist/`. SPA rewrites are configured so deep links
resolve to `index.html`.

## Stack

- Vite + React 19
- Tailwind CSS 3 + handwritten Win95 CSS utilities (`src/components/win95/win95.css`)
- Zustand for window state
- react-rnd for window drag + resize

## Where things live

| What | Path |
| --- | --- |
| Your content (bio, projects, skills, education, experience) | `src/data/content.js` |
| Desktop icons + start menu items | `src/data/icons.js` |
| Games catalog | `src/data/games.js` |
| Fake file system (auto-generated from content.js) | `src/data/fileSystem.js` |
| App shell | `src/App.jsx` |
| Window store (Zustand) | `src/store/useDesktopStore.js` |
| Win95 visual primitives | `src/components/win95/win95.css` |
| Window chrome (drag/resize/title bar) | `src/components/Window/` |
| Desktop + icon drag | `src/components/Desktop/` |
| Taskbar + Start menu + clock + visitor counter | `src/components/Taskbar/` |
| Overlay components (BSOD, Matrix, Confetti, Pet, Wizard) | `src/components/Overlays/` |
| Mobile fallback (<768px) | `src/components/Mobile/` |
| Standard windows (About, Projects, Contact, Terminal, Explorer, Notepad, Settings, Recycle Bin, Music) | `src/windows/<Name>/` |
| Games launcher | `src/windows/GamesHub/` |
| Game implementations | `src/windows/games/<Name>/` |
| Fonts + audio | `src/assets/fonts/`, `public/audio/` |

## Phases (all done)

1. **Phase 1** — desktop, taskbar, About / Projects / Contact / Terminal / Snake.
2. **Phase 2** — fake file system, Explorer, Notepad, Settings, Recycle Bin, BSOD/Matrix/Konami.
3. **Phase 3** — 8 more games, music player, desktop pet, install wizard, visitor counter.
4. **Phase 4** — responsive mobile fallback, keyboard accessibility, code-split games via `React.lazy`, SEO meta, Vercel deploy config.

## Customizing

Everything user-facing lives in `src/data/content.js`. Replace bio paragraphs,
projects, skills, education, experience, and contact fields there — the fake
file system, About / Projects / Contact windows, and Terminal commands all
read from this one file.

Wallpaper goes in `public/images/wallpapers/`. Profile photo in `public/images/`.
The Settings window already supports both image URLs and solid color
wallpapers (the `color:#hex` sentinel).

## License

Personal portfolio code. Win95 fonts (MS Sans Serif Bold, Jersey 10) are
included for personal use only — replace if redistributing.

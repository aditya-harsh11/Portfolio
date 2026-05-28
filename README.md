# Aditya — Portfolio 95

A personal portfolio site disguised as a working Windows 95 desktop. Instead
of scrolling through a single-page resume, you boot into a fake operating
system, log in, and find my bio, projects, and experience scattered across
draggable windows, file folders, terminal commands, and a few hidden corners
of the OS.

The goal was to build something that felt like a real environment rather
than a themed mockup. The desktop has its own window manager (drag, resize,
minimize, maximize, z-order, taskbar). The terminal is an actual shell —
it parses commands, walks a real path tree, supports tab completion, and
shares its file system with the Explorer window. The Internet Explorer
window has multiple pages and a hidden Chrome-style dino game. The Games
folder has nine playable mini-games. Clippy occasionally pops up with
opinions. There's a BSOD, a Matrix mode, a Konami code, and a fake hacker
sequence — among other things you'll have to find yourself.

The live site lives at: https://aditya-bio.vercel.app.

## What's in it

- **Desktop** — draggable icons (positions persist), Start menu, taskbar with
  clock and global visit counter, custom wallpapers.
- **Windows** — About, Projects, Contact, Settings, Notepad, Recycle Bin —
  all draggable, resizable, minimizable, maximizable.
- **Terminal** — a real shell with `ls`, `cd`, `cat`, `tree`, tab completion,
  command history, six color themes, and commands like `neofetch`, `hack`,
  `matrix`, `bsod`, and `fortune`.
- **Explorer + file system** — `C:\PORTFOLIO` holds my bio, projects,
  experience, education, and skills as browsable folders and `.txt` files,
  all generated from one content file.
- **Internet Explorer** — fake browser with multiple pages and a Chrome-style
  dino game baked into the offline page.
- **Games** — Snake, Minesweeper, Tetris, 2048, Pong, Breakout, Memory,
  Gomoku, and Lights Out, lazy-loaded so they don't bloat the initial bundle.
- **Easter eggs** — Go find out!
- **Mobile** — graceful fallback under 768px with the option to force the
  desktop view anyway.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

Deploys to Vercel out of the box — `vercel.json` is committed and SPA
rewrites are configured so deep links resolve to `index.html`.

## Stack

Vite · React 19 · Zustand (window state) · react-rnd (drag + resize) ·
Tailwind 3 + handwritten Win95 CSS (`src/components/win95/win95.css`).

## Layout

| What | Path |
| --- | --- |
| All user content (bio, projects, skills, education, experience) | `src/data/content.js` |
| Desktop icons + Start menu items | `src/data/icons.js` |
| Games catalog | `src/data/games.js` |
| File system (auto-generated from `content.js`) | `src/data/fileSystem.js` |
| Window store | `src/store/useDesktopStore.js` |
| Window chrome (titlebar, drag, resize) | `src/components/Window/` |
| Desktop, Taskbar, Overlays, Mobile fallback | `src/components/` |
| App windows (About, Terminal, Explorer, …) | `src/windows/<Name>/` |
| Game implementations | `src/windows/games/<Name>/` |
| Fonts + audio | `src/assets/fonts/`, `public/audio/` |

## Editing content

Everything user-facing is in `src/data/content.js`. Change a project there
and it updates in the Projects window, the Terminal `projects` command, the
mobile view, and the file system at the same time.

Wallpapers go in `public/images/wallpapers/`. The Settings window accepts
image URLs or `color:#hex` for solid backgrounds.

## License

Personal portfolio code. Win95 fonts (MS Sans Serif Bold, Jersey 10) are
included for personal use only — replace if you redistribute.

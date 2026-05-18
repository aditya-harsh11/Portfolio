# DEVNOTES — Aditya's Portfolio 95

Everything we've built, every decision, every gotcha. This is the running
project log — when you come back in 6 months or a future agent picks this
up, start here.

> See `README.md` for user-facing usage. This doc is the internal log.

---

## 0. TL;DR

- **Stack:** Vite 8 + React 19 + Tailwind 3 + Zustand + react-rnd. No router.
- **Path:** `C:\Projects\Portfolio-Website-Aditya\`.
- **State on `main`:** 5 commits delivered in 4 phases + 1 test-fix round.
  After commit `c679c56` there's a working set of uncommitted tweaks
  (rubber duck, real GH/LI icons, bigger icons, install-wizard tightening,
  field guards, cursors). User wants to keep testing before the next commit.
- **Run:** `npm install && npm run dev` → http://localhost:5173 (or
  next free port — Vite auto-increments if something's already there).
- **Deploy:** `npm i -g vercel && vercel` (config already in `vercel.json`).

---

## 1. Architecture

### Tech stack rationale

| Concern | Choice | Why |
|---|---|---|
| Build tool | Vite 8 | CRA deprecated. Vite is fast + modern. |
| Framework | React 19 | Latest. Lazy + Suspense for code-split. |
| Styling | Tailwind 3 + raw CSS | Tailwind for layout; raw CSS for bevel borders that Tailwind can't express cleanly. |
| Window drag+resize | react-rnd | Single library handles both drag and resize. |
| State | Zustand | Tiny. Real store is cleaner than a window-event global bus. |
| Icons | Emoji + a few PNGs/SVGs | `@react95/icons` is installed but mostly unused. Default to emoji glyphs; use `image` field on the icon schema for real PNG/GIF. |
| Routing | None | Single-page SPA. |
| Deploy | Vercel | Zero-config for Vite. SPA rewrites + long-cache headers in `vercel.json`. |

### Folder map

```
src/
├── main.jsx                Vite entry
├── App.jsx                 Shell: composes Desktop + WindowManager + Taskbar + overlays
├── index.css               Globals: Tailwind directives, Win95 cursors, focus rings, scrollbars
├── App.css                 Desktop root + icon container
│
├── store/
│   └── useDesktopStore.js  Zustand store (window state + flags)
│
├── data/                   SINGLE SOURCE OF TRUTH for editable content
│   ├── content.js          profile / contact / education / experience / projects / skills
│   ├── icons.js            desktopIcons (positioned on desktop) + startMenuItems
│   ├── games.js            game catalog used by the Games hub
│   └── fileSystem.js       fake FS — generated from content.js, used by Explorer + Terminal
│
├── components/
│   ├── win95/win95.css     Bevel utility classes (.win95-outset, .win95-inset, etc.)
│   ├── Desktop/            Desktop + DesktopIcon + ContextMenu CSS
│   ├── Taskbar/            Taskbar + StartMenu + Clock + VisitorCounter
│   ├── Window/             Window (react-rnd wrapper) + WindowManager + WindowContentRouter
│   ├── Overlays/           Full-screen overlays mounted from App.jsx
│   │   ├── BSOD.jsx
│   │   ├── Matrix.jsx
│   │   ├── Confetti.jsx│   │   ├── DesktopPet.jsx  Includes inline RubberDuck SVG
│   │   └── InstallWizard.jsx
│   └── Mobile/MobileView.jsx   <768px fallback
│
├── windows/                One subfolder per window
│   ├── About/
│   ├── Projects/
│   ├── Contact/
│   ├── Terminal/
│   ├── Explorer/
│   ├── Notepad/
│   ├── Settings/
│   ├── RecycleBin/
│   ├── MusicPlayer/
│   ├── GamesHub/Games.jsx  Game launcher (NOT to be confused with games/ below)
│   └── games/              Each game in its own subfolder
│       ├── games.css       Shared HUD/stage styling
│       ├── Snake/
│       ├── Minesweeper/
│       ├── Tetris/
│       ├── G2048/          (folder name avoids leading digit)
│       ├── Pong/
│       ├── Breakout/
│       ├── Memory/
│       ├── Gomoku/
│       └── LightsOut/
│
├── hooks/
│   ├── useClickSounds.js
│   ├── useClock.js
│   ├── useKonamiCode.js
│   └── useGlobalShortcuts.js   Currently: only Esc closes active window
│
├── utils/
│   └── soundManager.js     Singleton, preloads /audio/click_*.mp3
│
└── assets/fonts/           MS Sans Serif Bold + Jersey 10

public/
├── audio/click_down.mp3, click_up.mp3
├── cursors/arrow.svg, pointer.svg     Old-Windows cursors
├── images/
│   ├── wallpapers/win95_bg.jpeg
│   ├── icons/github.gif, linkedin.png, folder.png, ...
│   └── profile.jpeg
├── resume/Aditya_Harshavardhan_Resume.tex
├── favicon.svg
└── robots.txt

vercel.json                 framework=vite, SPA rewrite, /assets /audio /images long-cache
```

### State (`useDesktopStore`)

```js
{
  openWindows: [{ id, component, title, icon, props, x, y, w, h, minW, minH,
                  minimized, zIndex, resizable }],
  activeWindowId,
  zCounter,
  wallpaper,                 // either a URL or "color:#hex"
  recycleBin: [{ name, component, deletedAt }],
  soundEnabled,
  soundVolume,
  bsodActive, matrixActive, confettiActive,

  openWindow(spec),          // spec: {component, title, icon, props, width, height, singleton}
  closeWindow(id),
  minimizeWindow(id),        // toggles minimized flag
  focusWindow(id),
  moveWindow(id, x, y),
  resizeWindow(id, w, h, x, y),
  setWallpaper(url),         // pass "color:#hex" for a solid color
  setSoundEnabled(bool),
  setSoundVolume(0..1),
  emptyBin(),
  triggerBSOD() / dismissBSOD(),
  triggerMatrix() / dismissMatrix(),
  triggerConfetti() / dismissConfetti(),
}
```

Wallpaper, recycle bin, sound enabled/volume persist to localStorage. Icon
positions persist under `iconPositions.v2` (bumped from v1 when we moved
to the 2-column layout).

---

## 2. How to add things

### Add a new window
1. Create folder `src/windows/<Name>/<Name>.jsx` (+ `.css`).
2. Export a named React component.
3. Register in `src/components/Window/WindowContentRouter.jsx` — either
   eager-imported (light) or `lazy()`-imported (heavy, like games or music).
4. Add a desktop icon and/or start menu entry in `src/data/icons.js`.
5. The window automatically gets drag, resize, minimize, close, focus
   stacking — all from `Window.jsx` via react-rnd.

### Add a new game
1. Create folder `src/windows/games/<Name>/<Name>.jsx` (+ `.css`).
2. Use shared `games.css` for `.game-window`, `.game-hud`, `.game-stage`.
3. Register lazily in `WindowContentRouter.jsx`:
   ```js
   const X = lazy(() => import('../../windows/games/X/X').then(m => ({ default: m.X })));
   ```
4. Add to `src/data/games.js` catalog so it shows up in the Games hub.

### Add a new overlay
1. Component in `src/components/Overlays/<Name>.jsx`.
2. Add an `xxxActive` flag + `triggerXxx` / `dismissXxx` actions to
   `useDesktopStore`.
3. Mount in `App.jsx` between the existing overlays.
4. Trigger from anywhere by calling `useDesktopStore.getState().triggerXxx()`
   or via a hook.

### Add personality strings without code changes
- Pet sayings: `src/components/Overlays/DesktopPet.jsx` → `SAYINGS`
- BSOD error codes: `src/components/Overlays/BSOD.jsx` → `ERRORS`
- Terminal fortunes / banner / boot: `src/windows/Terminal/Terminal.jsx`
- Install Wizard copy: `src/components/Overlays/InstallWizard.jsx` → `STEPS`
- Music tracks: `src/windows/MusicPlayer/MusicPlayer.jsx` → `TRACKS`
- Wallpaper presets: `src/windows/Settings/Settings.jsx` → `WALLPAPERS`
- All bio/projects/skills/contact: `src/data/content.js`

### Win95 visual primitives
Use these CSS classes — don't reinvent borders:

- `.win95-outset` — raised (default for buttons, windows)
- `.win95-inset` — sunken (containers, text inputs)
- `.win95-inset-thin` — thinner sunken (form inputs)
- `.win95-button` — full button styling including pressed state
- `.win95-titlebar` (+ `.inactive`) — navy gradient bar
- `.win95-titlebar-button` — the 16×14 close/min buttons
- `.win95-statusbar` + `.win95-statusbar-cell`
- `.win95-text` — MS Sans Serif 12px
- `.win95-scrollbar` — apply to scrollable elements for Win95-flavored bars

Defined in `src/components/win95/win95.css`.

### Cursor system

- `:root { --cursor-arrow, --cursor-hand }` in `src/index.css`.
- SVG files at `public/cursors/arrow.svg` and `public/cursors/pointer.svg`.
- Default = arrow on `html, body`. Pointer is applied to a long but explicit
  selector list (buttons, links, win95-button, desktop-icon, ms-cell, etc.).
- Disabled elements get `not-allowed`. Inputs/textareas/terminal-input get
  system `text` cursor.
- If a new clickable element needs the hand cursor, add its selector to the
  big list in `src/index.css`.

### Icon schema (`src/data/icons.js`)

```js
{
  id: 'unique-id',
  label: 'Display name',
  emoji: '👤',                 // fallback if no image
  image: '/images/...',        // optional — if present, renders <img>
  component: 'About',          // omit for external link
  link: 'https://...',         // optional — opens in new tab if set
  title: 'Window title',
  width: 620, height: 480,
  singleton: true,             // re-focus instead of opening duplicate
}
```

`DesktopIcon.jsx` auto-detects: ASCII-only emoji (`>_`) gets `.text-glyph`
styling (console-prompt look); presence of `image` swaps to `<img>`.

---

## 3. Phase + change log

### `d79aa01` — Phase 1: MVP scaffold
Vite + React + Tailwind + Zustand + react-rnd. Desktop + draggable icons,
taskbar with start menu + clock, 5 windows (About, Projects, Contact,
Terminal, Snake). Click sounds. Initial commit.

### `9f11af5` — Phase 2: depth
Real resume in `content.js`. Fake FS generated from it. Explorer + Notepad
(double-click file → opens in Notepad). Settings window (wallpaper picker
supporting both image URLs and `color:#hex`; sound toggle/volume). Recycle
Bin window. Terminal expanded to ~25 commands with real FS-aware
`ls`/`cd`/`cat`/`tree`/`pwd` + tab completion + 6 themes + matrix/hack/bsod
effects. Overlays: BSOD, Matrix canvas rain, Konami → Confetti.

### `9de049e` — Phase 3: personality
8 more games (Minesweeper, Tetris, G2048, Pong, Breakout, Memory, Gomoku,
LightsOut). Games hub launcher at `windows/GamesHub/` (case-distinct from
`games/` — see Gotchas). MusicPlayer Winamp-mock. DesktopPet
overlays. Install Wizard (5 phases gated by localStorage; re-run via
`runInstallWizard` custom event). VisitorCounter — localStorage-only
because the sandbox blocked the third-party `counterapi.dev` fetch
(deliberate: no external dependencies by default).

### `08b0da4` — Phase 4: polish
Games + MusicPlayer wrapped in `React.lazy` + Suspense — each game ships as
a 1-4 KB on-demand chunk; main bundle dropped to ~94 KB gzipped. Global
keyboard shortcuts hook. Focus rings via `:focus-visible`. `prefers-reduced-motion`
honored globally. Real SEO meta tags + SVG favicon + robots.txt. MobileView
component renders at <768px with a sessionStorage "load desktop view
anyway" escape hatch. `vercel.json` with SPA rewrite + long-cache headers.

### `c679c56` — Test-round fixes
- Install Wizard: literal `\u2019` / `\u2026` sequences rendering as text
  (JSX text nodes don't process those escapes — use real characters).
  "Fake File System" capitalized.
- Desktop icons reorganized into 2 columns of 5. Storage key bumped to v2.
- Terminal icon: `🖳` (rarely supported) → `>_` styled as a black
  console-prompt glyph via `.text-glyph` CSS.
- Terminal banner replaced with clean standard-figlet ADITYA.
- Fortunes themed Aditya-flavored (user later rewrote with their own).
- **BSOD reboot timer bug fixed.** The effect deps included `rebooting`,
  so when that flipped the effect re-ran, cleanup cleared the timer, and
  auto-dismiss never fired. Moved timer to a ref so it survives state
  changes within the same active session. Added 250 ms grace period
  before listening for dismiss events.
- **Matrix overlay same fix.** The triggering keypress was firing the
  dismiss listener as soon as `useEffect` attached it. 400 ms grace
  before attaching listeners.
- Notepad statusbar long path now truncates with ellipsis (was crushing
  line/word/char counters).
- Fake FS now lists all 9 games as `.exe` files (was only snake).
- Snake scoring 1 pt per food (was 10).
- Pong: ball ~40% slower, AI ~35% slower, paddle bounce boost reduced
  (1.04 → 1.025).
- Breakout: ball ~30% slower, paddle slower, vx cap added to prevent
  spirals.
- Music player named AdityaAMP.
- Pet sayings refreshed.
- Konami confetti: 80 → 220 pieces; 5s → 7s duration.
- Desktop Pet: click pops a Win95 speech bubble (was bare "!" reaction).
- Dropped `Alt+Tab` and `Ctrl+M` shortcuts — OS/browser conflicts. Kept
  only `Esc` closes active window.

### Uncommitted in-session tweaks (after `c679c56`)

User wanted to keep testing before the next commit. Apply on next commit:

- **Reverted Recycle Bin filled-state indicator** — back to static `🗑`.
- **Pet is now a rubber duck.** First with `🦆` emoji, then user wanted yellow
  bath-toy version → replaced with inline SVG `RubberDuck()` in
  `DesktopPet.jsx`. Body `#ffd84d`, beak `#ff9b1c`, with hair tuft, eye,
  wing, and highlight.
- **Pet sayings rewritten** for rubber-duck-debugging theme: "tell me about
  your bug", "rubber duck > stack overflow", "*judges your code silently*",
  etc. 16 lines.
- **Pet speech bubble timer**: 3500 ms → 1800 ms.
- **Old Windows cursors.** SVGs at `public/cursors/`. CSS variables
  declared in `index.css`. Wide override on clickable selectors. Inputs
  keep system text cursor.
- **GitHub + LinkedIn** use real images (`/images/icons/github.gif` and
  `linkedin.png`). Added `icon.image` field to schema; `DesktopIcon`
  renders `<img>` when present, falls back to emoji glyph.
- **Bigger desktop icons.** Container 72→84px, emoji 32→44px, image
  36→48px, label 12→13px font, gap 4→6px. Terminal `>_` glyph also scaled.
- **`profile.awards` removal crash fixed.** User removed `awards` from
  `content.js`. About.jsx and fileSystem.js still referenced it → render
  blew up → blank teal screen. Both now guard with
  `profile.awards && profile.awards.length > 0 ? ... : null` (object spread
  for the fileSystem dir entry). Apply this guard pattern to any other
  optional profile fields the user might remove.
- **Install Wizard tightened**:
  - Cancel button removed entirely (config + installing phases). User
    cannot dismiss until Finish.
  - Back button hidden on Welcome (step 0) AND EULA (step 1). Appears
    starting on Components (step 2).
- **`config.sys`** content now 7 lines of authentic DOS-era directives
  (HIMEM.SYS, EMM386.EXE, FILES=30, BUFFERS=20, LASTDRIVE=Z, etc.).
- **`definitely_not_a_virus.exe`** content now 6-line humorous mock
  warning.
- **User text edits** kept untouched:
  - `content.js` bio rewritten as multi-paragraph; projects array grew to
    7 entries (ArcFlow, Unsilenced, CED, Phanta, Vibe, TrackMyBus, This
    Portfolio).
  - `Terminal.jsx` FORTUNES rewritten.
  - Pet sayings updated.
  - `MusicPlayer.jsx` TRACKS replaced with real song titles (Snowfall,
    After Dark, Resonance, Sunset Lover, etc.).
  - `DesktopPet.jsx` SAYINGS later refreshed (separately) to duck theme.

---

## 4. Gotchas

### Windows folder case-insensitivity → `GamesHub/` vs `games/`
Windows treats `Games/` and `games/` as the same path. We initially put the
launcher at `src/windows/Games/Games.jsx` and it merged into the existing
`games/` folder containing individual game implementations. The launcher
now lives at `src/windows/GamesHub/Games.jsx`. **Rule:** never name two
sibling folders that differ only by case — Linux (Vercel) treats them as
distinct but Windows merges them.

### Sandbox blocks third-party fetches
When we tried to wire the visitor counter to `api.counterapi.dev`, the
sandbox refused the edit because it adds an unauthorized external
endpoint. **Default policy:** no third-party API calls without explicit
user authorization. VisitorCounter is therefore localStorage-only — it
counts visits per browser, not globally. If user wants global, they have
to explicitly authorize the endpoint.

### content.js field removals can crash render
Removing a field (e.g. `profile.awards`) without grepping for references
leaves dead reads in `About.jsx` and `fileSystem.js` → throws at render or
at module load → blank teal screen. **Pattern:** guard any optional
profile field with `obj.field && obj.field.length > 0 ? ... : null`.

### JSX text doesn't process `\u` escape sequences
Inside JSX text nodes (between tags), `\u2019` renders as the literal
six characters `\u2019`, not as `'`. **Use real Unicode characters** in
JSX, or wrap in a JS expression `{'\u2019'}` if you must.

### Overlay grace-period bug pattern
BSOD and Matrix both had this: triggering keypress fires; component
mounts; `useEffect` attaches a dismiss listener that catches the SAME
keypress as it bubbles, instantly dismissing. **Fix:** wrap the
`addEventListener` calls in a `setTimeout(..., 250-400ms)` and clean up
both. If you add a new dismiss-on-any-input overlay, apply the same
grace period.

### `useEffect` deps blowing away timers
Original BSOD effect listed `rebooting` in deps. When `rebooting` flipped
true, the effect re-ran, cleanup cleared the in-flight auto-dismiss
timer. **Pattern:** if a timer must survive state changes within a single
"session" of the component, store the timer in a `useRef` and only clear
it in the unmount cleanup (not on every dep change).

### Dev port collisions
The sandbox tends to leave dev servers running across sessions. Vite
auto-increments (5173 → 5174 → 5175 ...). Not a bug, just noise — kill
old servers if you want a clean port.

### Stale localStorage on layout changes
We bumped icon positions to `iconPositions.v2` when switching to the
2-column grid. **Pattern:** when changing default layouts/sizes that
persist to localStorage, bump the storage key version so existing users
don't see broken-looking layouts from the old values.

---

## 5. User preferences (what to do without asking)

These are decisions the user has expressed across the session — defaults
to apply without re-asking:

- **MVP-first, phased delivery.** Don't try to build everything at once.
- **No third-party API calls** unless explicitly authorized. Local
  fallbacks preferred.
- **Bundle splitting.** Heavy components (games, music) should be
  `React.lazy` so the initial load stays small.
- **Mobile fallback** at <768px (stacked content, "load desktop anyway"
  escape hatch).
- **Don't touch user-edited text content.** When the user edits
  `content.js`, FORTUNES, MusicPlayer TRACKS, etc., leave
  those alone unless they explicitly ask for changes.
- **Game tuning**: Pong / Breakout slow (~30% slower than naive
  defaults). Snake scores 1 per food, not 10.
- **Install Wizard**: no Cancel button. Back only after step 2.
- **Cursor**: old-Windows style (white arrow + hand SVGs) globally.
- **Icon look**: 2-column layout, ~48px glyphs. Real images for GitHub
  (animated gif) and LinkedIn.
- **Don't commit speculatively.** User explicitly wants to test before
  committing. Only commit when user says "commit" or "ship it".

---

## 6. Open follow-ups

- Some user-edited project entries still have `'Update this'` placeholder
  stacks (Phanta, Vibe, TrackMyBus) — user knows.
- "This Portfolio" project link is `'Update this'`.
- No real audio in Music Player — by design (mock). If real audio wanted,
  drop `.mp3`s in `public/audio/` and attach an `<audio>` element to the
  player state.
- Mobile View text still placeholder-ish at top; user said they'd edit.
- A blog is an open follow-up
  yet. If wanted: add `BLOG_POSTS` to `fileSystem.js` under
  `C:\BLOG\` as `.md` files and let Notepad render them.

---

## 7. Quick "where do I edit X?" reference

| Want to change… | Edit |
|---|---|
| Name / bio / education / experience / projects / skills / contact | `src/data/content.js` |
| Desktop icon labels, emojis, images | `src/data/icons.js` |
| Game catalog (Games hub) | `src/data/games.js` |
| Fake FS structure | `src/data/fileSystem.js` |
| Rubber duck SVG + sayings | `src/components/Overlays/DesktopPet.jsx` |
| BSOD error codes | `src/components/Overlays/BSOD.jsx` → `ERRORS` |
| Install Wizard copy / flow | `src/components/Overlays/InstallWizard.jsx` |
| Terminal commands + banner + fortunes | `src/windows/Terminal/Terminal.jsx` |
| Music Player tracks | `src/windows/MusicPlayer/MusicPlayer.jsx` → `TRACKS` |
| Wallpaper presets | `src/windows/Settings/Settings.jsx` → `WALLPAPERS` |
| Win95 visual classes | `src/components/win95/win95.css` |
| Cursors | `public/cursors/*.svg` + CSS in `src/index.css` |
| Page `<title>` / SEO meta | `index.html` |
| Deploy config | `vercel.json` |

---

## 8. Verification checklist (after any non-trivial change)

```bash
npm run build          # must finish without errors
npm run dev            # boot dev server, open in browser, hard-refresh
```

Then exercise:
- Open About / Projects / Contact → all content rendering correctly
- Terminal: `help`, `ls`, `cat README.txt`, `theme amber`, `matrix`, `bsod`
- Open a game → confirm it lazy-loads (Network tab in devtools)
- Trigger Konami → confetti
- Settings → change wallpaper → reload → persists
- Close some windows → open Recycle Bin → see them listed
- Resize browser <768px → MobileView appears

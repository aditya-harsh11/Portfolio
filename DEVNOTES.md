# DEVNOTES — Aditya's Portfolio 95

Everything we've built, every decision, every gotcha. This is the running
project log — when you come back in 6 months or a future agent picks this
up, start here.

> See `README.md` for user-facing usage. This doc is the internal log.

---

## 0. TL;DR

- **Stack:** Vite 8 + React 19 + Tailwind 3 + Zustand + react-rnd. No router.
- **Path:** `C:\Projects\Portfolio-Website-Aditya\`.
- **State on `main`:** 11 phases. Pushed to
  https://github.com/aditya-harsh11/Portfolio.git, deployed via Vercel.
- **Run:** `npm install && npm run dev` → http://localhost:5173 (or
  next free port — Vite auto-increments if something's already there).
- **Deploy:** `npm i -g vercel && vercel` (config already in `vercel.json`;
  SPA rewrite + long-cache headers for `/assets`, `/audio`, `/images`).
- **Note:** git history was rewritten via `filter-branch` to scrub a couple
  of names. Don't trust SHAs from before — commits have new hashes. Don't
  force-push to anything that's already shared.

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
│   │   ├── Confetti.jsx
│   │   ├── Clippy.jsx      Pinned bottom-right assistant; localStorage-disable
│   │   └── Login.jsx        Win95 "Welcome to AdityaOS" login gate; shows every visit
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
│   ├── InternetExplorer/   IE parody — chrome + URL bar + multi-page + dino game
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
- Clippy sayings: `src/components/Overlays/Clippy.jsx` → `SAYINGS`
- BSOD error codes: `src/components/Overlays/BSOD.jsx` → `ERRORS`
- Terminal fortunes / banner / boot: `src/windows/Terminal/Terminal.jsx`
- Login screen copy: `src/components/Overlays/Login.jsx` (title + prompt strings)
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

> Note: SHAs below are pre-rewrite. Real commit hashes changed; `git log` is
> the source of truth.

### Phase 1: MVP scaffold
Vite + React + Tailwind + Zustand + react-rnd. Desktop + draggable icons,
taskbar with start menu + clock, 5 windows (About, Projects, Contact,
Terminal, Snake). Click sounds. Initial commit.

### Phase 2: depth
Real resume in `content.js`. Fake FS generated from it. Explorer + Notepad
(double-click file → opens in Notepad). Settings window (wallpaper picker
supporting both image URLs and `color:#hex`; sound toggle/volume). Recycle
Bin window. Terminal expanded to ~25 commands with real FS-aware
`ls`/`cd`/`cat`/`tree`/`pwd` + tab completion + 6 themes + matrix/hack/bsod
effects. Overlays: BSOD, Matrix canvas rain, Konami → Confetti.

### Phase 3: personality
8 more games (Minesweeper, Tetris, G2048, Pong, Breakout, Memory, Gomoku,
LightsOut). Games hub launcher at `windows/GamesHub/` (case-distinct from
`games/` — see Gotchas). MusicPlayer Winamp-mock. DesktopPet
overlays. First-run login gate (the Login overlay — see Phase 11).
VisitorCounter — originally
localStorage-only (Claude sandbox refused the third-party fetch); now
wired to `counterapi.dev` for a global count (see Phase 10).

### Phase 4: polish
Games + MusicPlayer wrapped in `React.lazy` + Suspense — each game ships as
a 1-4 KB on-demand chunk; main bundle dropped to ~94 KB gzipped. Global
keyboard shortcuts hook. Focus rings via `:focus-visible`. `prefers-reduced-motion`
honored globally. Real SEO meta tags + SVG favicon + robots.txt. MobileView
component renders at <768px with a sessionStorage "load desktop view
anyway" escape hatch. `vercel.json` with SPA rewrite + long-cache headers.

### Test-round fixes
- JSX escape bug: literal `\u2019` / `\u2026` sequences rendering as text
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

### Polish round (now committed)

Originally an uncommitted set of tweaks. Landed in the Polish Round commit.

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

### Phase 5: Internet Explorer + dino + real photo

- **New IE window** (lazy chunk, ~33 KB JS / ~10 KB CSS). Win95 chrome:
  decorative menubar, toolbar (Back / Forward / Stop / Refresh / Home /
  Favorites / History / Print), editable address bar with Go + spinner,
  status bar, real history stack (Clear History supported).
- **Pages**: Home (marquee, hit counter sourced from `visitorCount`,
  awards, web ring), About (parody), The Wall (formerly Guestbook;
  localStorage key `ie:wall`), Cool Links (mix of parody + real GH/LI/email),
  Easter Eggs hub, AltaVista/Yahoo search, archived-site gravestone, 404.
- **URL-bar easter eggs:** `bsod.com` triggers BSOD overlay, `matrix.com`
  triggers Matrix, `chrome://dino` / `dino.com` / `about:offline` loads the
  dino game.
- **Dino game**: real chrome-dino sprite (was: hand-drawn pixel bitmap),
  varied cactus clusters (1/2/3), taller canvas so dino head stays in frame,
  tighter hitbox.
- **Real photo on About** — `/images/aditya.jpg`.
- **Desktop**: 3-column grouped layout (me / fun / system); position-storage
  key bumped to `iconPositions.v3`.
- **Removed Clippy entirely**. The duck now speaks both its own lines and
  the old Clippy site tips (~41 sayings).
- Terminal: hack sequence with progress bars; `format` / `rmrf system32`
  joke chain that ends in BSOD; help output regrouped; `education` +
  `experience` commands added.
- Recycle bin emoji uses `🗑️` (U+FE0F) for consistent color rendering.

### Phase 6: Pixel duck PNG + Request Resume + cleanup

- **Pet sprite**: `public/images/duck.png` rendered via `<img>` with
  `image-rendering: pixelated`. Replaces the inline SVG.
- **Contact window**: new "Request Resume" `mailto:` button (subject and
  body pre-filled). Lives under a separate "Resume" header in the Direct
  column.
- **MusicPlayer**: track list trimmed, version string updated.
- Terminal command list pruned.
- **Git history rewritten** (filter-branch) to scrub a couple of names and
  references. All commit SHAs changed. Don't force-push to anything that's
  shared.

### Phase 7: Cross-platform icons + deploy

- **Discovered after first Vercel deploy:** desktop icons looked completely
  different on Mac vs Windows because they were emoji codepoints rendered
  by the OS-level emoji font (Apple Color Emoji vs Segoe UI Emoji). Not a
  bug — just how emoji work. See Gotchas.
- **Fix:** added 10 real PNG icons under `public/images/icons/`
  (`my-computer`, `about-me`, `projects`, `contact`, `internet-explorer`,
  `games`, `music`, `terminal`, `recycle-bin`, `settings`). Wired through
  the existing `icon.image` field, which `DesktopIcon.jsx` already
  supported. `StartMenu.jsx` updated to render images too.
- **New optional `imageSize` field** on icon schema; per-icon override of
  the default 48px. Used to bump Games to 56px since the PNG has internal
  padding.
- **Page title** `<title>` + `og:title` + `twitter:title` changed to
  `Aditya's Portfolio` (was `Aditya Harshavardhan — Portfolio 95`).
- GitHub and LinkedIn icons unchanged (already used real images).
- Pushed to GitHub remote at `aditya-harsh11/Portfolio`.

### Phase 8: Explorer icons + BSOD copy + small polish

- **Explorer icons → real PNGs.** Tree pane uses `folder.png` (closed) and
  `filled_folder.png` (open) at 16px. Grid uses `folder.png` for dirs and
  `windows_icon.png` for `.exe` files at 32px. `.txt` / `.sys` / `.ini`
  still render as `📄` emoji (no document PNG in the project yet — drop
  one in `public/images/icons/` if a consistent cross-platform doc icon is
  wanted later). New `.tree-icon` and `.explorer-icon img` styles in
  `Explorer.css` use `image-rendering: pixelated`.
- **BSOD copy fix.** The mock previously rendered "Press any key to
  continue" twice (once in the bullet list, once as the bottom prompt).
  Replaced the duplicate bullet with the authentic Win95 line:
  "* Press CTRL+ALT+DEL again to restart your computer. You will lose any
  unsaved information in all applications."
- **Duck speech bubble timer**: 1800 ms → 2500 ms. The tips were
  disappearing before they could be read.
- **Skills:** added `Supabase` and `Vercel` to Developer Tools in
  `content.js`.

### Phase 9: Clippy returns, icon cleanup, Recycle Bin polish

- **Duck → Clippy.** Replaced `DesktopPet.jsx` (wandering pixel duck) with
  a new `Clippy.jsx` overlay pinned to the bottom-right corner
  (`right: 16px; bottom: 48px`). Doesn't move. Renders only when it has
  something to say.
  - **Lifecycle:** first appearance 5s after load (`FIRST_DELAY_MS`); after
    Dismiss, reschedules a new appearance 30–40s later (`REAPPEAR_MIN_MS` /
    `REAPPEAR_MAX_MS`).
  - **Two buttons** in the bubble: **Dismiss** (hide + schedule next) and
    **Don't show again** (persists `clippy:disabled=1` to localStorage,
    component returns `null` on every future load). To re-enable while
    testing: `localStorage.removeItem('clippy:disabled')` + reload.
  - **Sayings list** in `Clippy.jsx` → `SAYINGS`. ~44 lines, mix of classic
    Clippy openers, debugging humor, and site tips. Picks avoid repeating
    the previous saying.
  - **Caveat:** if the user never clicks Dismiss, the bubble stays with the
    same saying — rotation is dismiss-triggered, not auto.
  - Deleted `src/components/Overlays/DesktopPet.{jsx,css}` and
    `public/images/duck.png`.
- **Projects icon = folder.** `src/data/icons.js` Projects entry (desktop +
  start menu) now points to `/images/icons/folder.png` so it matches the
  folder icon used inside the Explorer grid.
- **Recycle Bin empty state** uses `/images/icons/recycle-bin.png` instead
  of the `🗑` emoji. `.recycle-empty-icon` switched from `font-size: 48px`
  to width/height 48 + `image-rendering: pixelated`.
- **Icon assets cleaned up.** Deleted unused `public/images/icons/ie.svg`
  (replaced by `internet-explorer.png` in Phase 7) and
  `public/images/icons/projects.png` (replaced by the shared folder PNG).
  Swapped in new uploaded `about-me.png` and `contact.png`.
- **Contact window width** bumped 480 → 1000 (single edit by user in
  `icons.js`).
- **DesktopPet flip bug discovery (post-mortem).** Before deletion, the
  duck's facing-direction logic looked correct (inline
  `transform: scaleX(${dir})`) but never rendered: the `.pet-glyph`
  selector had a CSS keyframe animation animating `transform: translateY`,
  which won over the inline style for the `transform` property. Lesson for
  next time: **don't put a CSS keyframe animation that touches `transform`
  on the same element that needs an inline `transform` for a different
  axis.** Wrap with a separate element so they animate independent
  properties. Moot now that Clippy is static, but flagged for any future
  animated overlay.

### Phase 10: Global visitor counter

- **VisitorCounter wired to counterapi.dev.** First load per browser
  session calls `GET https://api.counterapi.dev/v1/aditya-portfolio/visits/up`
  (increment + return); subsequent reloads in the same tab call the bare
  endpoint (read-only). De-dupe is via a `sessionStorage` flag
  (`visitCounted`), so refreshes/navigation within the same tab don't
  re-increment, but a new tab/browser does. Last successful count cached to
  `localStorage` (`visitorCount`) so the taskbar shows the last known value
  if the API is unreachable instead of dashes. Endpoint constant lives at
  the top of `VisitorCounter.jsx` — change `aditya-portfolio/visits` to
  rename or reset. **Note:** the live code uses the **v1** API path, not v2
  (an earlier draft of this note said v2 — the code is the source of truth).
- **First authorized third-party fetch** in the project. Default
  no-external-API policy still stands; updated the Sandbox gotcha to note
  this is the lone exception.
- **Caveat:** trivially gameable (clear sessionStorage + refresh ad
  infinitum). It's a hit counter, not analytics. Upgrade path if real
  numbers matter: Vercel KV with an IP+UA hash.
- Tooltip changed "Local visit count (this browser)" → "Global visit
  count".

### Phase 10b: README cleanup

- Removed the "Keyboard shortcuts" section from README. It was minimal
  (just Esc + Konami) and duplicated information the user discovers
  organically.

### Phase 10c: IE Easter Eggs page cleanup

- **Removed two stale/unwanted entries** from the Easter Eggs page
  (`src/windows/InternetExplorer/pages.jsx` → `EasterEggsPage`):
  - The **rubber duck** "Click on…" line — stale since Phase 9 replaced
    the wandering duck pet with the static Clippy overlay.
  - The **Esc** line under "Keyboard" — at the user's request. The Konami
    code is now the only entry left in that section.
- Esc-closes-active-window still works (`useGlobalShortcuts`); it's just no
  longer advertised on this page.

### Phase 11: Login screen, project videos, window maximize, IE fixes

- **Login screen replaces the Install Wizard.** New `Login.jsx` overlay — a
  Win95 "Welcome to AdityaOS" dialog modeled on the classic "Welcome to
  Windows" login: the gold Windows **key icon** (`public/images/icons/login-key.png`,
  cropped from the reference), a prompt, empty User name + Password fields,
  and a single **OK** button (Cancel removed). `?` / `×` title-bar buttons.
  - **Shows on every visit** — `useState(true)`, no localStorage gate (unlike
    the old wizard, which persisted once-installed).
  - Any input logs you in. OK, the `×` button, Enter, and Esc all dismiss it
    (the classic Win95 Cancel/Esc bypass).
  - **Removed:** `InstallWizard.{jsx,css}`, the Start-menu "Run Setup Again"
    entry + its `runInstallWizard` event, and the IE Easter-Eggs wizard line
    (now advertises the login + its bypass instead).
- **Projects: embedded demo videos.** New `video` field on a project renders an
  inline player below the tech chips. `toEmbed()` in `Projects.jsx` auto-detects
  YouTube / Loom / Vimeo / Google Drive / direct `.mp4` and converts to an
  embeddable URL — paste any share link. ArcFlow, Unsilenced, Phanta have
  videos. Also added an optional `image` field (screenshot) and `links` array
  (extra labeled links), both conditional/unused right now.
- **About: clickable experience orgs.** New optional `url` on an experience
  entry turns the org name into a link (Wisconsin Autonomous → wa.wisc.edu,
  WAISI → waisi.org, Biokind → biokind.org). `.about-org-link` style.
- **Window maximize/restore.** Third title-bar button (□ / ❐) between minimize
  and close, on resizable windows only. `toggleMaximize` in the store fills the
  desktop (viewport minus the 32px taskbar) and stashes `prevRect` to restore.
  Double-clicking the title bar toggles it; drag + resize are locked while
  maximized. (Edge case: a maximized window doesn't re-fit on browser resize.)
- **IE fixes.** The "Favorite snake: the one in Games" link on the IE About
  page now calls `openWindow` to launch the real Games window (was bouncing to
  the IE homepage). Tripod web-ring URLs now route to the archived gravestone
  page instead of a generic 404.

---

## 4. Gotchas

### Emoji = OS-rendered, not portable

Emoji codepoints render via the visitor's OS emoji font (Apple Color Emoji
on Mac, Segoe UI Emoji on Windows, Noto Color Emoji on Linux/Android). Same
codepoint can look dramatically different across platforms — `🖥️` is a
sleek silver iMac on Mac but a chunky beige monitor on Windows. **Rule:**
if you need a consistent visual (especially for the desktop chrome which
is the whole point of the site), use real PNG/SVG assets via the
`icon.image` field, not emoji. Title bars and the taskbar still use the
`emoji` string today; not visible enough to matter yet but flag it if
visitors complain.

### Windows folder case-insensitivity → `GamesHub/` vs `games/`
Windows treats `Games/` and `games/` as the same path. We initially put the
launcher at `src/windows/Games/Games.jsx` and it merged into the existing
`games/` folder containing individual game implementations. The launcher
now lives at `src/windows/GamesHub/Games.jsx`. **Rule:** never name two
sibling folders that differ only by case — Linux (Vercel) treats them as
distinct but Windows merges them.

### Sandbox blocks third-party fetches
When we first tried to wire the visitor counter to `api.counterapi.dev`,
the sandbox refused the edit because it adds an unauthorized external
endpoint. **Default policy still stands:** no third-party API calls
without explicit user authorization. The visitor counter was eventually
authorized in Phase 10 — that's the only outbound endpoint in the
project. Anything else needs the same explicit OK before being added.

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

### CSS keyframe `transform` silently overrides inline `transform`
The duck was supposed to flip via `<div style={{ transform: 'scaleX(-1)' }}>`,
but it never did — its parent had `animation: pet-bob` whose keyframes set
`transform: translateY(...)`. Same property name, so the animation won and
the inline style was discarded. The two transforms didn't compose. **Fix
pattern:** put the animated transform on a wrapper element and the inline
transform on a child element so they animate independent properties on
separate nodes. Hit this if you ever add a bobbing/floating animated
overlay that also needs to flip or scale.

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
- **Login screen**: single OK button, no autofill, shows on every visit.
- **Cursor**: old-Windows style (white arrow + hand SVGs) globally.
- **Icon look**: 2-column layout, ~48px glyphs. Real images for GitHub
  (animated gif) and LinkedIn.
- **Don't commit speculatively.** User explicitly wants to test before
  committing. Only commit when user says "commit" or "ship it".

---

## 6. Open follow-ups

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
| Clippy sayings + show/dismiss timing | `src/components/Overlays/Clippy.jsx` |
| BSOD error codes | `src/components/Overlays/BSOD.jsx` → `ERRORS` |
| Login screen copy / behavior | `src/components/Overlays/Login.jsx` |
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

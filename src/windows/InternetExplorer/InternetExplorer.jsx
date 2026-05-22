import { useEffect, useRef, useState } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import {
  HomePage,
  AboutPage,
  WallPage,
  LinksPage,
  SearchPage,
  ArchivedPage,
  NotFoundPage,
  EasterEggsPage,
} from './pages';
import { DinoGame } from './DinoGame';
import './InternetExplorer.css';

const HOME_URL = 'http://www.aditya.com/';

function resolve(raw) {
  const original = raw.trim();
  let url = original.toLowerCase();
  url = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const noSlash = url.replace(/\/+$/, '');

  if (noSlash === 'bsod.com' || noSlash.endsWith('/bsod')) {
    return { kind: 'trigger', what: 'bsod' };
  }
  if (noSlash === 'matrix.com' || noSlash === 'thematrix.com') {
    return { kind: 'trigger', what: 'matrix' };
  }
  if (
    noSlash === 'chrome://dino' ||
    noSlash === 'about:offline' ||
    noSlash === 'dino.com' ||
    noSlash === 'dinosaur.com'
  ) {
    return { kind: 'page', component: 'dino', displayUrl: 'chrome://dino' };
  }

  if (noSlash === 'aditya.com' || noSlash === 'aditya.com/index.html') {
    return { kind: 'page', component: 'home', displayUrl: HOME_URL };
  }
  if (noSlash === 'aditya.com/home' || noSlash === 'aditya.com/home.html') {
    return { kind: 'page', component: 'home', displayUrl: HOME_URL };
  }
  if (noSlash === 'aditya.com/about' || noSlash === 'aditya.com/about.html') {
    return { kind: 'page', component: 'about', displayUrl: 'http://www.aditya.com/about.html' };
  }
  if (
    noSlash === 'aditya.com/wall' ||
    noSlash === 'aditya.com/wall.html' ||
    noSlash === 'aditya.com/guestbook' ||
    noSlash === 'aditya.com/guestbook.html'
  ) {
    return { kind: 'page', component: 'wall', displayUrl: 'http://www.aditya.com/wall.html' };
  }
  if (noSlash === 'aditya.com/links' || noSlash === 'aditya.com/links.html') {
    return { kind: 'page', component: 'links', displayUrl: 'http://www.aditya.com/links.html' };
  }
  if (
    noSlash === 'aditya.com/easter-eggs' ||
    noSlash === 'aditya.com/easter-eggs.html' ||
    noSlash === 'aditya.com/eggs' ||
    noSlash === 'aditya.com/secrets'
  ) {
    return { kind: 'page', component: 'easter-eggs', displayUrl: 'http://www.aditya.com/easter-eggs.html' };
  }

  if (noSlash.startsWith('google.com') || noSlash.startsWith('altavista.com')) {
    return { kind: 'page', component: 'search', host: 'altavista', displayUrl: 'http://www.altavista.com/' };
  }
  if (noSlash.startsWith('yahoo.com')) {
    return { kind: 'page', component: 'search', host: 'yahoo', displayUrl: 'http://www.yahoo.com/' };
  }

  if (
    noSlash.startsWith('geocities.com') ||
    noSlash.startsWith('myspace.com') ||
    noSlash.startsWith('angelfire.com') ||
    noSlash.startsWith('tripod.com')
  ) {
    const display = original.startsWith('http') ? original : `http://www.${original}`;
    return { kind: 'page', component: 'archived', displayUrl: display };
  }

  const display = original.startsWith('http') ? original : `http://${original}`;
  return { kind: 'page', component: 'notfound', displayUrl: display };
}

const FAVORITES = [
  { url: 'http://www.aditya.com/', label: 'Aditya — Home' },
  { url: 'http://www.aditya.com/about.html', label: 'Aditya — About Me' },
  { url: 'http://www.aditya.com/wall.html', label: 'Aditya — The Wall' },
  { url: 'http://www.aditya.com/links.html', label: 'Aditya — Cool Links' },
  { url: 'http://www.aditya.com/easter-eggs.html', label: 'Aditya — Easter Eggs' },
  { url: 'http://www.altavista.com/', label: 'AltaVista Search' },
  { url: 'http://www.yahoo.com/', label: 'Yahoo!' },
  { url: 'chrome://dino', label: 'Offline — Dino' },
];

const POPUP_TEXTS = [
  'CONGRATULATIONS! You are the 1,000,000th visitor!\nClick HERE to claim your free iPod!',
  '⚠ WARNING: Your computer may be infected with 47 viruses.\nDownload NORTON_ANTIVIRUS_FREE.exe now!',
  '💰 Make $5000/week from HOME doing this ONE WEIRD TRICK!',
];

function PopupAd({ text, onClose }) {
  return (
    <div className="ie-popup">
      <div className="ie-popup-bar win95-titlebar">
        <span>Microsoft Internet Explorer</span>
        <button className="win95-titlebar-button" onClick={onClose}>×</button>
      </div>
      <div className="ie-popup-body">
        <div className="ie-popup-icon">⚠</div>
        <div className="ie-popup-text">
          {text.split('\n').map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
      <div className="ie-popup-buttons">
        <button className="win95-button" onClick={onClose}>OK</button>
        <button className="win95-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export function InternetExplorer() {
  const triggerBSOD = useDesktopStore((s) => s.triggerBSOD);
  const triggerMatrix = useDesktopStore((s) => s.triggerMatrix);

  const initial = resolve(HOME_URL);
  const [stack, setStack] = useState([initial]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState(HOME_URL);
  const [loading, setLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [status, setStatus] = useState('Done');
  const [hoverUrl, setHoverUrl] = useState(null);
  const [favOpen, setFavOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const [popup, setPopup] = useState(null);
  const popupSeenRef = useRef(0);

  const current = stack[idx];

  useEffect(() => {
    const t = setTimeout(() => {
      if (popupSeenRef.current === 0) {
        popupSeenRef.current = 1;
        setPopup(POPUP_TEXTS[Math.floor(Math.random() * POPUP_TEXTS.length)]);
      }
    }, 12000);
    return () => clearTimeout(t);
  }, []);

  const go = async (raw) => {
    const result = resolve(raw);
    if (result.kind === 'trigger') {
      if (result.what === 'bsod') {
        setStatus('Connection terminated unexpectedly');
        setTimeout(triggerBSOD, 250);
      } else if (result.what === 'matrix') {
        triggerMatrix();
      }
      return;
    }
    setLoading(true);
    setStatus(`Connecting to ${result.displayUrl}…`);
    await new Promise((r) => setTimeout(r, 380));
    const nextStack = [...stack.slice(0, idx + 1), result];
    setStack(nextStack);
    setIdx(nextStack.length - 1);
    setInput(result.displayUrl);
    setLoading(false);
    setStatus('Done');
  };

  const back = () => {
    if (idx <= 0) return;
    setIdx(idx - 1);
    setInput(stack[idx - 1].displayUrl);
  };
  const forward = () => {
    if (idx >= stack.length - 1) return;
    setIdx(idx + 1);
    setInput(stack[idx + 1].displayUrl);
  };
  const home = () => go(HOME_URL);
  const stop = () => {
    setLoading(false);
    setStatus('Stopped. Offline?');
    go('chrome://dino');
  };
  const refresh = () => {
    setLoading(true);
    setStatus(`Refreshing ${current.displayUrl}…`);
    setTimeout(() => {
      setRenderKey((k) => k + 1);
      setLoading(false);
      setStatus('Done');
    }, 380);
  };
  const clearHistory = () => {
    setStack([current]);
    setIdx(0);
    setHistOpen(false);
    setStatus('History cleared.');
  };

  const onUrlKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      go(input);
    }
  };

  const Page = (() => {
    switch (current.component) {
      case 'home': return <HomePage navigate={go} />;
      case 'about': return <AboutPage navigate={go} />;
      case 'wall': return <WallPage navigate={go} />;
      case 'links': return <LinksPage navigate={go} />;
      case 'easter-eggs': return <EasterEggsPage navigate={go} />;
      case 'search': return <SearchPage navigate={go} host={current.host} />;
      case 'archived': return <ArchivedPage url={current.displayUrl} />;
      case 'dino': return <DinoGame />;
      case 'notfound':
      default: return <NotFoundPage url={current.displayUrl} />;
    }
  })();

  return (
    <div className="ie-window" onClick={() => { setFavOpen(false); setHistOpen(false); }}>
      <div className="ie-menubar">
        <span className="ie-menu"><u>F</u>ile</span>
        <span className="ie-menu"><u>E</u>dit</span>
        <span className="ie-menu"><u>V</u>iew</span>
        <span className="ie-menu"><u>G</u>o</span>
        <span className="ie-menu">F<u>a</u>vorites</span>
        <span className="ie-menu"><u>H</u>elp</span>
      </div>

      <div className="ie-toolbar">
        <ToolButton label="Back" icon="◀" disabled={idx === 0} onClick={back} />
        <ToolButton label="Forward" icon="▶" disabled={idx >= stack.length - 1} onClick={forward} />
        <ToolButton label="Stop" icon="✕" onClick={stop} />
        <ToolButton label="Refresh" icon="↻" onClick={refresh} />
        <ToolButton label="Home" icon="🏠" onClick={home} />
        <div className="ie-tool-sep" />
        <ToolButton
          label="Favorites"
          icon="★"
          onClick={(e) => { e.stopPropagation(); setFavOpen((v) => !v); setHistOpen(false); }}
        />
        <ToolButton
          label="History"
          icon="🕓"
          onClick={(e) => { e.stopPropagation(); setHistOpen((v) => !v); setFavOpen(false); }}
        />
        <ToolButton
          label="Print"
          icon="🖨"
          onClick={() => { setStatus('Printer not found. Did you mean: write it down?'); }}
        />
      </div>

      <div className="ie-addressbar">
        <span className="ie-addr-label">Address</span>
        <div className="ie-addr-input win95-inset-thin">
          <span className="ie-addr-icon">📄</span>
          <input
            className="ie-url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onUrlKey}
            spellCheck="false"
            autoComplete="off"
          />
        </div>
        <button className="win95-button ie-go-btn" onClick={() => go(input)}>
          {loading ? <span className="ie-spin">↻</span> : '→'} Go
        </button>
      </div>

      {favOpen ? (
        <div className="ie-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="ie-dropdown-title">Favorites</div>
          {FAVORITES.map((f) => (
            <button key={f.url} className="ie-dropdown-item" onClick={() => { setFavOpen(false); go(f.url); }}>
              ★ {f.label}
            </button>
          ))}
        </div>
      ) : null}

      {histOpen ? (
        <div className="ie-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="ie-dropdown-title">History</div>
          {stack.length <= 1 ? (
            <div className="ie-dropdown-empty">No history.</div>
          ) : (
            stack
              .slice()
              .reverse()
              .slice(0, 10)
              .map((s, i) => (
                <button
                  key={i}
                  className="ie-dropdown-item"
                  onClick={() => { setHistOpen(false); go(s.displayUrl); }}
                >
                  🕓 {s.displayUrl}
                </button>
              ))
          )}
          <button
            className="ie-dropdown-item ie-dropdown-clear"
            onClick={clearHistory}
            disabled={stack.length <= 1}
          >
            Clear History
          </button>
        </div>
      ) : null}

      <div className="ie-content" key={renderKey}>
        {loading ? (
          <div className="ie-loading">
            <div className="ie-loading-spinner">↻</div>
            <div>Connecting to {current.displayUrl}…</div>
            <div className="ie-loading-sub">Looking up host. Please wait.</div>
          </div>
        ) : (
          Page
        )}
      </div>

      <div className="ie-statusbar">
        <div className="ie-status-cell ie-status-main">
          {hoverUrl ?? status}
        </div>
        <div className="ie-status-cell">{loading ? '⏳' : '✓'}</div>
        <div className="ie-status-cell">🌐 Internet zone</div>
      </div>

      {popup ? <PopupAd text={popup} onClose={() => setPopup(null)} /> : null}
    </div>
  );
}

function ToolButton({ label, icon, onClick, disabled }) {
  return (
    <button className="ie-tool-btn" onClick={onClick} disabled={disabled} title={label}>
      <span className="ie-tool-icon">{icon}</span>
      <span className="ie-tool-label">{label}</span>
    </button>
  );
}

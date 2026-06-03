import { useEffect, useState } from 'react';
import { profile, projects, contact } from '../../data/content';
import { gmailCompose, introBody } from '../../utils/mail';
import { useDesktopStore } from '../../store/useDesktopStore';

function siteVisitors() {
  try {
    return Number(localStorage.getItem('visitorCount')) || 0;
  } catch {
    return 0;
  }
}

const WEBRING_PREV = 'http://www.geocities.com/cs_students/randomStudent123/';
const WEBRING_NEXT = 'http://www.angelfire.com/cs/randomStudent456/';
const WEBRING_RANDOM = [
  'http://www.geocities.com/cs_students/user9182/',
  'http://www.angelfire.com/cs/hgh63j/',
  'http://www.tripod.com/users/personXX/',
  'http://www.myspace.com/coder_42/',
  'http://www.altavista.com/',
  'http://www.yahoo.com/',
  'chrome://dino',
  'http://www.bsod.com/',
  'http://www.aditya.com/about.html',
];
const pickRandom = () =>
  WEBRING_RANDOM[Math.floor(Math.random() * WEBRING_RANDOM.length)];

export function HomePage({ navigate }) {
  const [hits] = useState(() => siteVisitors());

  return (
    <div className="ie-page ie-home">
      <div className="ie-rainbow">WELCOME TO ADITYA'S HOMEPAGE!</div>
      <div className="ie-marquee">
        <span>
          • This page is best viewed in Internet Explorer 4.0 at 800x600 •
          Last updated December 1997 • Post on my wall! • Hire Aditya
        </span>
      </div>

      <p className="ie-p">
        <em>Hi!</em> You found my little corner of the Information Superhighway!
        This page is all about <strong>ME</strong> — please look around and don't
        forget to <a className="ie-a" onClick={() => navigate('http://www.aditya.com/wall.html')}>post on my wall</a>!
      </p>

      <div className="ie-row">
        <div className="ie-counter">
          <span className="ie-counter-label">visitors</span>
          <span className="ie-counter-num">{String(hits).padStart(7, '0')}</span>
        </div>
        <div className="ie-construction">
          🚧 <span className="ie-blink">UNDER CONSTRUCTION</span> 🚧
        </div>
      </div>

      <hr className="ie-hr" />

      <h2 className="ie-h2">Navigate my site!</h2>
      <ul className="ie-nav-list">
        <li><a className="ie-a" onClick={() => navigate('http://www.aditya.com/about.html')}>About Me</a> — who I am, what I do, ...</li>
        <li><a className="ie-a" onClick={() => navigate('http://www.aditya.com/wall.html')}>The Wall</a> — leave a message for posterity!</li>
        <li><a className="ie-a" onClick={() => navigate('http://www.aditya.com/links.html')}>My Cool Links</a> — websites I think are NEAT</li>
        <li><a className="ie-a" onClick={() => navigate('http://www.aditya.com/easter-eggs.html')}>Easter Eggs</a> — every secret on this site</li>
      </ul>

      <hr className="ie-hr" />

      <div className="ie-webring">
        <div className="ie-webring-title">The CS Students Web Ring</div>
        <div className="ie-webring-buttons">
          <button className="ie-pill" onClick={() => navigate(WEBRING_PREV)}>« Prev</button>
          <button className="ie-pill" onClick={() => navigate(pickRandom())}>Random</button>
          <button className="ie-pill" onClick={() => navigate(WEBRING_NEXT)}>Next »</button>
        </div>
      </div>

      <hr className="ie-hr" />

      <div className="ie-awards">
        <div className="ie-award">COOL SITE OF THE DAY</div>
        <div className="ie-award ie-award-2">NETSCAPE NOW✦</div>
        <div className="ie-award ie-award-3">★ TOP 0.001% OF THE WEB</div>
        <div className="ie-award">SURF SAFE</div>
        <div className="ie-award ie-award-2">WEB GEM 1997</div>
      </div>

      <p className="ie-best-viewed">
        This page best viewed in IE 4.0 at 800x600<br />
        © 1997 Aditya. Made with Microsoft FrontPage 98.<br />
        no copyright infringement intended
      </p>
    </div>
  );
}

export function AboutPage() {
  const openWindow = useDesktopStore((s) => s.openWindow);
  const openGames = () =>
    openWindow({
      component: 'Games',
      title: 'Games',
      icon: '🎮',
      width: 620,
      height: 440,
      singleton: true,
    });
  return (
    <div className="ie-page ie-about">
      <div className="ie-rainbow">ABOUT ME</div>

      <table className="ie-tbl">
        <tbody>
          <tr><td>Name:</td><td>{profile.name}</td></tr>
          <tr><td>Age:</td><td>old enough to know better, young enough to push to main on Friday (19)</td></tr>
          <tr><td>Location:</td><td>Madison, WI (snow capital of the Big Ten)</td></tr>
          <tr><td>School:</td><td>{profile.school}</td></tr>
          <tr><td>GPA:</td><td>{profile.gpa} (I will not stop bringing this up)</td></tr>
          <tr><td>Mood:</td><td>Building stuff</td></tr>
        </tbody>
      </table>

      <h2 className="ie-h2">Currently listening to</h2>
      <div className="ie-winamp">
        <strong>Update</strong> by Update — 03:24 / 04:21
      </div>

      <h2 className="ie-h2">Favorite...</h2>
      <ul className="ie-nav-list">
        <li>Favorite movie: Shutter Island</li>
        <li>Favorite team: <strong>Lakers</strong> (sorry, not sorry)</li>
        <li>Favorite language: probably python</li>
        <li>Favorite drink: caffeine in any legal form</li>
        <li>Favorite snake: the one in <a className="ie-a" onClick={openGames}>Games</a></li>
      </ul>

      <h2 className="ie-h2">Slightly real bio</h2>
      {profile.bio.map((p, i) => (
        <p key={i} className="ie-p">{p}</p>
      ))}

      <hr className="ie-hr" />
      <p className="ie-best-viewed">
        wanna talk? email me at <a className="ie-a" href={gmailCompose('Hello Aditya', introBody)} target="_blank" rel="noreferrer">{contact.email}</a><br />
        no spam pls
      </p>
    </div>
  );
}

const SEED_ENTRIES = [
  { name: 'Bill Gates', date: '1997-08-04', message: 'Cool page! Have you considered MS Office?' },
  { name: 'a recruiter', date: '2026-03-14', message: 'Aditya, please respond to my LinkedIn message.' },
  { name: 'your future self', date: '2031-01-01', message: 'still keeping this site up. iconic move tbh.' },
  { name: 'the helper', date: '1998-02-22', message: 'It looks like you\'re browsing a portfolio. Would you like help?' },
];

export function WallPage({ navigate }) {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ie:wall') || 'null');
      return stored ?? SEED_ENTRIES;
    } catch {
      return SEED_ENTRIES;
    }
  });
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    const next = [
      { name: name.trim(), date: new Date().toISOString().slice(0, 10), message: msg.trim() },
      ...entries,
    ].slice(0, 50);
    setEntries(next);
    localStorage.setItem('ie:wall', JSON.stringify(next));
    setName('');
    setMsg('');
  };

  return (
    <div className="ie-page ie-guestbook">
      <div className="ie-rainbow">THE WALL</div>
      <p className="ie-p">
        Welcome to the wall! Drop a note — your kind words keep this website alive.
      </p>

      <form className="ie-gb-form" onSubmit={submit}>
        <label>
          Your name: <input className="ie-input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Your message:
          <textarea className="ie-textarea" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} />
        </label>
        <button className="ie-pill" type="submit">Post</button>
      </form>

      <hr className="ie-hr" />
      <h2 className="ie-h2">Posts ({entries.length})</h2>

      {entries.map((e, i) => (
        <div key={i} className="ie-gb-entry">
          <div className="ie-gb-meta">
            <strong>{e.name}</strong> • <span>{e.date}</span>
          </div>
          <div className="ie-gb-msg">{e.message}</div>
        </div>
      ))}

      <hr className="ie-hr" />
      <p className="ie-best-viewed">
        <a className="ie-a" onClick={() => navigate('http://www.aditya.com/')}>« back to home</a>
      </p>
    </div>
  );
}

export function LinksPage({ navigate }) {
  return (
    <div className="ie-page ie-links">
      <div className="ie-rainbow">MY COOL LINKS</div>
      <p className="ie-p">A curated list of sites I think are NEAT. Updated semi-yearly.</p>

      <h2 className="ie-h2">Around the web</h2>
      <ul className="ie-nav-list">
        <li><a className="ie-a" onClick={() => navigate('http://www.altavista.com/')}>AltaVista</a> — the search engine!</li>
        <li><a className="ie-a" onClick={() => navigate('http://www.yahoo.com/')}>Yahoo!</a> — the directory of THE INTERNET</li>
        <li><a className="ie-a" onClick={() => navigate('http://www.geocities.com/aditya/')}>my GeoCities</a> — currently archived (RIP)</li>
        <li><a className="ie-a" onClick={() => navigate('http://www.myspace.com/aditya/')}>MySpace</a> — Tom is my friend</li>
        <li><a className="ie-a" onClick={() => navigate('chrome://dino')}>The Dino Game</a> — when offline</li>
      </ul>

      <h2 className="ie-h2">Find me (for real)</h2>
      <ul className="ie-nav-list">
        <li><a className="ie-a" href="https://github.com/aditya-harsh11" target="_blank" rel="noreferrer">GitHub</a> — my actual code</li>
        <li><a className="ie-a" href="https://linkedin.com/in/aditya-harshavardhan11" target="_blank" rel="noreferrer">LinkedIn</a> — for the recruiters</li>
        <li><a className="ie-a" href={gmailCompose('Hello Aditya', introBody)} target="_blank" rel="noreferrer">Email</a> — {contact.email}</li>
      </ul>

      <h2 className="ie-h2">Web Ring</h2>
      <div className="ie-webring">
        <div className="ie-webring-title">The CS Students Web Ring</div>
        <div className="ie-webring-buttons">
          <button className="ie-pill" onClick={() => navigate(WEBRING_PREV)}>« Prev</button>
          <button className="ie-pill" onClick={() => navigate(pickRandom())}>Random</button>
          <button className="ie-pill" onClick={() => navigate(WEBRING_NEXT)}>Next »</button>
        </div>
      </div>

      <hr className="ie-hr" />

      <h2 className="ie-h2">Awards this site has won</h2>
      <div className="ie-awards">
        <div className="ie-award">COOL SITE OF THE DAY</div>
        <div className="ie-award ie-award-2">NETSCAPE NOW✦</div>
        <div className="ie-award ie-award-3">★ TOP 0.001% OF THE WEB</div>
        <div className="ie-award">SURF SAFE</div>
        <div className="ie-award ie-award-2">WEB GEM 1997</div>
      </div>

      <hr className="ie-hr" />
      <p className="ie-best-viewed">
        <a className="ie-a" onClick={() => navigate('http://www.aditya.com/')}>« back to home</a>
      </p>
    </div>
  );
}

export function SearchPage({ navigate, host = 'altavista' }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);

  const search = (e) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    const all = [
      { title: 'Aditya Harshavardhan — homepage', url: 'http://www.aditya.com/', blurb: 'Personal homepage of Aditya. Best viewed in IE 4.0.' },
      ...projects.map((p) => ({
        title: `${p.title} — ${p.tagline}`,
        url: p.link.startsWith('http') ? p.link : 'http://www.aditya.com/projects',
        blurb: p.blurb,
      })),
      { title: 'Hire Aditya — official site', url: 'http://www.aditya.com/about.html', blurb: 'CS @ UW-Madison. 4.0 GPA. Available for summer 2026 internships.' },
      { title: 'The Dino Game', url: 'chrome://dino', blurb: 'Offline runner. Press SPACE to jump.' },
    ];
    const filtered = all.filter((r) =>
      `${r.title} ${r.blurb}`.toLowerCase().includes(term)
    );
    setResults(filtered.length ? filtered : 'none');
  };

  const isYahoo = host === 'yahoo';
  return (
    <div className="ie-page ie-search">
      <div className={isYahoo ? 'ie-yahoo-logo' : 'ie-altavista-logo'}>
        {isYahoo ? 'YAHOO!' : 'AltaVista'}
      </div>
      <div className="ie-search-tagline">
        {isYahoo ? 'a guide to the Internet' : 'the Internet, in one place.'}
      </div>

      <form className="ie-search-form" onSubmit={search}>
        <input
          className="ie-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={isYahoo ? 'search Yahoo!' : 'find on the web'}
        />
        <button className="ie-pill" type="submit">Search</button>
      </form>

      <h2 className="ie-h2">Categories</h2>
      <div className="ie-categories">
        <div><strong>Arts</strong><br />Architecture, Photography…</div>
        <div><strong>Business</strong><br />Companies, Finance…</div>
        <div><strong>Computers</strong><br />Internet, WWW, Software…</div>
        <div><strong>Education</strong><br />Universities, K-12…</div>
        <div><strong>Entertainment</strong><br />Movies, TV, Music…</div>
        <li className="ie-cat-spot">
          <strong>People</strong><br />
          <a className="ie-a" onClick={() => navigate('http://www.aditya.com/')}>Aditya Harshavardhan</a>
        </li>
      </div>

      {results === 'none' ? (
        <p className="ie-p">No matches found. Try a less specific term.</p>
      ) : results ? (
        <div className="ie-results">
          <p className="ie-p">Found {results.length} result{results.length === 1 ? '' : 's'}:</p>
          {results.map((r, i) => (
            <div key={i} className="ie-result">
              <div className="ie-result-title">
                <a className="ie-a" onClick={() => navigate(r.url)}>{r.title}</a>
              </div>
              <div className="ie-result-blurb">{r.blurb}</div>
              <div className="ie-result-url">{r.url}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ArchivedPage({ url }) {
  return (
    <div className="ie-page ie-archived">
      <div className="ie-arch-stone">⚰</div>
      <h1 className="ie-arch-title">This site has been archived</h1>
      <p className="ie-p">
        <code>{url}</code> shut down a long time ago. Its bones rest in the
        Internet Archive.
      </p>
      <p className="ie-p">
        <em>"In memoriam of every personal homepage on the dial-up web."</em>
      </p>
    </div>
  );
}

export function EasterEggsPage({ navigate }) {
  return (
    <div className="ie-page ie-easter">
      <div className="ie-rainbow">EASTER EGGS &amp; SECRETS</div>
      <p className="ie-p">
        Everything weird in this website. You can stop hunting now — or keep hunting,
        we won&apos;t tell anyone.
      </p>

      <h2 className="ie-h2">Keyboard</h2>
      <ul className="ie-nav-list">
        <li><strong>Konami code</strong> (↑ ↑ ↓ ↓ ← → ← → B A) — triggers a confetti shower</li>
      </ul>

      <h2 className="ie-h2">Terminal commands (the hidden ones)</h2>
      <ul className="ie-nav-list">
        <li><code>matrix</code> — falling green code rain</li>
        <li><code>bsod</code> — blue screen of death</li>
        <li><code>hack</code> — full hacker sequence (scanning, breaking in, progress bars)</li>
        <li><code>format</code> / <code>rmrf system32</code> — deletes SYSTEM32, crashes into BSOD</li>
        <li><code>sudo hack</code> / <code>sudo rm -rf system32</code> — Linux-style shortcuts</li>
        <li><code>neofetch</code> — system info screen</li>
        <li><code>fortune</code> — random one-liner</li>
        <li><code>theme &lt;name&gt;</code> — try amber, blue, white, red, purple</li>
      </ul>

      <h2 className="ie-h2">Internet Explorer URLs</h2>
      <p className="ie-p">Type any of these into the address bar:</p>
      <ul className="ie-nav-list">
        <li><code>bsod.com</code> — crashes the OS</li>
        <li><code>matrix.com</code> — wakes Neo</li>
        <li><code>chrome://dino</code> / <code>dino.com</code> / <code>about:offline</code> — the dino game</li>
        <li><code>geocities.com</code> / <code>myspace.com</code> / <code>angelfire.com</code> — archived gravestone</li>
        <li><code>altavista.com</code> / <code>yahoo.com</code> / <code>google.com</code> — fake search engines</li>
        <li>Anything else — 404 &quot;Cannot find server&quot;</li>
      </ul>

      <h2 className="ie-h2">Hidden files on the fake file system</h2>
      <p className="ie-p">Try <code>cat</code> on these in the Terminal:</p>
      <ul className="ie-nav-list">
        <li><code>C:\WINDOWS\SYSTEM32\definitely_not_a_virus.exe</code></li>
        <li><code>C:\WINDOWS\SYSTEM32\config.sys</code></li>
        <li><code>C:\WINDOWS\win.ini</code></li>
        <li><code>C:\GAMES\*.exe</code> — every game has a fake executable</li>
      </ul>

      <h2 className="ie-h2">Click on…</h2>
      <ul className="ie-nav-list">
        <li>The <strong>Recycle Bin</strong> — every window you&apos;ve closed is recoverable</li>
        <li>The <strong>Stop</strong> button in this browser — &quot;offline?&quot;</li>
      </ul>

      <h2 className="ie-h2">Other</h2>
      <ul className="ie-nav-list">
        <li><strong>Login screen</strong> — on first visit. Classic Win95 move: the <em>Cancel</em> button logs you in anyway.</li>
        <li><strong>Visitor counter</strong> — in the taskbar, bottom-right</li>
        <li><strong>Popup ads</strong> — show up ~12 seconds after opening this browser</li>
        <li><strong>Web ring buttons</strong> — &quot;Random&quot; might take you somewhere unexpected</li>
      </ul>

      <hr className="ie-hr" />
      <p className="ie-best-viewed">
        <a className="ie-a" onClick={() => navigate('http://www.aditya.com/')}>« back to home</a>
      </p>
    </div>
  );
}

export function NotFoundPage({ url }) {
  return (
    <div className="ie-page ie-404">
      <div className="ie-404-icon"></div>
      <h1 className="ie-404-title">Cannot find server</h1>
      <p className="ie-p">
        The page cannot be displayed. The page you are looking for is currently
        unavailable. The Web site might be experiencing technical difficulties,
        or you may need to adjust your browser settings.
      </p>
      <p className="ie-p"><strong>Please try the following:</strong></p>
      <ul className="ie-nav-list">
        <li>Click the <strong>Refresh</strong> button, or try again later.</li>
        <li>If you typed the page address, make sure it is spelled correctly.</li>
        <li>To check your connection settings, click the <strong>Tools</strong> menu,
          and then click <strong>Internet Options</strong>.</li>
      </ul>
      <p className="ie-best-viewed">
        Cannot find server or DNS Error<br />
        Internet Explorer
      </p>
      <p className="ie-p" style={{ marginTop: 14 }}>
        Requested URL: <code>{url}</code>
      </p>
    </div>
  );
}

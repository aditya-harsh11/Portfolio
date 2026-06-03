import { useEffect, useState } from 'react';
import { profile, contact, education, experience, projects, skills } from '../../data/content';
import { gmailCompose, introBody } from '../../utils/mail';
import './MobileView.css';

const BREAKPOINT = 768;
const FORCE_KEY = 'forceDesktopOnMobile';

export function MobileView() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < BREAKPOINT : false
  );
  const [forced, setForced] = useState(() => sessionStorage.getItem(FORCE_KEY) === '1');

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isMobile || forced) return null;

  const forceDesktop = () => {
    sessionStorage.setItem(FORCE_KEY, '1');
    setForced(true);
  };

  return (
    <div className="mobile-root">
      <header className="mobile-hero">
        <div className="mobile-titlebar">
          <span>👤</span>
          <span>{profile.name}</span>
        </div>
        <div className="mobile-hero-inner">
          <h1>{profile.name}</h1>
          <p className="muted">{profile.role}</p>
          <p className="muted">{profile.school}</p>
        </div>
      </header>

      <div className="mobile-warning">
        ⚠ This site is designed as a Windows 95 desktop and works best on a
        larger screen. The mobile view below has the essentials. Tap{' '}
        <button className="mobile-link" onClick={forceDesktop}>
          load desktop view anyway
        </button>
        {' '}if you want to try it.
      </div>

      <section className="mobile-section">
        <h2>About</h2>
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <ul className="mobile-tags">
          {profile.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="mobile-section">
        <h2>Education</h2>
        {education.map((ed, i) => (
          <div key={i} className="mobile-card">
            <strong>{ed.school}</strong>
            <div className="muted">{ed.degree} · {ed.dates}</div>
            <div className="muted">GPA: {ed.gpa}</div>
          </div>
        ))}
      </section>

      <section className="mobile-section">
        <h2>Experience</h2>
        {experience.map((e, i) => (
          <div key={i} className="mobile-card">
            <strong>{e.title}</strong>
            <div className="muted">{e.org} · {e.dates}</div>
            <ul>
              {e.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mobile-section">
        <h2>Projects</h2>
        {projects.map((p, i) => (
          <div key={i} className="mobile-card">
            <strong>
              <a href={p.link} target="_blank" rel="noreferrer">{p.title}</a>
            </strong>
            {p.tagline ? <div className="muted">{p.tagline}</div> : null}
            <p>{p.blurb}</p>
            <ul className="mobile-tags">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mobile-section">
        <h2>Skills</h2>
        {Object.entries(skills).map(([cat, list]) => (
          <div key={cat} className="mobile-card">
            <strong>{cat}</strong>
            <p>{list.join(' · ')}</p>
          </div>
        ))}
      </section>

      <section className="mobile-section mobile-contact">
        <h2>Contact</h2>
        <p>📧 <a href={gmailCompose('Hello Aditya', introBody)} target="_blank" rel="noreferrer">{contact.email}</a></p>
        <p>🐱 <a href={contact.github} target="_blank" rel="noreferrer">GitHub</a></p>
        <p>💼 <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>
      </section>

      <footer className="mobile-footer">
        <p className="muted">Best viewed on a desktop browser.</p>
        <button className="mobile-link" onClick={forceDesktop}>
          Try the desktop interface anyway →
        </button>
      </footer>
    </div>
  );
}

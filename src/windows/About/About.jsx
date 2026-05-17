import { profile, contact } from '../../data/content';
import './About.css';

export function About() {
  return (
    <div className="about-window win95-scrollbar">
      <header className="about-header">
        <div className="about-avatar">{profile.name[0]}</div>
        <div>
          <h1 className="about-name">{profile.name}</h1>
          <p className="about-role">{profile.role}</p>
          <p className="about-school">{profile.school}</p>
        </div>
      </header>

      <section className="about-section">
        <h2 className="about-h2">Overview</h2>
        {profile.bio.map((p, i) => (
          <p key={i} className="about-p">{p}</p>
        ))}
      </section>

      <section className="about-section">
        <h2 className="about-h2">Focus Areas</h2>
        <ul className="tag-list">
          {profile.focus.map((f) => (
            <li key={f} className="tag">{f}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-h2">Awards</h2>
        <ul className="award-list">
          {profile.awards.map((a, i) => (
            <li key={i}>★ {a}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-h2">Contact</h2>
        <p className="about-p">{profile.tagline}</p>
        <ul className="contact-mini">
          <li>📧 <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
          <li>🐱 <a href={contact.github} target="_blank" rel="noreferrer">{contact.github}</a></li>
          <li>💼 <a href={contact.linkedin} target="_blank" rel="noreferrer">{contact.linkedin}</a></li>
        </ul>
      </section>
    </div>
  );
}

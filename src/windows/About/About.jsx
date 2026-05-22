import { profile, contact, education, experience } from '../../data/content';
import './About.css';

export function About() {
  return (
    <div className="about-window win95-scrollbar">
      <header className="about-header">
        <img
          className="about-avatar"
          src="/images/aditya.jpg"
          alt={profile.name}
        />
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
        <h2 className="about-h2">Education</h2>
        {education.map((ed, i) => (
          <div key={i} className="about-edu">
            <div className="about-row">
              <strong>{ed.school}</strong>
              <span className="muted">{ed.dates}</span>
            </div>
            <div className="about-row">
              <em>{ed.degree}</em>
              <span className="muted">GPA: {ed.gpa}</span>
            </div>
            <p className="about-p">
              <strong>Coursework:</strong> {ed.coursework.join(' · ')}
            </p>
          </div>
        ))}
      </section>

      <section className="about-section">
        <h2 className="about-h2">Experience</h2>
        {experience.map((e, i) => (
          <div key={i} className="about-exp">
            <div className="about-row">
              <strong>{e.title}</strong>
              <span className="muted">{e.dates}</span>
            </div>
            <div className="about-row">
              <em>
                {e.url ? (
                  <a
                    className="about-org-link"
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {e.org}
                  </a>
                ) : (
                  e.org
                )}
              </em>
              <span className="muted">{e.location}</span>
            </div>
            <ul className="about-bullets">
              {e.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {profile.awards && profile.awards.length > 0 ? (
        <section className="about-section">
          <h2 className="about-h2">Awards</h2>
          <ul className="award-list">
            {profile.awards.map((a, i) => (
              <li key={i}>★ {a}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="about-section">
        <h2 className="about-h2">Contact</h2>
        <p className="about-p">{profile.tagline}</p>
        <ul className="contact-mini">
          <li>📧 <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
          <li>📞 {contact.phone}</li>
          <li>🐱 <a href={contact.github} target="_blank" rel="noreferrer">github.com/aditya-harsh11</a></li>
          <li>💼 <a href={contact.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/aditya-harshavardhan11</a></li>
        </ul>
      </section>
    </div>
  );
}

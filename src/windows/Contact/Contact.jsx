import { useState } from 'react';
import { contact, profile } from '../../data/content';
import { gmailCompose, introBody, resumeBody } from '../../utils/mail';
import './Contact.css';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  // No backend wired up yet. Open Gmail's web compose in a new tab with the
  // message pre-filled — works even when no desktop mail client is configured.
  const submit = (e) => {
    e.preventDefault();
    const url = gmailCompose(
      `Portfolio message from ${name}`,
      `${msg}\n\nFrom: ${name} <${email}>`,
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="contact-window win95-scrollbar">
      <h1 className="contact-h1">Contact {profile.name.split(' ')[0]}</h1>

      <div className="contact-grid">
        <div className="contact-links">
          <h2 className="contact-h2">Direct</h2>
          <ul>
            <li>📧 <a href={gmailCompose('Hello Aditya', introBody)} target="_blank" rel="noreferrer">{contact.email}</a></li>
            <li>🐱 <a href={contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li>💼 <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li>📍 {contact.location}</li>
          </ul>

          <h2 className="contact-h2" style={{ marginTop: 14 }}>Resume</h2>
          <a
            className="win95-button contact-resume-btn"
            href={gmailCompose('Resume request', resumeBody)}
            target="_blank"
            rel="noreferrer"
          >
            📄 Request Resume
          </a>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <h2 className="contact-h2">Send a message</h2>
          <label>
            <span>Your name</span>
            <input
              className="win95-inset-thin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Your email</span>
            <input
              className="win95-inset-thin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Message</span>
            <textarea
              className="win95-inset-thin"
              rows="5"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
            />
          </label>
          <div className="contact-form-actions">
            <button type="submit" className="win95-button">Send</button>
            {sent ? <span className="sent">Opening mail client…</span> : null}
          </div>
        </form>
      </div>
    </div>
  );
}

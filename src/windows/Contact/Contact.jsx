import { useState } from 'react';
import { contact, profile } from '../../data/content';
import './Contact.css';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // No backend wired up yet. Fall back to mailto so it actually does something.
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${msg}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="contact-window win95-scrollbar">
      <h1 className="contact-h1">Contact {profile.name.split(' ')[0]}</h1>

      <div className="contact-grid">
        <div className="contact-links">
          <h2 className="contact-h2">Direct</h2>
          <ul>
            <li>📧 <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li>🐱 <a href={contact.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li>💼 <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li>📍 {contact.location}</li>
          </ul>

          <h2 className="contact-h2" style={{ marginTop: 14 }}>Resume</h2>
          <a
            className="win95-button contact-resume-btn"
            href={`mailto:${contact.email}?subject=${encodeURIComponent('Resume request')}&body=${encodeURIComponent("Hi Aditya — could you send me a copy of your resume? Thanks!")}`}
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

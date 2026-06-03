import { contact } from '../data/content';

// Build a Gmail web-compose URL. Used instead of mailto: links so that contact
// actions work even when the visitor has no desktop mail client configured.
export function gmailCompose(subject = '', body = '', to = contact.email) {
  return (
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}` +
    `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  );
}

// Friendly fill-in-the-blank starter that pre-fills email links/buttons. The
// [bracketed] bits are placeholders for the visitor to swap in.
export const introBody =
  "Hi Aditya,\n\n" +
  "This is [your name] and I'm a [your role / company]. Just came across your " +
  "portfolio and wanted to reach out! Let me know when you're free to meet?\n\n" +
  "Thanks!\n[your name]";

export const resumeBody =
  "Hi Aditya,\n\n" +
  "This is [your name] and I'm a [your role / company]. Just came across your " +
  "portfolio — could you send over a copy of your resume?\n\n" +
  "Thanks!\n[your name]";

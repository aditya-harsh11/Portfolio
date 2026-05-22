import { projects, skills } from '../../data/content';
import './Projects.css';

// Turn a share/watch URL into something embeddable in an <iframe>/<video>.
// Supports YouTube, Loom, Vimeo, Google Drive, and direct video files.
function toEmbed(url) {
  if (!url) return null;
  let m;
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)))
    return { type: 'iframe', src: `https://www.youtube.com/embed/${m[1]}` };
  if ((m = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/)))
    return { type: 'iframe', src: `https://www.loom.com/embed/${m[1]}` };
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
    return { type: 'iframe', src: `https://player.vimeo.com/video/${m[1]}` };
  if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
    return { type: 'iframe', src: `https://drive.google.com/file/d/${m[1]}/preview` };
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url))
    return { type: 'video', src: url };
  return { type: 'iframe', src: url };
}

function ProjectVideo({ url }) {
  const embed = toEmbed(url);
  if (!embed) return null;
  return (
    <div className="project-video win95-inset">
      {embed.type === 'video' ? (
        <video src={embed.src} controls preload="metadata" />
      ) : (
        <iframe
          src={embed.src}
          title="Project demo"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}

export function Projects() {
  return (
    <div className="projects-window win95-scrollbar">
      <h1 className="projects-h1">Projects</h1>
      <p className="projects-intro">
        A selection of things I've built. Click a title to open the repo.
      </p>

      <ul className="project-list">
        {projects.map((p, i) => (
          <li key={i} className="project-item">
            <a
              className="project-title"
              href={p.link}
              target="_blank"
              rel="noreferrer"
            >
              {p.title}
            </a>
            {p.tagline ? <div className="project-tagline">{p.tagline}</div> : null}
            <p className="project-blurb">{p.blurb}</p>
            <ul className="project-stack">
              {p.stack.map((s) => (
                <li key={s} className="stack-chip">{s}</li>
              ))}
            </ul>
            {p.video ? <ProjectVideo url={p.video} /> : null}
            {p.image ? (
              <div className="project-shot win95-inset">
                <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" />
              </div>
            ) : null}
            {p.links && p.links.length > 0 ? (
              <div className="project-links">
                {p.links.map((l) => (
                  <a
                    key={l.url}
                    className="project-link"
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <section className="projects-skills">
        <h2 className="projects-h2">Skills</h2>
        <div className="skills-grid">
          {Object.entries(skills).map(([cat, list]) => (
            <div key={cat} className="skills-cat">
              <div className="skills-cat-name">{cat}</div>
              <ul>
                {list.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

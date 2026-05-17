import { projects, skills } from '../../data/content';
import './Projects.css';

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

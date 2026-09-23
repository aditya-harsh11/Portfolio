// Single source of truth for personal content.
// Sourced from Aditya's resume — keep this file in sync with the resume.

export const profile = {
  name: 'Aditya Harshavardhan',
  handle: 'aditya',
  gpa: '4.0 / 4.0',
  bio: [
    "Hey! I'm Aditya Harshavardhan, a sophomore at the University of Wisconsin-Madison majoring in Computer Science.",
    "I work as an AI Engineer at the Tech Exploration Lab, a Software Engineer at the Data Science Institute, and a Research Software Engineer at the Niedenthal Emotions Lab.",
    "Outside of class, I've spent a lot of time building software through hackathons. I've won MadData 26, MadHacks 25, Badger Build Fest 25, and a Claude hackathon.",
    "Most of my free time goes into building projects and strengthening my technical skills. When I'm not behind a keyboard, you can usually find me playing basketball. Go Lakers!",
  ],
  focus: ['Software Engineering', 'AI/ML Engineering', 'AI Safety'],
};

export const contact = {
  email: 'harshavardha@wisc.edu',
  github: 'https://github.com/aditya-harsh11',
  linkedin: 'https://linkedin.com/in/aditya-harsh11',
  location: 'Madison, WI',
};

export const education = [
  {
    school: 'University of Wisconsin-Madison',
    degree: 'B.S. Computer Science',
    dates: 'Sept 2025 - May 2028 (expected)',
    gpa: '4.0 / 4.0',
    coursework: [
      'Data Structures & Algorithms',
      'Big Data Systems',
      'Machine Organization and Programming',
      'AI Assisted Software Development',
      'Object-Oriented Programming',
      'Discrete Mathematics',
      'Calculus',
    ],
  },
];

export const experience = [
  {
    title: 'AI Engineer',
    org: 'Tech Exploration Lab',
    location: 'Madison, WI',
    dates: 'Sep 2026 - Present',
    bullets: [
      'Solving real-world problems through rapid experimentation with applied AI and emerging technology. Partnering with companies to test and iterate from concept to prototype.',
    ],
  },
  {
    title: 'Software Engineer',
    org: 'Data Science Institute',
    location: 'Madison, WI',
    dates: 'Jul 2026 - Present',
    bullets: [
      'Farm2Facts via Wiscurds: Integrating Mesonet weather data and building dashboard features for an open-source Ruby platform serving 100+ crop farmers across 5 states.',
    ],
  },
  {
    title: 'Research Software Engineer',
    org: 'Dept. of Psychology — Niedenthal Emotions Lab',
    location: 'Madison, WI',
    dates: 'Jun 2026 – Present',
    bullets: [
      'Built a face/voice morphing video conferencing app for synchrony research, reduced latency from 4s to real time, developed a reactive mode, added face calibration, and automated cross platform releases',
    ],
  },
  {
    title: 'Software Engineer Intern',
    org: 'Carboncopies Foundation',
    location: 'Remote',
    dates: 'Jun 2026 – Aug 2026',
    bullets: ["Optimized CarbonGPT's RAG pipeline, built an LLM-as-a-judge benchmark, and developed Google OAuth for a members-only portal."],
  },
];

export const projects = [
  {
    title: 'ArcFlow',
    tagline: '1st Place · MadData 26 (Qualcomm-sponsored)',
    blurb:
      'A drag-and-drop app for building AI pipelines on device.',
    stack: [
      'Next.js',
      'React Flow',
      'TypeScript',
      'FastAPI',
      'Python',
      'Electron',
      'ONNX',
    ],
    link: 'https://github.com/aditya-harsh11/ArcFlow',
    video: 'https://youtu.be/ZmeUEur-WIM',
  },
  {
    title: 'PlayPoker',
    tagline: 'Real-time multiplayer poker',
    blurb:
      'Self-hosted poker rooms where the server runs dealing, blinds, side pots, etc. 12+ game variants for up to 8 players.',
    stack: [
      'React',
      'Vite',
      'Tailwind',
      'TypeScript',
      'Node.js',
      'Express',
      'Socket.IO',
    ],
    link: 'https://github.com/aditya-harsh11/playpoker',
    links: [
      { label: 'Live Site', url: 'https://playpoker.onrender.com/' },
    ],
  },
  {
    title: 'Unsilenced',
    tagline: 'Fish Audio Track Winner · MadHacks 2025',
    blurb:
      'A hands-free AAC tool restoring vocal identity for non-verbal users using real-time emotion detection.',
    stack: [
      'Next.js',
      'TypeScript',
      'Flask',
      'MediaPipe',
      'Face API',
      'Fish Audio',
    ],
    link: 'https://github.com/anishsrinivasa/MadHacks',
    video: 'https://youtu.be/jfsXk_WrzzQ',
  },
  {
    title: 'Centralized Event Dashboard',
    tagline: 'Undergraduate Projects Lab',
    blurb:
      'An app that collects campus events from emails, discord, and flyers into one easy-to-use calendar.',
    stack: [
      'SvelteKit',
      'TypeScript',
      'Flask',
      'Python',
      'SQLite',
      'AWS EC2',
      'Gemini',
    ],
    link: 'https://github.com/albertw7711/Morgridge-Centralized-Event-Dashboard',
  },
  {
    title: 'This Portfolio',
    tagline: 'You are here',
    blurb:
      'A retro Windows 95-themed portfolio featuring desktop windows, a working terminal, an interactive file system, playable games, etc.',
    stack: ['React', 'Vite', 'JavaScript', 'Zustand', 'react-rnd', 'Tailwind'],
    link: 'https://github.com/aditya-harsh11/Portfolio',
    links: [{ label: 'Live Site', url: 'https://aditya-harsh.vercel.app/' }],
  },
];

export const skills = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'HTML', 'CSS'],
  'Frameworks & Libraries:': [
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'FastAPI',
    'Flask',
    'Scikit-learn',
    'NumPy',
    'Pandas',
    'Chroma DB',
  ],
  'Developer Tools': [
    'Docker',
    'GitHub Actions',
    'Git',
    'Vercel',
    'Render',
  ],
};

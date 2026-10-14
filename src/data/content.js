// Single source of truth for personal content.
// Sourced from Aditya's resume — keep this file in sync with the resume.

export const profile = {
  name: 'Aditya Harshavardhan',
  handle: 'aditya',
  gpa: '4.0 / 4.0',
  bio: [
    "Hey! I'm Aditya Harshavardhan, a sophomore at the University of Wisconsin–Madison majoring in Computer Science.",
    "I currently work across a few labs at UW–Madison, doing both research and software engineering.",
    "Outside of class, I've spent a lot of time building software at hackathons, and I've won 4 of them!",
    "Most of my free time goes into building projects and strengthening my technical skills. When I'm not behind a keyboard, you can usually find me playing basketball.",
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
    title: 'Research Intern',
    org: 'Wisconsin Center for Education Research — SimLab',
    location: 'Madison, WI',
    dates: 'Oct 2026 - Present',
    bullets: [
      
    ],
  },
  {
    title: 'AI Engineer',
    org: 'UW Tech Exploration Lab',
    location: 'Madison, WI',
    dates: 'Sep 2026 - Present',
    bullets: [
      
    ],
  },
  {
    title: 'Software Engineer',
    org: 'UW Data Science Institute',
    location: 'Madison, WI',
    dates: 'Jul 2026 - Present',
    bullets: [
      
    ],
  },
  {
    title: 'Research Assistant',
    org: 'UW Dept. of Psychology — Niedenthal Emotions Lab',
    location: 'Madison, WI',
    dates: 'Jun 2026 - Present',
    bullets: [
      'Built a face/voice morphing video conferencing app for synchrony research, reduced latency from 4s to real time, developed a reactive mode, added face calibration, and automated cross platform releases',
    ],
  },
  {
    title: 'Software Engineer Intern',
    org: 'Carboncopies Foundation',
    location: 'Remote',
    dates: 'Jun 2026 - Aug 2026',
    bullets: ["Optimized CarbonGPT's RAG pipeline, built an LLM-as-a-judge benchmark, and developed Google OAuth for a members-only portal"],
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
      'Self-hosted poker rooms where the server runs dealing, blinds, side pots, etc. 12+ game variants for up to 8 players. Got hooked on distributed systems, so it now runs on 3 servers.',
    stack: [
      'React',
      'Vite',
      'Tailwind',
      'TypeScript',
      'Express',
      'Socket.IO',
      'Redis',
      'Nginx',
      'Docker',
      'GCP',
    ],
    link: 'https://github.com/aditya-harsh11/playpoker',
    links: [
      { label: 'Live Site', url: 'http://playpoker.duckdns.org/' },
    ],
  },
  {
    title: 'Fixing the Poisoned Well',
    tagline: 'UW Madison ML + X',
    blurb:
      'Found and removed a hidden backdoor from a river-flow forecasting AI that predicted 14% fake water.',
    stack: ['Python', 'PyTorch', 'NumPy', 'SciPy', 'Pandas'],
    link: 'https://github.com/aditya-harsh11/fixing-the-poisoned-well',
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
  'Languages:': ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'SQL', 'HTML', 'CSS'],
  'Frameworks & Libraries:': [
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'FastAPI',
    'Flask',
    'Socket.IO',
  ],
  'AI/ML': [
    'PyTorch',
    'scikit-learn',
    'NumPy',
    'Pandas',
    'MediaPipe',
    'Chroma DB',
  ],
  'Developer Tools': [
    'Git',
    'Docker',
    'GitHub Actions',
    'GCP',
    'PostgreSQL',
    'SQLite',
    'Redis',
    'Vercel',
  ],
};

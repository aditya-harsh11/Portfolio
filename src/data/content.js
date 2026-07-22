// Single source of truth for personal content.
// Sourced from Aditya's resume — keep this file in sync with the resume.

export const profile = {
  name: 'Aditya Harshavardhan',
  handle: 'aditya',
  gpa: '4.0 / 4.0',
  bio: [
    "Hey! I'm Aditya Harshavardhan, a sophomore at the University of Wisconsin-Madison majoring in Computer Science.",
    'I currently work as a Software Engineer Intern at the Carboncopies Foundation and as a Research Assistant at the Niedenthal Emotions Lab.',
    "Outside of class, I've spent a lot of time building software through hackathons. I've won MadData 26, MadHacks, Badger Build Fest, and a Claude hackathon.",
    "Most of my free time goes into building projects and strengthening my technical skills. When I'm not behind a keyboard, you can usually find me playing basketball. Go Lakers!",
  ],
  focus: ['Software Engineering', 'AI/ML Engineering', 'AI Safety'],
};

export const contact = {
  email: 'harshavardha@wisc.edu',
  github: 'https://github.com/aditya-harsh11',
  linkedin: 'https://linkedin.com/in/aditya-harshavardhan11',
  location: 'Madison, WI and Bangalore, India',
};

export const education = [
  {
    school: 'University of Wisconsin-Madison',
    degree: 'B.S. Computer Science',
    dates: 'Aug 2025 - May 2028 (expected)',
    gpa: '4.0 / 4.0',
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Computer Architecture',
      'Discrete Mathematics',
      'Calculus',
    ],
  },
];

export const experience = [
  {
    title: 'Software Engineer Intern',
    org: 'Carboncopies Foundation',
    url: 'https://carboncopies.org/',
    location: 'San Fransisco, CA (Remote)',
    dates: 'June 2026 – Present',
    bullets: ["Web Dev and LLM's"],
  },
  {
    title: 'Research Assistant',
    org: 'Niedenthal Emotions Lab',
    url: 'https://www.niedenthalemotionslab.com/',
    location: 'Madison, WI',
    dates: 'June 2026 – Present',
    bullets: [
      'Built a face- and voice-morphing video conferencing app for facial/vocal synchrony research, architected manual and reactive modes, and developed an admissions-bias research simulator.',
    ],
  },
  {
    title: 'AI Safety Fellow',
    org: 'Wisconsin AI Safety Initiative',
    url: 'https://waisi.org/',
    location: 'Madison, WI',
    dates: 'Mar 2026 – May 2026',
    bullets: [
      'Completed ARENA and BlueDot based curricula amd analyzed 8+ papers on mechanistic interpretability, scalable oversight, alignment, and evals.',
    ],
  },
  {
    title: 'Perception Engineer',
    org: 'Wisconsin Autonomous',
    url: 'https://wa.wisc.edu/',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Built stop bar detection algorithm and developed BEV obstacle mapping with ego-motion-based static/dynamic classification for an autonomous vehicle.',
    ],
  },
  {
    title: 'Data Engineer',
    org: 'Biokind Analytics',
    url: 'https://www.biokind.org/',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Built data pipelines for 125,000+ records, trained machine learning models to predict youth disengagement, and analyzed 4+ years of attendance data to identify dropout patterns.',
    ],
  },
];

export const projects = [
  {
    title: 'ArcFlow',
    tagline: '1st Place · MadData 26 (Qualcomm-sponsored)',
    blurb:
      'A node-based AI pipeline editor that runs multimodal models on-device.',
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
    title: 'Unsilenced',
    tagline: '1st Place, Fish Audio Track · MadHacks 2025',
    blurb:
      'A hands-free AAC tool restoring vocal identity for non-verbal users using real-time facial emotion detection.',
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
    title: 'Anything Goes Poker',
    tagline: 'Real-time multiplayer poker',
    blurb:
      'A self-hosted poker room where a host shares a link and the server runs dealing, blinds, side pots, and 10+ game variants for up to 8 players.',
    stack: [
      'React',
      'Vite',
      'Tailwind',
      'TypeScript',
      'Node.js',
      'Express',
      'Socket.IO',
    ],
    link: 'https://github.com/aditya-harsh11/Card-Room',
    links: [
      { label: 'Live Demo', url: 'https://anything-goes-poker.onrender.com/' },
    ],
  },
  {
    title: 'Centralized Event Dashboard',
    tagline: '1,000+ student users',
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
      'A retro Windows 95-themed portfolio featuring desktop windows, a working terminal, an interactive file system, and playable games.',
    stack: ['React', 'Vite', 'JavaScript', 'Zustand', 'react-rnd', 'Tailwind'],
    link: 'https://github.com/aditya-harsh11/Portfolio',
    links: [{ label: 'Live Demo', url: 'https://aditya-bio.vercel.app/' }],
  },
  {
    title: 'Phanta',
    tagline:
      'Best Solana Implementation · Most Popular Project · Badger Build Fest 2025',
    blurb:
      'An AI-powered portfolio manager with real-time balances, risk scoring, and on-chain group management.',
    stack: [
      'React',
      'Vite',
      'Node.js',
      'Express',
      'Solana Web3.js',
      'Anchor',
      'Gemini',
    ],
    link: 'https://github.com/aditya-harsh11/Phanta',
    video: 'https://youtu.be/_5oy6BSEJhY',
  },
  {
    title: 'Vibe',
    tagline: 'Top 5 Finalist · Claude Hackathon',
    blurb:
      'A spatial social app with leaderboards, activity badges, and AI powered icebreakers and games.',
    stack: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'Claude API'],
    link: 'https://github.com/aditya-harsh11/Vibe',
  },
  {
    title: 'TrackMyBus',
    tagline: 'Built for Aditi Mallya International School',
    blurb:
      'A cross-platform bus tracking app with real-time updates across 14+ routes.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Google Maps'],
    link: 'https://github.com/aditya-harsh11/TrackMyBus',
  },
];

export const skills = {
  Languages: ['Python', 'JavaScript', 'Java', 'SQL', 'Dart', 'HTML', 'CSS'],
  'Frameworks (SWE)': [
    'React',
    'Next.js',
    'FastAPI',
    'Flask',
    'Flutter',
    'JavaFX',
    'JUnit',
  ],
  'Frameworks (AI/ML)': ['PyTorch', 'NumPy', 'Pandas', 'Matplotlib'],
  'Developer Tools': [
    'Git',
    'GitHub',
    'Docker',
    'Firebase',
    'Supabase',
    'Vercel',
  ],
};

// Single source of truth for personal content.
// Sourced from Aditya's resume — keep this file in sync with the resume.

export const profile = {
  name: 'Aditya Harshavardhan',
  handle: 'aditya',
  gpa: '4.0 / 4.0',
  bio: [
    "Hey! I'm Aditya Harshavardhan, a sophomore at the University of Wisconsin-Madison majoring in Computer Science.",
    "I currently work as a Research Assistant at UW–Madison's Data Science Institute (Farm2Facts) and the Niedenthal Emotions Lab.",
    "Outside of class, I've spent a lot of time building software through hackathons. I've won MadData 26, MadHacks, Badger Build Fest, and a Claude hackathon.",
    "Most of my free time goes into building projects and strengthening my technical skills. When I'm not behind a keyboard, you can usually find me playing basketball. Go Lakers!",
  ],
  focus: ['Software Engineering', 'AI/ML Engineering', 'AI Safety'],
};

export const contact = {
  email: 'harshavardha@wisc.edu',
  github: 'https://github.com/aditya-harsh11',
  linkedin: 'https://linkedin.com/in/aditya-harsh11',
  location: 'Madison, WI and Bangalore, India',
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
      'Linear Algebra',
      'Calculus',
    ],
  },
];

export const experience = [
  {
    title: 'Research Assistant',
    org: 'Farm2Facts',
    url: 'https://farm2facts.org/',
    location: 'Madison, WI',
    dates: 'Jul 2026 - Present',
    bullets: [
      '',
    ],
  },
  {
    title: 'Research Assistant',
    org: 'Niedenthal Emotions Lab',
    url: 'https://www.niedenthalemotionslab.com/',
    location: 'Madison, WI',
    dates: 'Jun 2026 – Present',
    bullets: [
      'Built a face/voice morphing video conferencing app for synchrony research, reduced latency from 4s to real time, developed manual and reactive modes, and automated cross platform releases',
    ],
  },
  {
    title: 'Software Engineer Intern',
    org: 'Carboncopies Foundation',
    url: 'https://carboncopies.org/',
    location: 'Remote',
    dates: 'Jun 2026 – Aug 2026',
    bullets: ["Optimized CarbonGPT's RAG pipeline, built an LLM-as-a-judge benchmark, and developed Google OAuth for a members-only portal."],
  },
  {
    title: 'AI Safety Fellow',
    org: 'Wisconsin AI Safety Initiative',
    url: 'https://waisi.org/',
    location: 'Madison, WI',
    dates: 'Mar 2026 – May 2026',
    bullets: [
      "Completed a program based on BlueDot's AI Safety Fundamentals Technical Track, covering interpretability, alignment, evals, AI control, and governance.",
    ],
  },
  {
    title: 'Perception Engineer',
    org: 'Wisconsin Autonomous',
    url: 'https://wa.wisc.edu/',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Built a stop bar detection algorithm and developed BEV obstacle mapping with ego-trajectory-based static/dynamic classification for an autonomous vehicle.',
    ],
  },
  {
    title: 'Data Engineer',
    org: 'Biokind Analytics',
    url: 'https://www.biokind.org/',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Built ETL pipelines for 125,000+ records, trained machine learning models to predict youth disengagement, and analyzed 4+ years of attendance data to identify dropout patterns.',
    ],
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
    title: 'Unsilenced',
    tagline: '1st Place, Fish Audio Track · MadHacks 2025',
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
      'A retro Windows 95-themed portfolio featuring desktop windows, a working terminal, an interactive file system, playable games, etc.',
    stack: ['React', 'Vite', 'JavaScript', 'Zustand', 'react-rnd', 'Tailwind'],
    link: 'https://github.com/aditya-harsh11/Portfolio',
    links: [{ label: 'Live Site', url: 'https://aditya-harsh.vercel.app/' }],
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

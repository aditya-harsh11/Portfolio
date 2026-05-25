// Single source of truth for personal content.
// Sourced from Aditya's resume — keep this file in sync with the resume.

export const profile = {
  name: 'Aditya Harshavardhan',
  handle: 'aditya',
  role: 'CS @ UW-Madison',
  school: 'University of Wisconsin-Madison · BS Computer Science · Expected May 2028',
  gpa: '4.0 / 4.0',
  tagline: 'Building software, AI, and whatever catches my curiosity.',
  bio: [
    "Hey! I'm Aditya Harshavardhan, a sophomore at the University of Wisconsin-Madison majoring in Computer Science.",
    "I currently work on self-driving tech as a Perception & Infrastructure Engineer with Wisconsin Autonomous. I also study AI safety as a Technical Scholar with the Wisconsin AI Safety Initiative.",
    "Outside of class, I've spent a lot of time building software through hackathons. I've won MadData 26, MadHacks, Badger Build Fest, and a Claude hackathon.",
    "Most of my free time goes into building projects and strengthening my technical skills. When I'm not behind a keyboard, you can usually find me playing basketball. Go Lakers!",
  ],
  focus: [
    'Software Engineering',
    'AI/ML Engineering',
    'AI Safety',
  ],
};

export const contact = {
  email: 'harshavardha@wisc.edu',
  phone: '(608) 209-1711',
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
    title: 'Perception & Infrastructure Engineer',
    org: 'Wisconsin Autonomous',
    url: 'https://wa.wisc.edu/',
    location: 'Madison, WI',
    dates: 'Feb 2026 – Present',
    bullets: [
      'Optimized lane segmentation for 60 fps output, built 3D stop-bar detection, Bird\'s Eye View obstacle mapping, and a UDP-based V2X simulation node for the autonomous vehicle.',
    ],
  },
  {
    title: 'Technical Scholar',
    org: 'Wisconsin AI Safety Initiative',
    url: 'https://waisi.org/',
    location: 'Madison, WI',
    dates: 'Mar 2026 – Present',
    bullets: [
      'Completing ARENA and BlueDot based curricula and analyzed 8+ papers on mechanistic interpretability, scalable oversight, alignment, and evals.',
    ],
  },
  {
    title: 'Data Engineer',
    org: 'Biokind Analytics',
    url: 'https://www.biokind.org/',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Built a 3-factor risk-score model on 92,000+ attendance records to flag high-risk subgroups for 10,000+ children for the Boys & Girls Clubs of Dane County.',
    ],
  },
];

export const projects = [
  {
    title: 'ArcFlow',
    tagline: '1st Place · MadData 26 (Qualcomm-sponsored)',
    blurb:
      'A node-based AI pipeline editor that runs multimodal models on-device.',
    stack: ['Next.js', 'React Flow', 'TypeScript', 'FastAPI', 'Python', 'Electron', 'ONNX'],
    link: 'https://github.com/aditya-harsh11/ArcFlow',
    video: 'https://youtu.be/ZmeUEur-WIM',
  },
  {
    title: 'Unsilenced',
    tagline: '1st Place, Fish Audio Track · MadHacks 2025',
    blurb:
      'A hands-free AAC tool restoring vocal identity for non-verbal users using real-time facial emotion detection.',
    stack: ['Next.js', 'TypeScript', 'Flask', 'MediaPipe', 'Face API', 'Fish Audio'],
    link: 'https://github.com/anishsrinivasa/MadHacks',
    video: 'https://youtu.be/jfsXk_WrzzQ',
  },
  {
    title: 'Centralized Event Dashboard',
    tagline: '1,000+ student users',
    blurb:
      'An app that collects campus events from emails, discord, and flyers into one easy-to-use calendar.',
    stack: ['SvelteKit', 'TypeScript', 'Flask', 'Python', 'SQLite', 'AWS EC2', 'Gemini'],
    link: 'https://github.com/albertw7711/Morgridge-Centralized-Event-Dashboard',
  },
  {
    title: 'Anything Goes Poker',
    tagline: 'Real-time multiplayer poker',
    blurb:
      'A self-hosted poker room where a host shares a link and the server runs dealing, blinds, side pots, and 10+ game variants for up to 8 players.',
    stack: ['React', 'Vite', 'Tailwind', 'TypeScript', 'Node.js', 'Express', 'Socket.IO'],
    link: 'https://github.com/aditya-harsh11/Card-Room',
    links: [{ label: 'Live Demo', url: 'https://anything-goes-poker.onrender.com/' }],
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
    tagline: 'Best Solana Implementation · Most Popular Project · Badger Build Fest 2025',
    blurb:
      'An AI-powered portfolio manager with real-time balances, risk scoring, and on-chain group management.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'Solana Web3.js', 'Anchor', 'Gemini'],
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
  'Frameworks (SWE)': ['React', 'Next.js', 'FastAPI', 'Flask', 'Flutter', 'JavaFX', 'JUnit'],
  'Frameworks (AI/ML)': ['PyTorch', 'NumPy', 'Pandas', 'Matplotlib'],
  'Developer Tools': ['Git', 'GitHub', 'Docker', 'Firebase', 'Supabase', 'Vercel'],
};

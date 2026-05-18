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
    "Hey, I'm Aditya Harshavardhan. I'm a sophomore at the University of Wisconsin-Madison majoring in Computer Science",
    "I currently work on self-driving tech as a Perception & Infrastructure Engineer for Wisconsin Autonomous. I also study AI safety as a Technical Scholar with the Wisconsin AI Safety Initiative",
    "Outside of class, I've spent a lot of time building software at hackathons. I've won at MadData 26 (sponsored by Qualcomm), MadHacks (the Midwest's largest collegiate hackathon), Badger Build Fest (my very first hackathon), and Claude hackathon",
    "I spend most of my free time building stuff, strengthening my technical skills, and going through the ARENA curriculum. When I'm not at a keyboard, you can usually find me playing basketball. Go Lakers!",
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
    location: 'Madison, WI',
    dates: 'Feb 2026 – Present',
    bullets: [
      'Optimized lane segmentation for 60 fps output, built 3D stop-bar detection',
      'and, Bird\'s Eye View obstacle mapping, and a UDP-based V2X simulation node for the autonomous vehicle stack.',
    ],
  },
  {
    title: 'Technical Scholar',
    org: 'Wisconsin AI Safety Initiative',
    location: 'Madison, WI',
    dates: 'Mar 2026 – Present',
    bullets: [
      'Completing ARENA and BlueDot curricula and analyzed 8+ papers on mechanistic',
      'interpretability, scalable oversight, alignment, and evals.',
    ],
  },
  {
    title: 'Data Engineer',
    org: 'Biokind Analytics',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Built a 3-factor risk-score model on 92,000+ attendance records to',
      'flag high-risk subgroups for 10,000+ children for the Boys & Girls Clubs of Dane County.',
    ],
  },
];

export const projects = [
  {
    title: 'ArcFlow',
    tagline: '1st Place · MadData 26 (Qualcomm-sponsored)',
    blurb:
      'A node-based AI pipeline editor that runs multimodal models on-device.',
    stack: ['Next.js', 'React Flow', 'FastAPI', 'Python', 'Electron', 'ONNX', 'Nexa SDK'],
    link: 'https://github.com/aditya-harsh11/ArcFlow',
  },
  {
    title: 'Unsilenced',
    tagline: '1st Place, Fish Audio Track · MadHacks 2025',
    blurb:
      'A hands-free AAC tool restoring vocal identity for non-verbal users using real-time facial emotion detection.',
    stack: ['Next.js', 'Flask', 'TypeScript', 'MediaPipe', 'Face API', 'Fish Audio'],
    link: 'https://github.com/anishsrinivasa/MadHacks',
  },
  {
    title: 'Centralized Event Dashboard',
    tagline: '1,000+ student users',
    blurb:
      'An app that collects campus events from emails, discord, and flyers into one easy-to-use calendar.',
    stack: ['TypeScript', 'SvelteKit', 'Python', 'Flask', 'SQLite', 'AWS EC2', 'Gemini'],
    link: 'https://github.com/albertw7711/Morgridge-Centralized-Event-Dashboard',
  },
  {
    title: 'Phanta',
    tagline: 'Best Solana Implementation · Most Popular Project · Badger Build Fest 2025',
    blurb:
      'An AI-powered portfolio manager with real-time balances, risk scoring, and on-chain group management.',
    stack: ['Update this', 'Update this', 'Update this', 'Update this', 'Update this'],
    link: 'https://github.com/aditya-harsh11/Phanta',
  },
  {
    title: 'Vibe',
    tagline: 'Top 5 Finalist · Claude Hackathon',
    blurb:
      'A spatial social app with leaderboards, activity badges, and AI powered icebreakers and games.',
    stack: ['Update this', 'Update this', 'Update this', 'Update this', 'Update this'],
    link: 'https://github.com/aditya-harsh11/Vibe',
  },
  {
    title: 'TrackMyBus',
    tagline: 'Built for Aditi Mallya International School',
    blurb:
      'A cross-platform bus tracking app with real-time updates across 14+ routes.',
    stack: ['Update this', 'Update this', 'Update this', 'Update this', 'Update this'],
    link: 'https://github.com/aditya-harsh11/TrackMyBus',
  },
  {
    title: 'This Portfolio',
    tagline: 'You are here',
    blurb:
      'A retro Windows 95-themed portfolio featuring desktop windows, a working terminal, an interactive file system, and a playable games.',
    stack: ['Vite', 'React', 'Zustand', 'react-rnd', 'Tailwind'],
    link: 'Update this',
  },
];

export const skills = {
  Languages: ['Python', 'JavaScript', 'Java', 'SQL', 'Dart', 'HTML', 'CSS'],
  'Frameworks (SWE)': ['React', 'Next.js', 'FastAPI', 'Flask', 'Flutter', 'JavaFX', 'JUnit'],
  'Frameworks (AI/ML)': ['PyTorch', 'NumPy', 'Pandas', 'Matplotlib'],
  'Developer Tools': ['Git', 'GitHub', 'Docker', 'Firebase'],
};

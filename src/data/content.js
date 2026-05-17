// Single source of truth for personal content.
// Sourced from Aditya's resume — keep this file in sync with the resume.

export const profile = {
  name: 'Aditya Harshavardhan',
  handle: 'aditya',
  role: 'CS @ UW–Madison · Perception & AI Safety',
  school: 'University of Wisconsin–Madison · BS Computer Science · Expected May 2028',
  gpa: '4.0 / 4.0',
  tagline: 'I build things that see, listen, and decide — autonomy, perception, applied AI.',
  bio: [
    "I'm a CS student at UW–Madison working at the intersection of autonomy, computer vision, and applied AI. I currently engineer perception and infrastructure for Wisconsin Autonomous, a fully self-driving research vehicle program, and I study alignment as a Technical Scholar with the Wisconsin AI Safety Initiative.",
    "Outside of class I build software for hackathons — most recently winning 1st place at Qualcomm's MadData 26 (ArcFlow) and 1st place in the Fish Audio track at MadHacks 2025 (Unsilenced). I like systems that run on-device, interfaces that feel tactile, and projects that have real users.",
  ],
  focus: [
    'Computer Vision',
    'Autonomous Vehicles',
    'AI Safety',
    'Edge / NPU inference',
    'Full-stack',
    'Hackathons',
  ],
  awards: [
    '1st Place — MadData 26 (Qualcomm-sponsored), ArcFlow',
    'Selected presenter — 2026 Qualcomm University Developer Symposium',
    'Selected presenter — UW–Madison N+1 Symposium 2026',
    '1st Place — Fish Audio Track, MadHacks 2025, Unsilenced',
  ],
};

export const contact = {
  email: 'harshavardha@wisc.edu',
  phone: '(608) 209-1711',
  github: 'https://github.com/aditya-harsh11',
  linkedin: 'https://linkedin.com/in/aditya-harshavardhan11',
  location: 'Madison, WI',
};

export const education = [
  {
    school: 'University of Wisconsin–Madison',
    degree: 'B.S. Computer Science',
    dates: 'Aug 2024 – May 2028 (expected)',
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
      'Optimized a lane segmentation model to sustain 60 FPS inference and built a 3D geometry-based stop-bar detection algorithm for precise vehicle positioning at intersections.',
      "Developed ego-trajectory estimation and Bird's Eye View obstacle mapping from RGB and depth sequences, classifying dynamic and static objects in real time.",
      'Integrated legacy V2X modules into a new codebase and built a UDP-based simulation node for real-time vehicle beacon processing and nearest-neighbor tracking.',
    ],
  },
  {
    title: 'Technical Scholar',
    org: 'Wisconsin AI Safety Initiative',
    location: 'Madison, WI',
    dates: 'Mar 2026 – Present',
    bullets: [
      'Completed ARENA and BlueDot curricula — implemented core deep learning architectures from scratch and studied deceptive alignment, reward misspecification, adversarial evals, interpretability, and AI control.',
      'Analyzed 8+ AI safety papers spanning mechanistic interpretability, scalable oversight, alignment, and evals as part of a structured cohort program.',
    ],
  },
  {
    title: 'Data Engineer',
    org: 'Biokind Analytics',
    location: 'Madison, WI',
    dates: 'Feb 2026 – May 2026',
    bullets: [
      'Analyzed 92,000+ attendance and 33,000+ membership records to build disengagement profiles for 10,000+ children at Boys & Girls Clubs of Dane County.',
      'Built a 3-factor risk-score model that identified high-risk subgroups with disengagement rates above 78%, shifting leadership from reactive tracking to proactive intervention.',
      'Modeled 4+ years of time-series attendance data to find seasonal dropout patterns and delivered stakeholder-ready visualizations to organizational leadership.',
    ],
  },
];

export const projects = [
  {
    title: 'ArcFlow',
    tagline: '1st Place · MadData 26 (Qualcomm-sponsored)',
    blurb:
      'Node-based AI pipeline editor for designing multimodal workflows via drag-and-drop or natural-language prompts. Real-time video + audio streamed between a Next.js / React Flow frontend and FastAPI backend, with YOLOv8, YamNet, and OmniNeural-4B deployed to the Qualcomm NPU via ONNX Runtime + Nexa SDK — fully on-device, no external API calls.',
    stack: ['Next.js', 'React Flow', 'FastAPI', 'Python', 'Electron', 'ONNX', 'Nexa SDK'],
    link: 'https://github.com/aditya-harsh11',
  },
  {
    title: 'Unsilenced',
    tagline: '1st Place · Fish Audio Track · MadHacks 2025',
    blurb:
      'Hands-free AAC tool that restores vocal identity for non-verbal users. A 30+ FPS nose-tracking interface (MediaPipe Face Mesh) with a 2,800+ word autocomplete dictionary cut sentence-generation time by >50%. Face API CNN emotion detection (85% accuracy) drives Fish Audio voice tone in real time.',
    stack: ['Next.js', 'Flask', 'TypeScript', 'MediaPipe', 'Face API', 'Fish Audio'],
    link: 'https://github.com/aditya-harsh11',
  },
  {
    title: 'Centralized Event Dashboard',
    tagline: '1,000+ student users',
    blurb:
      'Campus event dashboard consolidating 50+ events from emails, Discord, and flyers into one searchable calendar. Python + IMAP pipeline monitors a shared inbox 24/7, processing 70+ emails/week through Google Gemini for structured extraction. Flask REST API + Discord bot serving 10+ channels, deployed on AWS EC2.',
    stack: ['TypeScript', 'SvelteKit', 'Python', 'Flask', 'SQLite', 'AWS EC2', 'Gemini'],
    link: 'https://github.com/aditya-harsh11',
  },
  {
    title: 'This Portfolio',
    tagline: 'You are here',
    blurb:
      'A Windows-95 themed portfolio with draggable windows, a working terminal, a fake file system, and a Snake game. Vite + React + Zustand + react-rnd, built from scratch.',
    stack: ['Vite', 'React', 'Zustand', 'react-rnd', 'Tailwind'],
    link: 'https://github.com/aditya-harsh11',
  },
];

export const skills = {
  Languages: ['Python', 'JavaScript', 'Java', 'SQL', 'Dart', 'HTML', 'CSS'],
  'Frameworks (SWE)': ['React', 'Next.js', 'FastAPI', 'Flask', 'Flutter', 'JavaFX', 'JUnit'],
  'Frameworks (AI/ML)': ['PyTorch', 'NumPy', 'Pandas', 'Matplotlib'],
  'Developer Tools': ['Git', 'GitHub', 'Docker', 'Firebase'],
};

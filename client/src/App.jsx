import { useState, useEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// THEME — Deep Space Retro (dark + light variants only)
// ─────────────────────────────────────────────────────────────────────────────
const DEEP_SPACE_DARK = {
  bg: '#05060f', bgCard: '#0c0d1e', bgSidebar: '#080918', bgInput: '#12142a',
  bgHover: '#181a30', border: '#1e2240', borderHover: '#363a60',
  text: '#e2e8f8', textSub: '#6b7ab0', textMuted: '#272a4a',
  accent: '#00e5ff', accentSoft: '#00e5ff14',
  g1: 'linear-gradient(135deg,#00e5ff,#7b2fff)',
  g2: 'linear-gradient(135deg,#00ff9d,#00e5ff)',
  g3: 'linear-gradient(135deg,#ff9500,#ff3cac)',
  gDanger: 'linear-gradient(135deg,#ff3cac,#ff0050)',
  success: '#00ff9d', successSoft: '#00ff9d14',
  danger: '#ff0050', dangerSoft: '#ff005014',
  warning: '#ff9500', warningSoft: '#ff950014',
  purple: '#7b2fff', purpleSoft: '#7b2fff14',
  pink: '#ff3cac', pinkSoft: '#ff3cac14',
  shadow: '0 24px 64px #000000b0', shadowCard: '0 4px 32px #00000080', mode: 'dark',
}
const DEEP_SPACE_LIGHT = {
  bg: '#eaf6ff', bgCard: '#ffffff', bgSidebar: '#dff2fd', bgInput: '#d0eaf8',
  bgHover: '#c0e0f5', border: '#90c8e8', borderHover: '#50a8d8',
  text: '#070c1f', textSub: '#2a4a6a', textMuted: '#8aafe8',
  accent: '#0077aa', accentSoft: '#0077aa14',
  g1: 'linear-gradient(135deg,#0077aa,#7b2fff)',
  g2: 'linear-gradient(135deg,#009966,#0077aa)',
  g3: 'linear-gradient(135deg,#cc6600,#cc0055)',
  gDanger: 'linear-gradient(135deg,#cc0055,#880033)',
  success: '#007744', successSoft: '#00774414',
  danger: '#cc0044', dangerSoft: '#cc004414',
  warning: '#aa5500', warningSoft: '#aa550014',
  purple: '#5500cc', purpleSoft: '#5500cc14',
  pink: '#cc0066', pinkSoft: '#cc006614',
  shadow: '0 24px 64px #0077aa18', shadowCard: '0 4px 24px #0077aa10', mode: 'light',
}
const THEMES = { dark: DEEP_SPACE_DARK, light: DEEP_SPACE_LIGHT }
// Legacy aliases so any remaining code using DARK/LIGHT still works
const DARK = DEEP_SPACE_DARK
const LIGHT = DEEP_SPACE_LIGHT

const COURSE_IMAGES = {
  dsa: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80',
  mern: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80',
  ml: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
  os: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  interview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
}

const DEMO_VIDEOS = {
  dsa: [
    { id: 'v1', ytId: 'RBSGKlAvoiM', title: 'Data Structures Full Course', duration: '9:09:41', isFree: true },
    { id: 'v2', ytId: 'BBpAmxU_NQo', title: 'Linked Lists for Technical Interviews', duration: '1:00:08', isFree: false },
    { id: 'v3', ytId: 'A2bFN3MyNDA', title: 'Stacks & Queues Deep Dive', duration: '47:22', isFree: false },
  ],
  mern: [
    { id: 'v1', ytId: 'nu_pCVPKzTk', title: 'HTML & CSS Full Course', duration: '6:51:23', isFree: true },
    { id: 'v2', ytId: 'PkZNo7MFNFg', title: 'JavaScript - Full Beginners Course', duration: '3:26:42', isFree: true },
    { id: 'v3', ytId: 'w7ejDZ8SWv8', title: 'React JS Crash Course', duration: '1:48:42', isFree: false },
  ],
  ml: [
    { id: 'v1', ytId: 'NWONeJKn9Gg', title: 'Machine Learning for Everybody', duration: '3:53:19', isFree: true },
    { id: 'v2', ytId: 'KNAWp2S3w94', title: 'Python for Data Science Full Course', duration: '12:19:56', isFree: false },
  ],
  os: [
    { id: 'v1', ytId: 'vBURTt97EkA', title: 'Operating Systems Full Course', duration: '5:22:01', isFree: true },
  ],
  interview: [
    { id: 'v1', ytId: 'Ge0Udbws1kc', title: 'Resume Tips for Software Engineers', duration: '15:32', isFree: true },
    { id: 'v2', ytId: 'xF2lk5rz23o', title: 'System Design Interview Guide', duration: '47:13', isFree: false },
  ],
}

function GS({ t }) {
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Lora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{height:100%}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:${t.bg};color:${t.text};transition:background .35s,color .35s;-webkit-font-smoothing:antialiased}
    h1,h2,h3{font-family:'Lora',Georgia,serif}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${t.border};border-radius:99px}
    ::-webkit-scrollbar-thumb:hover{background:${t.accent}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes popIn{from{transform:scale(.88);opacity:0}to{transform:scale(1);opacity:1}}
    @keyframes slideRight{from{transform:translateX(-14px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes xpFloat{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-48px);opacity:0}}
    @keyframes streakPop{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
    @keyframes glow{0%,100%{box-shadow:0 0 12px ${t.accent}40}50%{box-shadow:0 0 32px ${t.accent}90}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
    @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
    .card-lift{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease!important}
    .card-lift:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px ${t.accent}30!important;border-color:${t.borderHover}!important}
    .nav-btn:hover:not(.active){background:${t.bgHover}!important;color:${t.text}!important}
    .chip:hover{background:${t.accentSoft}!important;border-color:${t.accent}!important;color:${t.accent}!important}
    .star-btn{background:none;border:none;cursor:pointer;font-size:22px;padding:2px;transition:transform .15s}
    .star-btn:hover{transform:scale(1.2)}
    .xp-pop{animation:xpFloat 1.2s ease forwards;pointer-events:none;position:fixed;font-weight:800;background:${t.g3};-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:18px;z-index:9999}
    .badge-toast{animation:popIn .4s cubic-bezier(.4,0,.2,1)}
    .gradient-text{background:${t.g1};-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .inbox-item:hover{background:${t.bgHover}!important;cursor:pointer}
    .stat-card-glow{animation:glow 3s ease infinite}
    .btn-gradient{background:${t.g1}!important;box-shadow:0 4px 20px ${t.accent}50!important}
    .btn-gradient:hover{filter:brightness(1.12)!important}
    select option{background:${t.bgCard};color:${t.text}}
  `}</style>
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA (student experience — used when no server)
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_COURSES = [
  { _id: 'c1', title: 'Data Structures & Algorithms', instructor: 'Dr. Sharma', instructorId: 'edu1', category: 'CS Core', level: 'Intermediate', thumb: 'dsa', color: '#c96a24', price: 0, isFree: true, contentModel: 'free', xpPerVideo: 30, averageRating: 4.8, totalReviews: 124, totalEnrollments: 847, shortDesc: 'Master DSA from arrays to dynamic programming.', isApproved: true, isPublished: true, language: 'English',
    videos: [
      { id: 'v1', title: 'Introduction to Arrays', duration: '18:42', thumb: '📊', isFree: true },
      { id: 'v2', title: 'Linked Lists Deep Dive', duration: '24:15', thumb: '🔗', isFree: false },
      { id: 'v3', title: 'Stacks & Queues', duration: '21:30', thumb: '📚', isFree: false },
      { id: 'v4', title: 'Binary Trees', duration: '32:10', thumb: '🌳', isFree: false },
      { id: 'v5', title: 'Graph Algorithms', duration: '29:45', thumb: '🕸️', isFree: false },
      { id: 'v6', title: 'Sorting Algorithms', duration: '26:20', thumb: '🔄', isFree: false },
      { id: 'v7', title: 'Dynamic Programming', duration: '35:00', thumb: '⚡', isFree: false },
      { id: 'v8', title: 'Greedy Algorithms', duration: '19:55', thumb: '💡', isFree: false },
      { id: 'v9', title: 'Recursion Mastery', duration: '22:40', thumb: '🔁', isFree: false },
      { id: 'v10', title: 'Hash Tables', duration: '17:30', thumb: '🗂️', isFree: false },
      { id: 'v11', title: 'Heaps & Priority Queues', duration: '23:15', thumb: '🏔️', isFree: false },
      { id: 'v12', title: 'Advanced Topics & Review', duration: '28:50', thumb: '🎯', isFree: false },
    ], resources: [{ name: 'Arrays Notes.pdf', type: 'pdf' }, { name: 'Graphs Cheatsheet', type: 'notes' }],
    tags: ['dsa', 'algorithms', 'competitive'], reviews: [] },
  { _id: 'c2', title: 'Web Development with MERN', instructor: 'Er. Ratan Rajan', instructorId: 'edu2', category: 'Full Stack', level: 'Beginner', thumb: 'mern', color: '#2e9e65', price: 499, isFree: false, xpPerVideo: 25, averageRating: 4.6, totalReviews: 89, totalEnrollments: 432, shortDesc: 'Build full-stack apps with MongoDB, Express, React and Node.', isApproved: true, isPublished: true, language: 'Hindi + English',
    videos: [
      { id: 'v1', title: 'HTML & CSS Fundamentals', duration: '20:10', thumb: '🎨', isFree: true },
      { id: 'v2', title: 'JavaScript ES6+', duration: '25:30', thumb: '⚡', isFree: true },
      { id: 'v3', title: 'React Basics', duration: '30:00', thumb: '⚛️', isFree: false },
      { id: 'v4', title: 'React Hooks', duration: '28:45', thumb: '🎣', isFree: false },
      { id: 'v5', title: 'Node.js & Express', duration: '22:20', thumb: '🟢', isFree: false },
      { id: 'v6', title: 'MongoDB & Mongoose', duration: '19:55', thumb: '🍃', isFree: false },
      { id: 'v7', title: 'REST API Design', duration: '24:30', thumb: '🔌', isFree: false },
      { id: 'v8', title: 'Authentication & JWT', duration: '21:15', thumb: '🔐', isFree: false },
      { id: 'v9', title: 'Deployment', duration: '18:40', thumb: '🚀', isFree: false },
      { id: 'v10', title: 'Full Stack Project', duration: '45:00', thumb: '🏗️', isFree: false },
    ], resources: [{ name: 'React Fundamentals.pdf', type: 'pdf' }], tags: ['mern', 'react', 'nodejs'], reviews: [] },
  { _id: 'c3', title: 'Machine Learning Fundamentals', instructor: 'Dr. Gupta', instructorId: 'edu3', category: 'AI/ML', level: 'Advanced', thumb: 'ml', color: '#c74343', price: 799, isFree: false, xpPerVideo: 35, averageRating: 4.9, totalReviews: 211, totalEnrollments: 1203, shortDesc: 'From linear regression to deep learning — comprehensive ML course.', isApproved: true, isPublished: true, language: 'English',
    videos: [
      { id: 'v1', title: 'Intro to Machine Learning', duration: '22:00', thumb: '🧠', isFree: true },
      { id: 'v2', title: 'Linear Regression', duration: '26:30', thumb: '📈', isFree: false },
      { id: 'v3', title: 'Logistic Regression', duration: '24:15', thumb: '📊', isFree: false },
      { id: 'v4', title: 'Decision Trees', duration: '21:40', thumb: '🌳', isFree: false },
      { id: 'v5', title: 'Neural Networks Basics', duration: '32:45', thumb: '🕸️', isFree: false },
      { id: 'v6', title: 'Deep Learning', duration: '35:10', thumb: '⚡', isFree: false },
      { id: 'v7', title: 'CNN & Image Recognition', duration: '29:00', thumb: '👁️', isFree: false },
      { id: 'v8', title: 'NLP Fundamentals', duration: '27:35', thumb: '💬', isFree: false },
      { id: 'v9', title: 'Model Evaluation', duration: '20:50', thumb: '📋', isFree: false },
      { id: 'v10', title: 'ML Project Capstone', duration: '40:00', thumb: '🏆', isFree: false },
    ], resources: [{ name: 'ML Cheatsheet.pdf', type: 'pdf' }], tags: ['ml', 'ai', 'python', 'neural-networks'], reviews: [] },
  { _id: 'c4', title: 'Operating Systems', instructor: 'Prof. Verma', instructorId: 'edu4', category: 'CS Core', level: 'Intermediate', thumb: 'os', color: '#b8890f', price: 0, isFree: true, contentModel: 'free', xpPerVideo: 28, averageRating: 4.5, totalReviews: 67, totalEnrollments: 529, shortDesc: 'Processes, memory management, scheduling, deadlocks and more.', isApproved: true, isPublished: true, language: 'English',
    videos: [
      { id: 'v1', title: 'OS Introduction', duration: '16:30', thumb: '🖥️', isFree: true },
      { id: 'v2', title: 'Process Management', duration: '24:15', thumb: '⚙️', isFree: false },
      { id: 'v3', title: 'CPU Scheduling', duration: '22:40', thumb: '📅', isFree: false },
      { id: 'v4', title: 'Memory Management', duration: '26:55', thumb: '🧠', isFree: false },
      { id: 'v5', title: 'Virtual Memory & Paging', duration: '21:20', thumb: '📄', isFree: false },
      { id: 'v6', title: 'File Systems', duration: '19:45', thumb: '📁', isFree: false },
      { id: 'v7', title: 'Deadlocks & Semaphores', duration: '25:30', thumb: '🔒', isFree: false },
      { id: 'v8', title: 'I/O Systems & Review', duration: '18:10', thumb: '💾', isFree: false },
    ], resources: [{ name: 'Process Scheduling.pdf', type: 'pdf' }], tags: ['os', 'systems'], reviews: [] },
  { _id: 'c5', title: 'Full-Stack Interview Masterclass', instructor: 'Er. Ratan Rajan', instructorId: 'edu2', category: 'Full Stack', level: 'Advanced', thumb: 'interview', color: '#d4a017', price: 0, isFree: false, contentModel: 'subscription', xpPerVideo: 40, averageRating: 4.9, totalReviews: 312, totalEnrollments: 2100, shortDesc: 'Complete interview prep — DSA, system design, HR rounds, resume tips. Subscription only.', isApproved: true, isPublished: true, language: 'Hindi + English',
    videos: [
      { id: 'v1', title: 'Resume & LinkedIn Optimisation', duration: '22:00', thumb: '📄', isFree: true },
      { id: 'v2', title: 'Arrays & Strings Patterns', duration: '35:00', thumb: '🧩', isFree: false, isSubscription: true },
      { id: 'v3', title: 'Trees & Graphs Interview Questions', duration: '38:30', thumb: '🌳', isFree: false, isSubscription: true },
      { id: 'v4', title: 'Dynamic Programming Patterns', duration: '42:00', thumb: '⚡', isFree: false, isSubscription: true },
      { id: 'v5', title: 'System Design Fundamentals', duration: '45:00', thumb: '🏗️', isFree: false, isSubscription: true },
      { id: 'v6', title: 'Scalable System Design', duration: '48:00', thumb: '🚀', isFree: false, isSubscription: true },
      { id: 'v7', title: 'Behavioural Interview & HR Round', duration: '28:00', thumb: '🎤', isFree: false, isSubscription: true },
      { id: 'v8', title: 'Mock Interview (Full Session)', duration: '60:00', thumb: '🎯', isFree: false, isSubscription: true },
    ], resources: [{ name: 'Interview Cheatsheet.pdf', type: 'pdf' }, { name: 'System Design Notes', type: 'notes' }], tags: ['interview', 'dsa', 'system-design', 'placement'], reviews: [] },
]


// Get course thumbnail URL from COURSE_IMAGES map
const getCourseThumb = (c) => COURSE_IMAGES[c.thumb] || COURSE_IMAGES[c._id?.replace('c','') === '1' ? 'dsa' : 'default'] || COURSE_IMAGES.default

// ── COURSE NORMALIZATION ──────────────────────────────────────────────────────
// Ensures every course object — whether a DEMO_COURSE or an educator-created
// course from localStorage — has all the fields the UI depends on.
const normalizeCourse = (c) => {
  const id = c._id || c.id || ('edu-' + String(c.title || '').toLowerCase().replace(/\s+/g,'-').slice(0,30))
  return {
    ...c,
    _id: id,
    id,
    title: c.title || 'Untitled Course',
    instructor: c.instructorName || c.instructor || 'Educator',
    instructorId: c.instructorId || '',
    category: c.category || 'General',
    level: c.level || 'Beginner',
    color: c.color || '#00e5ff',
    icon: c.icon || '📚',
    price: c.price != null ? c.price : 0,
    isFree: c.isFree != null ? c.isFree : (c.price === 0),
    contentModel: c.contentModel || (c.price > 0 ? 'paid' : 'free'),
    xpPerVideo: c.xpPerVideo || 20,
    averageRating: c.averageRating || 0,
    totalReviews: c.totalReviews || 0,
    totalEnrollments: c.totalEnrollments || 0,
    shortDesc: c.shortDesc || c.description || '',
    language: c.language || 'English',
    thumb: c.thumb || 'default',
    videos: Array.isArray(c.videos) ? c.videos.map((v, i) => ({
      id: v.id || `v${i + 1}`,
      title: v.title || `Video ${i + 1}`,
      duration: v.duration || '10:00',
      thumb: v.thumb || '🎬',
      ytId: v.ytId || null,
      isFree: v.isFree != null ? v.isFree : i === 0,
    })) : [],
    resources: Array.isArray(c.resources) ? c.resources : [],
    reviews: Array.isArray(c.reviews) ? c.reviews : [],
    tags: Array.isArray(c.tags) ? c.tags : [],
  }
}

// Returns ALL courses: built-in demos + educator-published courses (normalized)
const getAllCourses = () => {
  try {
    const published = JSON.parse(localStorage.getItem('eduai_published_courses') || '[]')
    const eduCourses = published.map(normalizeCourse)
    // Deduplicate: educator courses take precedence over demos with same id
    const eduIds = new Set(eduCourses.map(c => c._id))
    const demos = DEMO_COURSES.filter(c => !eduIds.has(c._id)).map(normalizeCourse)
    return [...demos, ...eduCourses]
  } catch { return DEMO_COURSES.map(normalizeCourse) }
}

// ── EMAIL / NOTIFICATION SYSTEM ─────────────────────────────────────────────
// Dual-channel: stores in localStorage inbox (in-app) AND sends via server
// SMTP. The backend /api/mail/send route uses Nodemailer — configure SMTP
// credentials in server/.env (SMTP_HOST, SMTP_USER, SMTP_PASS).
// No client-side keys needed — all credentials stay server-side.

const sendRealEmail = async (to, subject, body) => {
  try {
    await fetch('/api/mail/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    })
  } catch (e) { console.warn('[SMTP Mail]', e.message) }
}

const sendEmail = (to, subject, body, type = 'info') => {
  // 1. Always store in in-app inbox
  const key = `eduai_inbox_${to.toLowerCase()}`
  const inbox = JSON.parse(localStorage.getItem(key) || '[]')
  inbox.unshift({ id: Date.now() + Math.random(), to, subject, body, type, date: new Date().toISOString(), read: false })
  localStorage.setItem(key, JSON.stringify(inbox.slice(0, 50)))
  // 2. Also fire real email via backend SMTP
  sendRealEmail(to, subject, body)
}

const getInbox = (email) => {
  if (!email) return []
  return JSON.parse(localStorage.getItem(`eduai_inbox_${email.toLowerCase()}`) || '[]')
}

const markAllRead = (email) => {
  const key = `eduai_inbox_${email.toLowerCase()}`
  const inbox = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify(inbox.map(m => ({ ...m, read: true }))))
}

const deleteMessage = (email, id) => {
  const key = `eduai_inbox_${email.toLowerCase()}`
  const inbox = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify(inbox.filter(m => m.id !== id)))
}

// Certification quiz questions per course
const CERT_QUIZZES = {
  c1: { // DSA
    title: 'Data Structures & Algorithms Certification Exam',
    passMark: 35,
    questions: [
      // Easy (1-20)
      { id: 1, level: 'easy',     q: 'What is the time complexity of accessing an element in an array by index?', opts: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], ans: 2 },
      { id: 2, level: 'easy',     q: 'Which data structure follows LIFO (Last In First Out)?', opts: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1 },
      { id: 3, level: 'easy',     q: 'What does FIFO stand for?', opts: ['First In First Out', 'Fast In Fast Out', 'First Index First Operation', 'None'], ans: 0 },
      { id: 4, level: 'easy',     q: 'Which sorting algorithm has best-case O(n) time complexity?', opts: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'], ans: 2 },
      { id: 5, level: 'easy',     q: 'What is the space complexity of a simple array of n elements?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], ans: 1 },
      { id: 6, level: 'easy',     q: 'In a singly linked list, each node contains:', opts: ['Data only', 'Data and two pointers', 'Data and one pointer to next', 'Only a pointer'], ans: 2 },
      { id: 7, level: 'easy',     q: 'What is the height of a balanced binary tree with n nodes?', opts: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], ans: 1 },
      { id: 8, level: 'easy',     q: 'Which traversal visits root first, then left, then right?', opts: ['Inorder', 'Postorder', 'Preorder', 'Level order'], ans: 2 },
      { id: 9, level: 'easy',     q: 'An empty stack results in which error on pop?', opts: ['Overflow', 'Underflow', 'Segfault', 'Null pointer'], ans: 1 },
      { id: 10, level: 'easy',    q: 'What data structure is used to implement BFS?', opts: ['Stack', 'Queue', 'Heap', 'Graph'], ans: 1 },
      { id: 11, level: 'easy',    q: 'Hash table average case time complexity for search is:', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 3 },
      { id: 12, level: 'easy',    q: 'Which of these is NOT a linear data structure?', opts: ['Array', 'Queue', 'Tree', 'Stack'], ans: 2 },
      { id: 13, level: 'easy',    q: 'What is recursion?', opts: ['A loop', 'A function calling itself', 'An iterative process', 'A data structure'], ans: 1 },
      { id: 14, level: 'easy',    q: 'Bubble Sort worst-case time complexity is:', opts: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], ans: 2 },
      { id: 15, level: 'easy',    q: 'A complete binary tree of height h has at most how many nodes?', opts: ['2^h', '2^(h+1) - 1', 'h²', '2h'], ans: 1 },
      { id: 16, level: 'easy',    q: 'Dequeue (Double-ended queue) allows insertion/deletion from:', opts: ['Front only', 'Rear only', 'Both ends', 'Middle only'], ans: 2 },
      { id: 17, level: 'easy',    q: 'Which algorithm uses divide and conquer?', opts: ['Bubble Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'], ans: 1 },
      { id: 18, level: 'easy',    q: 'What is a leaf node in a binary tree?', opts: ['Node with two children', 'Root node', 'Node with no children', 'Node with one child'], ans: 2 },
      { id: 19, level: 'easy',    q: 'Time complexity of binary search is:', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2 },
      { id: 20, level: 'easy',    q: 'A graph with no cycles is called a:', opts: ['Complete graph', 'Tree', 'Multigraph', 'Digraph'], ans: 1 },
      // Moderate (21-40)
      { id: 21, level: 'moderate', q: 'What is the worst-case time complexity of Quick Sort?', opts: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], ans: 2 },
      { id: 22, level: 'moderate', q: 'In a min-heap, the minimum element is always at:', opts: ['Last position', 'Root', 'Leaf', 'Arbitrary position'], ans: 1 },
      { id: 23, level: 'moderate', q: 'Which data structure is used to implement Dijkstra\'s algorithm efficiently?', opts: ['Stack', 'Queue', 'Priority Queue', 'Deque'], ans: 2 },
      { id: 24, level: 'moderate', q: 'What is the time complexity of inserting into a balanced BST?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], ans: 2 },
      { id: 25, level: 'moderate', q: 'Floyd-Warshall algorithm finds:', opts: ['Single-source shortest path', 'All-pairs shortest path', 'Minimum spanning tree', 'Topological sort'], ans: 1 },
      { id: 26, level: 'moderate', q: 'Which hashing technique chains overflowing elements in a linked list?', opts: ['Open addressing', 'Separate chaining', 'Double hashing', 'Linear probing'], ans: 1 },
      { id: 27, level: 'moderate', q: 'Kruskal\'s algorithm is used to find:', opts: ['Shortest path', 'Minimum spanning tree', 'Topological order', 'DFS order'], ans: 1 },
      { id: 28, level: 'moderate', q: 'AVL tree is a:', opts: ['Self-balancing BST', 'Hash table', 'Unbalanced tree', 'Graph'], ans: 0 },
      { id: 29, level: 'moderate', q: 'LRU cache is most efficiently implemented using:', opts: ['Array + BST', 'HashMap + Doubly Linked List', 'Stack + Queue', 'Heap'], ans: 1 },
      { id: 30, level: 'moderate', q: 'Topological sort applies to:', opts: ['Undirected graphs', 'Directed acyclic graphs (DAGs)', 'Trees only', 'Complete graphs'], ans: 1 },
      { id: 31, level: 'moderate', q: 'Merge Sort\'s space complexity is:', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], ans: 2 },
      { id: 32, level: 'moderate', q: 'In dynamic programming, overlapping subproblems are solved using:', opts: ['Recursion only', 'Memoisation/tabulation', 'Greedy approach', 'Divide and conquer'], ans: 1 },
      { id: 33, level: 'moderate', q: 'The in-order traversal of a BST gives nodes in:', opts: ['Random order', 'Descending order', 'Ascending order', 'Level order'], ans: 2 },
      { id: 34, level: 'moderate', q: 'Which of these is a greedy algorithm?', opts: ['Merge Sort', 'Dijkstra\'s', 'Floyd-Warshall', 'Matrix Chain Multiplication'], ans: 1 },
      { id: 35, level: 'moderate', q: 'What is the time complexity of heap sort?', opts: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], ans: 2 },
      { id: 36, level: 'moderate', q: 'A B-tree of order m has at most how many children per node?', opts: ['m', 'm-1', 'm+1', '2m'], ans: 0 },
      { id: 37, level: 'moderate', q: 'Which algorithm finds strongly connected components?', opts: ['Prim\'s', 'Kruskal\'s', 'Tarjan\'s / Kosaraju\'s', 'Bellman-Ford'], ans: 2 },
      { id: 38, level: 'moderate', q: 'The knapsack problem with fractional items is solved by:', opts: ['DP', 'Greedy', 'Backtracking', 'BFS'], ans: 1 },
      { id: 39, level: 'moderate', q: 'Red-Black tree insertion has time complexity:', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], ans: 2 },
      { id: 40, level: 'moderate', q: 'Union-Find data structure is used in:', opts: ['Sorting', 'Shortest path', 'Kruskal\'s MST algorithm', 'Binary search'], ans: 2 },
      // Hard (41-50)
      { id: 41, level: 'hard',    q: 'In amortised analysis, what does the accounting method track?', opts: ['Worst-case per operation', 'Prepaid work credits per operation', 'Average-case only', 'Space usage'], ans: 1 },
      { id: 42, level: 'hard',    q: 'What is the time complexity of the fastest comparison-based sorting algorithm in the worst case?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], ans: 1 },
      { id: 43, level: 'hard',    q: 'Fibonacci heap gives Dijkstra\'s algorithm which complexity?', opts: ['O(E log V)', 'O(V² + E)', 'O(E + V log V)', 'O(V log E)'], ans: 2 },
      { id: 44, level: 'hard',    q: 'Which problem is solved by the Bellman-Ford algorithm that Dijkstra cannot handle?', opts: ['Dense graphs', 'Graphs with negative edge weights', 'Directed graphs', 'Unweighted graphs'], ans: 1 },
      { id: 45, level: 'hard',    q: 'A skip list has expected time complexity of O(log n) for search due to:', opts: ['Balanced structure', 'Random level assignment', 'Sorted order', 'Hash functions'], ans: 1 },
      { id: 46, level: 'hard',    q: 'In a segment tree for range sum queries, update time is:', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], ans: 2 },
      { id: 47, level: 'hard',    q: 'The edit distance (Levenshtein) between two strings of length m and n using DP has complexity:', opts: ['O(m+n)', 'O(mn)', 'O(m log n)', 'O(2^n)'], ans: 1 },
      { id: 48, level: 'hard',    q: 'Which theorem describes the running time of divide-and-conquer recurrences?', opts: ['Bayes theorem', 'Master theorem', 'Fermat\'s theorem', 'CAP theorem'], ans: 1 },
      { id: 49, level: 'hard',    q: 'Suffix arrays can be constructed in:', opts: ['O(n²)', 'O(n log² n)', 'O(n log n)', 'O(n) with SA-IS algorithm'], ans: 3 },
      { id: 50, level: 'hard',    q: 'The maximum flow algorithm by Dinic runs in:', opts: ['O(V²E)', 'O(VE)', 'O(E log V)', 'O(V³)'], ans: 0 },
    ]
  }
}

// Build quizzes for other courses from DSA questions (reuse with modified context)
const buildCertQuiz = (courseId, title) => {
  const base = CERT_QUIZZES.c1
  return { ...base, title: title + ' Certification Exam', questions: base.questions.slice(0, 50) }
}
CERT_QUIZZES.c2 = buildCertQuiz('c2', 'Web Development with MERN')
CERT_QUIZZES.c3 = buildCertQuiz('c3', 'Machine Learning Fundamentals')
CERT_QUIZZES.c4 = buildCertQuiz('c4', 'Operating Systems')
CERT_QUIZZES.c5 = buildCertQuiz('c5', 'Full-Stack Interview Masterclass')

const QUIZ_QUESTIONS = [
  { id: 1, question: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
  { id: 2, question: 'Which data structure uses LIFO?', options: ['Queue', 'Array', 'Stack', 'Linked List'], correct: 2 },
  { id: 3, question: 'In a BST, the left child is always:', options: ['Greater than parent', 'Equal to parent', 'Less than parent', 'Random'], correct: 2 },
  { id: 4, question: 'Which sort has O(n log n) average?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], correct: 2 },
  { id: 5, question: "What does 'n' represent in Big O notation?", options: ['Number of operations', 'Size of input', 'Memory used', 'Loops'], correct: 1 },
]

const XP_LEVELS = [
  { level: 1, min: 0, title: 'Beginner', color: '#6b7fa3' },
  { level: 2, min: 200, title: 'Explorer', color: '#10b981' },
  { level: 3, min: 500, title: 'Scholar', color: '#5b6ef5' },
  { level: 4, min: 1000, title: 'Expert', color: '#8b5cf6' },
  { level: 5, min: 2000, title: 'Master', color: '#f59e0b' },
  { level: 6, min: 3500, title: 'Champion', color: '#ef4444' },
  { level: 7, min: 5000, title: 'Legend', color: '#ec4899' },
]

const BADGES = [
  { id: 'first_video', icon: '🎬', title: 'First Step', desc: 'Watch your first video', xp: 50 },
  { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: '3-day study streak', xp: 75 },
  { id: 'streak_7', icon: '⚡', title: 'Week Warrior', desc: '7-day study streak', xp: 150 },
  { id: 'course_complete', icon: '🎓', title: 'Graduate', desc: 'Complete a course', xp: 300 },
  { id: 'first_purchase', icon: '💳', title: 'Investor', desc: 'Purchase your first course', xp: 100 },
  { id: 'quiz_perfect', icon: '💯', title: 'Perfect Score', desc: '100% on a quiz', xp: 200 },
  { id: 'videos_10', icon: '🎯', title: 'Video Buff', desc: 'Watch 10 videos', xp: 100 },
  { id: 'ai_chat', icon: '🤖', title: 'AI Apprentice', desc: 'Ask AI Tutor 5 questions', xp: 75 },
  { id: 'note_taker', icon: '📝', title: 'Note Taker', desc: 'Generate AI notes', xp: 50 },
  { id: 'reviewer', icon: '⭐', title: 'Critic', desc: 'Leave a course review', xp: 50 },
  { id: 'level_3', icon: '🌟', title: 'Scholar', desc: 'Reach Level 3', xp: 200 },
  { id: 'level_5', icon: '💎', title: 'Master', desc: 'Reach Level 5', xp: 500 },
]

const MOCK_LEADERBOARD = [
  // { name: 'Akhil Yadav', xp: 3420, streak: 28, avatar: 'AY', color: '#5b6ef5' },
  // { name: 'Priya Sharma', xp: 2980, streak: 15, avatar: 'PS', color: '#ec4899' },
  // { name: 'Rahul Gupta', xp: 2650, streak: 22, avatar: 'RG', color: '#059669' },
  // { name: 'Sneha Singh', xp: 2100, streak: 10, avatar: 'SS', color: '#d97706' },
  // { name: 'Amit Kumar', xp: 1890, streak: 7, avatar: 'AK', color: '#8b5cf6' },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const CP = (c, watched = []) => { const vids = c?.videos || []; const t = vids.length, d = (watched||[]).length, p = t ? Math.round(d / t * 100) : 0; return { done: d, total: t, pct: p, isComplete: t > 0 && p === 100 } }
const getLvl = xp => { let cur = XP_LEVELS[0], nxt = XP_LEVELS[1]; for (let i = XP_LEVELS.length - 1; i >= 0; i--) { if (xp >= XP_LEVELS[i].min) { cur = XP_LEVELS[i]; nxt = XP_LEVELS[i + 1] || null; break } } const pct = nxt ? Math.round((xp - cur.min) / (nxt.min - cur.min) * 100) : 100; return { cur, nxt, pct } }
const TODAY = () => new Date().toISOString().split('T')[0]
const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n

function checkBadges(user, event = {}) {
  const earned = [...(user.badges || [])]
  const tw = Object.values(user.courseProgress || {}).reduce((a, v) => a + v.length, 0)
  const newB = []
  const checks = [
    { id: 'first_video', c: tw >= 1 }, { id: 'streak_3', c: (user.streak || 0) >= 3 },
    { id: 'streak_7', c: (user.streak || 0) >= 7 }, { id: 'videos_10', c: tw >= 10 },
    { id: 'ai_chat', c: (user.aiQuestions || 0) >= 5 }, { id: 'note_taker', c: (user.notesGenerated || 0) >= 1 },
    { id: 'level_3', c: (user.xp || 0) >= 500 }, { id: 'level_5', c: (user.xp || 0) >= 2000 },
    { id: 'quiz_perfect', c: !!event.quizPerfect }, { id: 'first_purchase', c: !!event.purchased },
    { id: 'reviewer', c: !!event.reviewed },
    { id: 'course_complete', c: DEMO_COURSES.some(c => CP(c, user.courseProgress?.[c._id]).isComplete) },
  ]
  checks.forEach(({ id, c }) => { if (c && !earned.includes(id)) { earned.push(id); newB.push(id) } })
  return { earned, newBadges: newB }
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function PBar({ v, color, t, h = 7, gradient }) {
  return <div style={{ background: t.border, borderRadius: 99, height: h, overflow: 'hidden' }}>
    <div style={{ width: `${v}%`, height: '100%', borderRadius: 99, background: gradient || `linear-gradient(90deg,${color}99,${color})`, transition: 'width .8s cubic-bezier(.4,0,.2,1)', boxShadow: `0 0 12px ${color}60` }} />
  </div>
}

function TToggle({ isDark, onToggle, t }) {
  return <button onClick={onToggle} style={{ width: 54, height: 28, borderRadius: 99, border: `1.5px solid ${t.border}`, padding: 3, background: isDark ? 'linear-gradient(135deg,#1c2a44,#0d1526)' : 'linear-gradient(135deg,#e0e9ff,#f0f4ff)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .3s' }}>
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDark ? 'linear-gradient(135deg,#818cf8,#a78bfa)' : 'linear-gradient(135deg,#fbbf24,#f59e0b)', transform: `translateX(${isDark ? 26 : 0}px)`, transition: 'transform .3s cubic-bezier(.4,0,.2,1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{isDark ? '🌙' : '☀️'}</div>
  </button>
}

function Btn({ children, onClick, color, soft, disabled, style = {}, size = 'md', gradient }) {
  const pad = size === 'sm' ? '6px 14px' : size === 'lg' ? '14px 32px' : '10px 22px'
  const fs = size === 'sm' ? 12 : size === 'lg' ? 16 : 14
  const bg = soft ? color + '18' : gradient || `linear-gradient(135deg,${color}ee,${color}99)`
  return <button onClick={onClick} disabled={disabled} style={{ background: bg, border: soft ? `1px solid ${color}40` : 'none', color: soft ? color : '#fff', padding: pad, borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: fs, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif', opacity: disabled ? 0.5 : 1, transition: 'all .2s', boxShadow: soft ? 'none' : `0 4px 20px ${color}45`, letterSpacing: .3, ...style }}>{children}</button>
}

function Card({ children, t, style = {}, className = '', glow }) {
  return <div className={`card-lift ${className}`} style={{ background: t.bgCard, borderRadius: 20, border: `1px solid ${t.border}`, boxShadow: glow ? `${t.shadowCard},0 0 0 1px ${glow}30` : t.shadowCard, ...style }}>{children}</div>
}

function Badge({ text, color, soft = true, pulse }) {
  return <span style={{ background: soft ? color + '22' : color, color: soft ? color : '#fff', fontSize: 10, padding: '3px 10px', borderRadius: 99, fontWeight: 700, whiteSpace: 'nowrap', animation: pulse ? 'pulse 2s infinite' : 'none', display:'inline-flex', alignItems:'center', gap:3 }}>{text}</span>
}

function GlassCard({ children, style = {}, t }) {
  return <div style={{ background: t.mode === 'dark' ? 'rgba(22,21,31,0.85)' : 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: 20, border: `1px solid ${t.border}`, boxShadow: t.shadowCard, ...style }}>{children}</div>
}

function Spinner({ color, size = 20 }) {
  return <div style={{ width: size, height: size, border: `2px solid #ffffff30`, borderTopColor: color || '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
}

function StarRating({ value, onChange, t }) {
  const [hover, setHover] = useState(0)
  return <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} className="star-btn" onClick={() => onChange && onChange(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} style={{ color: s <= (hover || value) ? '#f59e0b' : t.border }}>★</button>
    ))}
  </div>
}

function XPFloat({ amount, x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t) }, [])
  return <div className="xp-pop" style={{ left: x, top: y }}>+{amount} XP ⚡</div>
}

function BadgeToast({ badgeId, onDone, t }) {
  const b = BADGES.find(x => x.id === badgeId)
  useEffect(() => { const timer = setTimeout(onDone, 3500); return () => clearTimeout(timer) }, [])
  if (!b) return null
  return <div className="badge-toast" style={{ position: 'fixed', bottom: 28, right: 28, background: t.bgCard, border: `2px solid ${t.warning}`, borderRadius: 18, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14, zIndex: 9999, boxShadow: `0 8px 40px ${t.warning}40`, maxWidth: 320 }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: t.warningSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{b.icon}</div>
    <div><div style={{ color: t.warning, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>🏅 Badge Unlocked!</div><div style={{ color: t.text, fontSize: 15, fontWeight: 800, marginTop: 2 }}>{b.title}</div><div style={{ color: t.textSub, fontSize: 12 }}>{b.desc} · +{b.xp} XP</div></div>
  </div>
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION INBOX
// ─────────────────────────────────────────────────────────────────────────────
function NotificationBell({ user, t }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [panelPos, setPanelPos] = useState({ top: 60, left: 260 })
  const btnRef = useRef(null)
  const panelRef = useRef(null)

  const reload = () => setMsgs(getInbox(user?.email))

  useEffect(() => { reload() }, [user?.email])
  useEffect(() => {
    const interval = setInterval(reload, 3000)
    return () => clearInterval(interval)
  }, [user?.email])

  useEffect(() => {
    const handler = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target) &&
          panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = msgs.filter(m => !m.read).length
  const typeColor = { info: t.accent, success: t.success, warning: t.warning, danger: t.danger }
  const typeIcon = { info: '📧', success: '✅', warning: '⚠️', danger: '🚫' }

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      // Place panel to the right of sidebar, just below the button
      setPanelPos({ top: rect.bottom + 8, left: rect.right + 10 })
    }
    setOpen(o => !o)
    if (!open) { markAllRead(user.email); setTimeout(reload, 100) }
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    deleteMessage(user.email, id)
    reload()
  }

  return (
    <div style={{ position: 'relative' }}>
      <button ref={btnRef} onClick={handleOpen} title="Inbox"
        style={{ position:'relative', background: open ? t.accentSoft : 'transparent', border: open ? `1px solid ${t.accent}40` : `1px solid ${t.border}`, borderRadius:11, width:38, height:38, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, transition:'all .2s', color: t.textSub }}>
        📬
        {unread > 0 && <span style={{ position:'absolute', top:-5, right:-5, background: t.danger, color:'#fff', borderRadius:'50%', width:17, height:17, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, animation:'pulse 2s infinite' }}>{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div ref={panelRef}
          style={{ position:'fixed', top: panelPos.top, left: panelPos.left, width:370, maxHeight:520, background: t.bgCard, border:`1px solid ${t.border}`, borderRadius:18, boxShadow: t.shadow, overflow:'hidden', animation:'slideDown .25s ease', zIndex:99999, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'14px 18px 12px', borderBottom:`1px solid ${t.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', background: `linear-gradient(135deg,${t.bgHover},${t.bgCard})` }}>
            <div style={{ fontWeight:800, color:t.text, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>📬 Inbox <Badge text={msgs.length} color={t.accent} /></div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {msgs.length > 0 && <button onClick={() => { localStorage.setItem(`eduai_inbox_${user.email.toLowerCase()}`, '[]'); reload() }} style={{ background:t.dangerSoft, border:'none', color:t.danger, fontSize:10, padding:'3px 10px', borderRadius:8, cursor:'pointer', fontWeight:700 }}>Clear All</button>}
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:t.textSub, cursor:'pointer', fontSize:18, lineHeight:1, padding:'0 2px' }}>✕</button>
            </div>
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            {msgs.length === 0 ? (
              <div style={{ padding:'40px 20px', textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>📭</div>
                <div style={{ color:t.textSub, fontSize:13 }}>No messages yet</div>
                <div style={{ color:t.textMuted, fontSize:11, marginTop:4 }}>Admin actions & notifications appear here</div>
              </div>
            ) : msgs.map(msg => (
              <div key={msg.id} className="inbox-item" style={{ padding:'12px 16px', borderBottom:`1px solid ${t.border}`, background: msg.read ? 'transparent' : (typeColor[msg.type] || t.accent) + '08', position:'relative' }}>
                {!msg.read && <div style={{ position:'absolute', left:6, top:'50%', transform:'translateY(-50%)', width:6, height:6, borderRadius:'50%', background: typeColor[msg.type] || t.accent }} />}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                      <span style={{ fontSize:14 }}>{typeIcon[msg.type] || '📧'}</span>
                      <span style={{ color: typeColor[msg.type] || t.accent, fontSize:12, fontWeight:800, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.subject}</span>
                    </div>
                    <div style={{ color:t.textSub, fontSize:11, lineHeight:1.5, whiteSpace:'pre-line', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{msg.body}</div>
                    <div style={{ color:t.textMuted, fontSize:10, marginTop:5 }}>{new Date(msg.date).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</div>
                  </div>
                  <button onClick={(e) => handleDelete(msg.id, e)} title="Delete" style={{ background:'none', border:'none', color:t.textMuted, cursor:'pointer', fontSize:16, padding:'2px', flexShrink:0, lineHeight:1 }}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH SCREEN — role selection + email/password (no OTP)
// ─────────────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin, t, isDark, onToggleTheme }) {
  const [step, setStep] = useState('role') // role → form
  const [selectedRole, setSelectedRole] = useState(null)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', rollNo: '', institution: '', bio: '', qualification: '', experience: '', expertise: '', linkedIn: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState(null)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const inp = (field) => ({ width: '100%', background: t.bgInput, border: `1.5px solid ${focused === field ? t.accent : t.border}`, borderRadius: 12, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all .2s', boxShadow: focused === field ? `0 0 0 3px ${t.accentSoft}` : 'none' })

  const handleRegister = async () => {
    if (!form.name.trim()) return setError('Full name required.')
    if (!form.email.includes('@')) return setError('Valid email required.')
    if (form.password.length < 6) return setError('Password min 6 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (selectedRole === 'educator' && !form.qualification.trim()) return setError('Qualification required for educators.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const existing = localStorage.getItem(`eduai_user_${form.email.toLowerCase()}`)
    if (existing) { setLoading(false); return setError('An account with this email already exists. Please login.') }
    const userData = {
      name: form.name, email: form.email.toLowerCase(), password: form.password,
      role: selectedRole, rollNo: form.rollNo, institution: form.institution,
      bio: form.bio, qualification: form.qualification, experience: form.experience,
      expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
      linkedIn: form.linkedIn,
      // Educator: must wait for admin approval before publishing courses
      educatorStatus: selectedRole === 'educator' ? 'pending' : 'none',
      isVerified: selectedRole === 'student', // students auto-verified, educators need admin
      walletBalance: 0, totalStudents: 0, totalRevenue: 0, totalEarnings: 0,
      xp: 0, streak: 0, lastStudyDate: null, badges: [], aiQuestions: 0, notesGenerated: 0, notes: {},
      courseProgress: {}, enrolledCourses: [], wishlist: [], myCourses: [],
      subscription: { plan: 'free', status: 'none' },
      joinedDate: new Date().toISOString(),
    }
    localStorage.setItem(`eduai_user_${form.email.toLowerCase()}`, JSON.stringify(userData))
    // Enqueue educator for admin review
    if (selectedRole === 'educator') {
      const pending = JSON.parse(localStorage.getItem('eduai_pending_educators') || '[]')
      pending.push({ ...userData, submittedAt: new Date().toISOString() })
      localStorage.setItem('eduai_pending_educators', JSON.stringify(pending))
    }
    // Send welcome notification to user inbox
    if (selectedRole === 'educator') {
      sendEmail(userData.email,
        '⏳ Educator Application Received — Pending Review',
        `Dear ${userData.name},\n\nThank you for registering as an educator on EduAI!\n\nYour application has been received and is currently under review by our admin team. This typically takes 24–48 hours.\n\nYou will receive a notification here in your inbox once a decision has been made.\n\nWhile you wait, you can explore the platform.\n\nEduAI Team`,
        'info')
    } else {
      sendEmail(userData.email,
        '🎓 Welcome to EduAI!',
        `Dear ${userData.name},\n\nWelcome aboard! Your EduAI student account has been created successfully.\n\nYou can now:\n• Browse & enroll in free courses\n• Purchase premium courses\n• Earn XP and badges\n• Compete on the leaderboard\n• Get help from the AI Tutor 24/7\n\nHappy Learning!\nEduAI Team`,
        'success')
    }
    setLoading(false)
    onLogin(userData)
  }

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError('Fill all fields.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    // Demo admin shortcut
    if (form.email === 'admin@eduai.com' && form.password === 'admin123') {
      const adminUser = { name: 'Admin', email: 'admin@eduai.com', role: 'admin', joinedDate: new Date().toISOString() }
      localStorage.setItem('eduai_current_user', JSON.stringify(adminUser))
      setLoading(false); return onLogin(adminUser)
    }
    const saved = localStorage.getItem(`eduai_user_${form.email.toLowerCase()}`)
    const userData = saved ? JSON.parse(saved) : null
    if (!userData) { setLoading(false); return setError('Account not found. Please register.') }
    if (userData.password && userData.password !== form.password) { setLoading(false); return setError('Incorrect password.') }
    // Block/suspend check
    if (userData.blocked) {
      setLoading(false)
      return setError('🚫 Your account has been permanently blocked due to guideline violations. Contact legal@eduai.com to appeal.')
    }
    if (userData.suspended) {
      // Auto-lift if suspension period has expired
      const until = userData.suspendedUntil ? new Date(userData.suspendedUntil) : null
      if (!until || new Date() >= until) {
        userData.suspended = false
        delete userData.suspendedUntil
        localStorage.setItem(`eduai_user_${form.email.toLowerCase()}`, JSON.stringify(userData))
        // allow login to continue below
      } else {
        setLoading(false)
        const remaining = until.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        return setError(`⚠️ Account suspended until ${remaining}. Contact support@eduai.com to appeal.`)
      }
    }
    userData.lastLogin = new Date().toISOString()
    localStorage.setItem(`eduai_user_${form.email.toLowerCase()}`, JSON.stringify(userData))
    setLoading(false)
    onLogin(userData)
  }

  // ── Role Selection ──────────────────────────────────────────────────────────
  if (step === 'role' && mode === 'register') return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <GS t={t} />
      <div style={{ position: 'absolute', top: 24, right: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: t.textSub, fontSize: 12 }}>{isDark ? 'Dark' : 'Light'}</span>
        <TToggle isDark={isDark} onToggle={onToggleTheme} t={t} />
      </div>
      <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${t.accent}12 0%,transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, right: -150, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${t.purple}10 0%,transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 520, padding: '0 20px', position: 'relative', zIndex: 1, animation: 'fadeUp .5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, alignItems: 'center', justifyContent: 'center', fontSize: 30, marginBottom: 14, boxShadow: `0 0 40px ${t.accent}40` }}>⚡</div>
          <h1 style={{ color: t.text, fontSize: 30, fontWeight: 900, margin: 0 }}>Join EduAI</h1>
          <p style={{ color: t.textSub, fontSize: 14, marginTop: 6 }}>Choose how you want to use EduAI</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { role: 'student', icon: '🎓', title: 'Student / Learner', desc: 'Enroll in courses, earn XP, track progress, get AI tutoring', color: t.accent, perks: ['📚 Enroll in free & paid courses', '⚡ Earn XP & badges', '🤖 AI Tutor 24/7', '🏆 Leaderboard rankings'] },
            { role: 'educator', icon: '👨‍🏫', title: 'Educator / Teacher', desc: 'Create and sell courses, build your brand, earn revenue', color: t.success, perks: ['🎬 Create & publish courses', '💰 Earn 80% per sale', '📊 Student analytics', '✅ Verified badge'] },
          ].map(({ role, icon, title, desc, color, perks }) => (
            <div key={role} className="card-lift" onClick={() => { setSelectedRole(role); setStep('form') }}
              style={{ background: t.bgCard, borderRadius: 22, padding: 24, border: `2px solid ${selectedRole === role ? color : t.border}`, cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: t.shadowCard }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color }} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ color: t.text, fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{title}</h3>
              <p style={{ color: t.textSub, fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>{desc}</p>
              {perks.map(p => <div key={p} style={{ color: t.textSub, fontSize: 11, marginBottom: 5 }}>{p}</div>)}
              <div style={{ marginTop: 16, background: color, color: '#fff', borderRadius: 10, padding: '8px 16px', textAlign: 'center', fontSize: 13, fontWeight: 700 }}>Join as {role.charAt(0).toUpperCase() + role.slice(1)} →</div>
            </div>
          ))}
        </div>
        <p style={{ color: t.textSub, fontSize: 13, textAlign: 'center', marginTop: 20 }}>Already have an account? <span onClick={() => setMode('login')} style={{ color: t.accent, cursor: 'pointer', fontWeight: 700 }}>Sign in</span></p>
      </div>
    </div>
  )

  // ── OTP Step ────────────────────────────────────────────────────────────────
  // OTP step removed — using direct email+password registration with admin verification for educators

  // ── Login / Register Form ───────────────────────────────────────────────────
  const isLogin = mode === 'login'
  const isEducator = selectedRole === 'educator'

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <GS t={t} />
      <div style={{ position: 'absolute', top: -180, left: -180, width: 550, height: 550, borderRadius: '50%', background: `radial-gradient(circle,${t.accent}14 0%,transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 24, right: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: t.textSub, fontSize: 12 }}>{isDark ? 'Dark' : 'Light'}</span>
        <TToggle isDark={isDark} onToggle={onToggleTheme} t={t} />
      </div>
      <div style={{ width: '100%', maxWidth: 480, padding: '0 20px', position: 'relative', zIndex: 1, overflowY: 'auto', maxHeight: '100vh', paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24, animation: 'fadeUp .5s ease' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: t.g1, margin: '0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, boxShadow: `0 12px 40px ${t.accent}60`, animation:'glow 3s ease infinite' }}>⚡</div>
          <h1 style={{ color: t.text, fontSize: 28, fontFamily: 'Lora,serif', fontWeight: 700, margin: 0 }}>EduAI</h1>
          <p style={{ color: t.textSub, fontSize: 12, marginTop: 4 }}>
            {!isLogin && <><span style={{ background: (isEducator ? t.success : t.accent) + '20', color: isEducator ? t.success : t.accent, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{isEducator ? '👨‍🏫 Educator' : '🎓 Student'}</span> &nbsp;</>}
            Smart Learning Platform
          </p>
        </div>
        <Card t={t} style={{ padding: 28, animation: 'fadeUp .5s ease .1s both' }}>
          <div style={{ display: 'flex', background: t.bgInput, borderRadius: 13, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); if (m === 'register') setStep('role') }} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', background: mode === m ? `linear-gradient(135deg,${t.accent},#7c3aed)` : 'transparent', color: mode === m ? '#fff' : t.textSub, fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all .25s' }}>
                {m === 'login' ? '🔑 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          {isLogin ? (
            <>
              <h2 style={{ color: t.text, fontSize: 18, fontWeight: 800, margin: '0 0 20px' }}>Welcome back!</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Email</label><input value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@srmcem.ac.in" type="email" style={inp('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
                <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Password</label>
                  <div style={{ position: 'relative' }}><input value={form.password} onChange={e => set('password', e.target.value)} placeholder="Enter password" type={showPass ? 'text' : 'password'} style={{ ...inp('pass'), paddingRight: 44 }} onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} onKeyDown={e => e.key === 'Enter' && handleLogin()} /><button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 15 }}>{showPass ? '🙈' : '👁'}</button></div></div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <h2 style={{ color: t.text, fontSize: 17, fontWeight: 800, margin: 0, flex: 1 }}>{isEducator ? '👨‍🏫 Educator Registration' : '🎓 Student Registration'}</h2>
                <button onClick={() => setStep('role')} style={{ background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Change Role</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Full Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Aniket Singh" style={inp('name')} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} /></div>
                <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Email *</label><input value={form.email} onChange={e => set('email', e.target.value)} placeholder={isEducator ? 'teacher@college.edu' : 'you@srmcem.ac.in'} type="email" style={inp('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} /></div>

                {!isEducator && <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Roll Number</label><input value={form.rollNo} onChange={e => set('rollNo', e.target.value)} placeholder="2201220100026" style={inp('roll')} onFocus={() => setFocused('roll')} onBlur={() => setFocused(null)} /></div>
                    <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Institution</label><input value={form.institution} onChange={e => set('institution', e.target.value)} placeholder="SRMCEM" style={inp('inst')} onFocus={() => setFocused('inst')} onBlur={() => setFocused(null)} /></div>
                  </div>
                </>}

                {isEducator && <>
                  <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Qualification * <span style={{ color: t.textMuted }}>(M.Tech / Ph.D etc)</span></label><input value={form.qualification} onChange={e => set('qualification', e.target.value)} placeholder="e.g. Ph.D. Computer Science, IIT Delhi" style={inp('qual')} onFocus={() => setFocused('qual')} onBlur={() => setFocused(null)} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Experience</label><input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="e.g. 8 years" style={inp('exp')} onFocus={() => setFocused('exp')} onBlur={() => setFocused(null)} /></div>
                    <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>LinkedIn</label><input value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)} placeholder="linkedin.com/in/..." style={inp('li')} onFocus={() => setFocused('li')} onBlur={() => setFocused(null)} /></div>
                  </div>
                  <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Expertise Areas <span style={{ color: t.textMuted }}>(comma-separated)</span></label><input value={form.expertise} onChange={e => set('expertise', e.target.value)} placeholder="e.g. Data Structures, Python, ML" style={inp('exp2')} onFocus={() => setFocused('exp2')} onBlur={() => setFocused(null)} /></div>
                  <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Short Bio</label><textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell students about yourself..." rows={2} style={{ ...inp('bio'), resize: 'none' }} onFocus={() => setFocused('bio')} onBlur={() => setFocused(null)} /></div>
                  <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: t.warning }}>⚠️ Educator accounts require admin verification (24–48h) before you can publish courses.</div>
                </>}

                <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Password *</label>
                  <div style={{ position: 'relative' }}><input value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" type={showPass ? 'text' : 'password'} style={{ ...inp('pass'), paddingRight: 44 }} onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} /><button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textSub, fontSize: 15 }}>{showPass ? '🙈' : '👁'}</button></div></div>
                <div><label style={{ color: t.textSub, fontSize: 11, display: 'block', marginBottom: 4, fontWeight: 600 }}>Confirm Password *</label><input value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" type="password" style={inp('conf')} onFocus={() => setFocused('conf')} onBlur={() => setFocused(null)} onKeyDown={e => e.key === 'Enter' && handleRegister()} /></div>
              </div>
            </>
          )}

          {error && <div style={{ background: t.dangerSoft, border: `1px solid ${t.danger}35`, borderRadius: 11, padding: '10px 14px', marginTop: 14, color: t.danger, fontSize: 13, animation: 'popIn .25s ease' }}>⚠️ {error}</div>}

          <button onClick={isLogin ? handleLogin : handleRegister} disabled={loading} style={{ width: '100%', marginTop: 18, padding: '13px', fontFamily: 'Plus Jakarta Sans,sans-serif', background: loading ? t.border : `linear-gradient(135deg,${t.accent},#7c3aed)`, border: 'none', borderRadius: 13, color: loading ? t.textSub : '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 6px 28px ${t.accent}45`, transition: 'all .2s' }}>
            {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Spinner />Please wait...</span> : isLogin ? 'Sign In →' : isEducator ? '📋 Register & Await Approval →' : '🎓 Create Account →'}
          </button>
          <p style={{ color: t.textSub, fontSize: 13, textAlign: 'center', marginTop: 14 }}>
            {isLogin ? 'No account? ' : 'Have an account? '}
            <span onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); if (isLogin) setStep('role') }} style={{ color: t.accent, cursor: 'pointer', fontWeight: 700 }}>{isLogin ? 'Register here' : 'Sign in'}</span>
          </p>
          {/* {isLogin && <div style={{ background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 10, padding: '8px 14px', marginTop: 12, color: t.textMuted, fontSize: 11, textAlign: 'center' }}> */}
            {/* 🛡️ Admin login: <strong style={{ color: t.textSub }}>admin@eduai.com</strong> / <strong style={{ color: t.textSub }}>admin123</strong> */}
          {/* </div>} */}
        </Card>
        
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, user, onLogout, t, isDark, onToggle }) {
  const isStudent = user.role === 'student'
  const isEducator = user.role === 'educator'
  const isAdmin = user.role === 'admin'

  const studentTabs = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'marketplace', icon: '🛒', label: 'Marketplace' },
    { id: 'my-courses', icon: '📚', label: 'My Learning' },
    { id: 'quiz', icon: '✏️', label: 'Quizzes' },
    { id: 'ai-tutor', icon: '🤖', label: 'AI Tutor', badge: 'AI' },
    { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
    { id: 'achievements', icon: '🎖️', label: 'Achievements' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'subscription', icon: '👑', label: 'Subscription', badge: '⚡' },
  ]
  const educatorTabs = [
    { id: 'edu-dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'my-courses-edu', icon: '🎬', label: 'My Courses' },
    { id: 'create-course', icon: '➕', label: 'Create Course' },
    { id: 'edu-analytics', icon: '📊', label: 'Analytics' },
    { id: 'wallet', icon: '💰', label: 'Wallet' },
    { id: 'edu-profile', icon: '👤', label: 'Profile' },
  ]
  const adminTabs = [
    { id: 'admin', icon: '🛡️', label: 'Admin Panel' },
  ]
  const tabs = isAdmin ? adminTabs : isEducator ? educatorTabs : studentTabs
  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const lvl = isStudent ? getLvl(user.xp || 0) : null

  return (
    <aside style={{ width: 248, background: t.bgSidebar, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0, height: '100vh', position: 'sticky', top: 0, transition: 'background .35s,border-color .35s', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${t.border}`, background: t.mode==='dark' ? `linear-gradient(180deg,${t.bgHover},${t.bgSidebar})` : 'linear-gradient(180deg,#ebe8ff,#faf9ff)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: t.g1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:`0 4px 14px ${t.accent}50`, flexShrink:0 }}>⚡</div>
            <div><div style={{ color: t.text, fontFamily: 'Lora,serif', fontWeight: 700, fontSize: 15 }}>EduAI</div><div style={{ color: t.textMuted, fontSize: 9, letterSpacing: .5, fontWeight:600 }}>v6.0 PLATFORM</div></div>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <NotificationBell user={user} t={t} />
            <TToggle isDark={isDark} onToggle={onToggle} t={t} />
          </div>
        </div>
        {/* Student XP bar */}
        {isStudent && lvl && (
          <div style={{ background: `linear-gradient(135deg,${t.bgHover},${t.bgCard})`, borderRadius: 14, padding: '11px 13px', border: `1px solid ${t.accent}25`, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', marginBottom: 7 }}>
              <span style={{ color: lvl.cur.color, fontSize: 12, fontWeight: 800 }}>⭐ Lv.{lvl.cur.level} {lvl.cur.title}</span>
              <span style={{ background: t.g3, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontSize: 11, fontWeight: 900 }}>{user.xp || 0} XP</span>
            </div>
            <PBar v={lvl.pct} color={lvl.cur.color} t={t} h={6} gradient={t.g1} />
            {lvl.nxt && <div style={{ color:t.textMuted, fontSize:9, marginTop:5, textAlign:'right' }}>{lvl.nxt.min - (user.xp||0)} XP to {lvl.nxt.title}</div>}
          </div>
        )}
        {/* Streak */}
        {isStudent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', background: (user.streak || 0) > 0 ? t.warningSoft : t.bgHover, borderRadius: 12, border: `1px solid ${(user.streak || 0) > 0 ? t.warning + '50' : t.border}`, transition:'all .3s' }}>
            <span style={{ fontSize: 20, animation: (user.streak || 0) > 0 ? 'streakPop 2s infinite' : 'none' }}>🔥</span>
            <div style={{ flex:1 }}>
              <div style={{ color: (user.streak||0)>0 ? t.warning : t.text, fontSize: 12, fontWeight: 800 }}>{user.streak || 0} Day Streak</div>
              <div style={{ color: t.textSub, fontSize: 10 }}>{(user.streak||0)>6?'On fire! 🔥':(user.streak||0)>2?'Keep going!':'Study today to start!'}</div>
            </div>
            {(user.streak||0)>0 && <span style={{ background: t.g3, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontSize:12, fontWeight:900 }}>+{user.streak}🔥</span>}
          </div>
        )}
        {/* Educator status */}
        {isEducator && (
          <div style={{ background: user.educatorStatus === 'approved' ? t.successSoft : user.educatorStatus === 'rejected' ? t.dangerSoft : t.warningSoft, border: `1px solid ${user.educatorStatus === 'approved' ? t.success+'40' : user.educatorStatus === 'rejected' ? t.danger+'40' : t.warning+'40'}`, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ color: user.educatorStatus === 'approved' ? t.success : user.educatorStatus === 'rejected' ? t.danger : t.warning, fontSize: 12, fontWeight: 800 }}>
              {user.educatorStatus === 'approved' ? '✅ Verified Educator' : user.educatorStatus === 'rejected' ? '❌ Application Rejected' : '⏳ Pending Admin Review'}
            </div>
            <div style={{ color: t.textSub, fontSize: 10, marginTop: 3 }}>
              {user.educatorStatus === 'approved' ? `Wallet: ₹${user.walletBalance || 0}` : user.educatorStatus === 'rejected' ? (user.adminNote || 'Check inbox for details') : 'Check inbox for updates'}
            </div>
          </div>
        )}
      </div>

      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button key={tab.id} onClick={() => setActive(tab.id)} className={`nav-btn ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 13, border: isActive ? 'none' : `1px solid transparent`, cursor: 'pointer', marginBottom: 2, fontFamily: 'Plus Jakarta Sans,sans-serif', textAlign: 'left', background: isActive ? t.g1 : 'transparent', color: isActive ? '#fff' : t.textSub, fontSize: 13, fontWeight: isActive ? 700 : 500, boxShadow: isActive ? `0 6px 20px ${t.accent}50` : 'none', transition: 'all .18s' }}>
              <span style={{ fontSize: 16, flexShrink: 0, filter: isActive ? 'none' : 'grayscale(.4)' }}>{tab.icon}</span>
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.badge && <span style={{ background: isActive ? '#ffffff30' : t.accentSoft, color: isActive ? '#fff' : t.accent, fontSize: 9, padding: '2px 7px', borderRadius: 99, fontWeight: 800, letterSpacing:.3 }}>{tab.badge}</span>}
              {isActive && <span style={{ width:5, height:5, borderRadius:'50%', background:'#ffffff60', flexShrink:0 }} />}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '12px 12px 14px', borderTop: `1px solid ${t.border}`, background: t.mode==='dark' ? 'linear-gradient(180deg,#111019,#0d0d12)' : 'linear-gradient(180deg,#faf9ff,#f5f4ff)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 14, background: t.bgHover, marginBottom: 8, border:`1px solid ${t.border}` }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.g1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13, flexShrink: 0, boxShadow:`0 4px 12px ${t.accent}50` }}>{initials}</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ color: t.text, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ color: t.accent, fontSize: 10, fontWeight:600 }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width: '100%', padding: '8px', borderRadius: 11, border: `1px solid ${t.border}`, background: 'transparent', color: t.textSub, cursor: 'pointer', fontSize: 12, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600, transition: 'all .18s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.danger; e.currentTarget.style.color = t.danger; e.currentTarget.style.background = t.dangerSoft }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub; e.currentTarget.style.background = 'transparent' }}>⎋ Sign Out</button>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKETPLACE
// ─────────────────────────────────────────────────────────────────────────────
function Marketplace({ user, onEnroll, onPurchase, onSubscribe, setActive, setViewCourse, t }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [level, setLevel] = useState('All')
  const [priceF, setPriceF] = useState('All')
  const enrolled = user.enrolledCourses || []
  const hasActiveSub = user.subscription?.status === 'active' && new Date(user.subscription?.endDate) > new Date()

  // Merge demo courses with any admin-approved educator courses
  const allCourses = getAllCourses()

  const cats = ['All', 'CS Core', 'Full Stack', 'AI/ML', 'General']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  const filtered = allCourses.filter(c => {
    if (cat !== 'All' && c.category !== cat) return false
    if (level !== 'All' && c.level !== level) return false
    if (priceF === 'Free' && !c.isFree) return false
    if (priceF === 'Paid' && c.isFree) return false
    if (priceF === 'Subscription' && c.contentModel !== 'subscription') return false
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.instructor.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const isEnrolled = (id) => enrolled.some(e => e.courseId === id || e === id)

  const getActionButton = (c, alreadyIn) => {
    if (alreadyIn) return (
      <button onClick={() => { setViewCourse(c); setActive('my-courses') }} style={{ width: '100%', padding: '10px', background: t.successSoft, border: `1px solid ${t.success}40`, color: t.success, borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>✅ Continue Learning →</button>
    )
    if (c.contentModel === 'subscription') {
      if (hasActiveSub) return (
        <button onClick={() => onEnroll(c)} style={{ width: '100%', padding: '10px', background: `linear-gradient(135deg,#f59e0b,#d97706)`, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>👑 Access with Subscription</button>
      )
      return (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setViewCourse(c); setActive('marketplace-course') }} style={{ flex: 1, padding: '10px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Preview</button>
          <button onClick={onSubscribe} style={{ flex: 2, padding: '10px', background: `linear-gradient(135deg,#f59e0b,#d97706)`, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>👑 Subscribe to Access</button>
        </div>
      )
    }
    if (c.isFree) return (
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { setViewCourse(c); setActive('marketplace-course') }} style={{ flex: 1, padding: '10px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Preview</button>
        <button onClick={() => onEnroll(c)} style={{ flex: 2, padding: '10px', background: `linear-gradient(135deg,${t.success},#059669)`, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: `0 4px 14px ${t.success}40` }}>Enroll Free 🎓</button>
      </div>
    )
    // PAID course — if user has active subscription, no purchase needed
    if (hasActiveSub) return (
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { setViewCourse(c); setActive('marketplace-course') }} style={{ flex: 1, padding: '10px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Preview</button>
        <button onClick={() => onEnroll(c)} style={{ flex: 2, padding: '10px', background: `linear-gradient(135deg,#f59e0b,#d97706)`, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow:`0 4px 14px #f59e0b40` }}>👑 Free with Subscription</button>
      </div>
    )
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { setViewCourse(c); setActive('marketplace-course') }} style={{ flex: 1, padding: '10px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Preview</button>
        <button onClick={() => onPurchase(c)} style={{ flex: 2, padding: '10px', background: `linear-gradient(135deg,${t.accent},#7c3aed)`, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: `0 4px 14px ${t.accent}40` }}>Buy ₹{c.price} 💳</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 32, animation: 'fadeUp .4s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, margin: 0 }}>🛒 Course Marketplace</h2>
        <p style={{ color: t.textSub, fontSize: 14, marginTop: 5 }}>Discover courses from verified educators</p>
      </div>

      {/* Subscription banner */}
      {!hasActiveSub && (
        <div onClick={onSubscribe} style={{ background: `linear-gradient(135deg,#f59e0b18,#d9770612)`, border: `1px solid #f59e0b40`, borderRadius: 18, padding: '16px 22px', marginBottom: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, transition: 'all .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#f59e0b80'} onMouseLeave={e => e.currentTarget.style.borderColor = '#f59e0b40'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👑</div>
            <div>
              <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: 15 }}>Unlock All Subscription Courses</div>
              <div style={{ color: t.textSub, fontSize: 12, marginTop: 2 }}>Pro ₹299/month · Premium ₹1999/year · Cancel anytime</div>
            </div>
          </div>
          <div style={{ background: `linear-gradient(135deg,#f59e0b,#d97706)`, color: '#fff', padding: '9px 20px', borderRadius: 11, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>View Plans →</div>
        </div>
      )}
      {hasActiveSub && (
        <div style={{ background: `linear-gradient(135deg,#f59e0b18,#d9770612)`, border: `1px solid #f59e0b40`, borderRadius: 14, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>👑</span>
          <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 14 }}>{user.subscription.plan.toUpperCase()} Active — Full access until {new Date(user.subscription.endDate).toLocaleDateString()}</div>
        </div>
      )}

      {/* Search & filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: t.textSub, fontSize: 15 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or instructors..." style={{ width: '100%', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, color: t.text, padding: '10px 14px 10px 40px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} />
        </div>
        {[{ val: cat, set: setCat, opts: cats }, { val: level, set: setLevel, opts: levels }, { val: priceF, set: setPriceF, opts: ['All', 'Free', 'Paid', 'Subscription'] }].map(({ val, set, opts }, idx) => (
          <select key={idx} value={val} onChange={e => set(e.target.value)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, color: t.textSub, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', cursor: 'pointer' }}>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Course grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {filtered.map((c, i) => {
          const alreadyIn = isEnrolled(c._id)
          const isSubscriptionCourse = c.contentModel === 'subscription'
          return (
            <div key={c._id} className="card-lift" style={{ background: t.bgCard, borderRadius: 22, border: `1px solid ${isSubscriptionCourse ? '#f59e0b40' : t.border}`, overflow: 'hidden', boxShadow: t.shadowCard, animation: `fadeUp .5s ease ${i * .05}s both`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ height: 140, overflow: 'hidden' }}>
                  <img src={getCourseThumb(c)} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
                    onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: isSubscriptionCourse ? t.warning : c.color }} />
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
                  <Badge text={c.category} color={c.color} />
                  {isSubscriptionCourse && <Badge text="PRO" color={t.warning} />}
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Badge text={c.level} color={t.textSub} />
                </div>
                <div style={{ padding: '14px 16px 8px' }}>
                  <h3 style={{ color: t.text, fontSize: 15, fontFamily: 'Lora,serif', fontWeight: 700, marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ color: t.textSub, fontSize: 12 }}>by {c.instructor}</p>
                </div>
              </div>

              <div style={{ padding: '14px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: t.textSub, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>{c.shortDesc}</p>
                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
                    <span style={{ color: t.text, fontSize: 13, fontWeight: 700 }}>{c.averageRating}</span>
                    <span style={{ color: t.textSub, fontSize: 11 }}>({fmt(c.totalReviews)})</span>
                  </div>
                  <span style={{ color: t.textSub, fontSize: 12 }}>👥 {fmt(c.totalEnrollments)}</span>
                  <span style={{ color: t.textSub, fontSize: 12 }}>🎬 {c.videos.length} videos</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {(c.tags || []).slice(0, 3).map(tag => <span key={tag} style={{ background: t.bgHover, color: t.textSub, fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>#{tag}</span>)}
                </div>
                <div style={{ background: t.warningSoft, color: t.warning, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, marginBottom: 16, width: 'fit-content' }}>⚡ +{c.xpPerVideo} XP per video</div>
                  <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      {isSubscriptionCourse
                        ? <span style={{ color: '#f59e0b', fontSize: 15, fontWeight: 900 }}>👑 Subscription</span>
                        : c.isFree
                          ? <span style={{ color: t.success, fontSize: 20, fontWeight: 900 }}>FREE</span>
                          : hasActiveSub
                            ? <span style={{ color: '#f59e0b', fontSize: 14, fontWeight: 800 }}>👑 Included in Plan</span>
                            : <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                <span style={{ color: t.text, fontSize: 20, fontWeight: 900 }}>₹{c.price}</span>
                              </div>
                      }
                    </div>
                    <span style={{ color: t.textSub, fontSize: 11 }}>🌐 {c.language}</span>
                  </div>
                  {getActionButton(c, alreadyIn)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: t.textSub }}><div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>No courses found</div><div style={{ fontSize: 13, marginTop: 6 }}>Try different filters or search terms</div></div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION MODAL — Pro & Premium plans with Razorpay-ready payment
// ─────────────────────────────────────────────────────────────────────────────
function SubscriptionModal({ onConfirm, onClose, t, currentPlan }) {
  const [selected, setSelected] = useState('pro')
  const [step, setStep] = useState('plans') // plans → payment → success
  const [method, setMethod] = useState('upi')
  const [loading, setLoading] = useState(false)

  const plans = [
    { id: 'pro', name: 'Pro', price: 299, period: 'month', color: t.accent, icon: '⚡', features: ['All subscription courses', 'Unlimited AI Tutor', 'Downloadable notes', 'Certificate of completion', 'Priority support'] },
    { id: 'premium', name: 'Premium', price: 1999, period: 'year', color: '#f59e0b', icon: '👑', features: ['Everything in Pro', '1 year access', 'Offline downloads', 'Mentor sessions', 'Job placement support', 'Best Value — Save ₹1,589'] },
  ]

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    // In production, trigger Razorpay here:
    // const { data } = await fetch('/api/payment/create-order', { method:'POST', body: JSON.stringify({ amount: plan.price, plan: selected }) })
    // const rzp = new window.Razorpay({ key: data.key, amount: data.order.amount, ... })
    // rzp.open()
    setLoading(false)
    setStep('success')
  }

  const plan = plans.find(p => p.id === selected)

  if (step === 'success') return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: 20 }}>
      <div style={{ background: t.bgCard, borderRadius: 24, width: '100%', maxWidth: 420, border: `1px solid ${t.border}`, boxShadow: t.shadow, animation: 'popIn .3s ease', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{plan.name} Activated!</h2>
        <p style={{ color: t.textSub, marginBottom: 20 }}>You now have full access to all {plan.name} content.</p>
        <div style={{ background: plan.color + '15', border: `1px solid ${plan.color}40`, borderRadius: 14, padding: '14px 20px', marginBottom: 24 }}>
          <div style={{ color: plan.color, fontWeight: 800, fontSize: 16 }}>{plan.icon} {plan.name} Plan</div>
          <div style={{ color: t.textSub, fontSize: 13, marginTop: 4 }}>Valid for {plan.period === 'month' ? '30 days' : '1 year'}</div>
        </div>
        <button onClick={() => { onConfirm(selected); onClose() }} style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}bb)`, border: 'none', color: '#fff', padding: '13px 32px', borderRadius: 13, cursor: 'pointer', fontSize: 15, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Start Learning →</button>
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: t.bgCard, borderRadius: 24, width: '100%', maxWidth: step === 'plans' ? 640 : 460, border: `1px solid ${t.border}`, boxShadow: t.shadow, animation: 'popIn .3s ease', overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: t.text, fontSize: 19, fontWeight: 900, margin: 0 }}>🔓 Unlock Premium Content</h2>
            <p style={{ color: t.textSub, fontSize: 13, margin: '4px 0 0' }}>Access all subscription courses and features</p>
          </div>
          <button onClick={onClose} style={{ background: t.bgHover, border: 'none', color: t.textSub, width: 34, height: 34, borderRadius: 9, cursor: 'pointer', fontSize: 17 }}>✕</button>
        </div>

        {step === 'plans' && (
          <div style={{ padding: '24px 28px' }}>
            {currentPlan && currentPlan !== 'free' && (
              <div style={{ background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 11, padding: '10px 16px', marginBottom: 18, color: t.success, fontSize: 13, fontWeight: 700 }}>
                ✅ Current plan: {currentPlan.toUpperCase()} — active
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
              {plans.map(p => (
                <div key={p.id} onClick={() => setSelected(p.id)} style={{ borderRadius: 18, border: `2px solid ${selected === p.id ? p.color : t.border}`, padding: '20px 18px', cursor: 'pointer', background: selected === p.id ? p.color + '12' : t.bgInput, transition: 'all .2s', position: 'relative' }}>
                  {p.id === 'premium' && <div style={{ position: 'absolute', top: -1, right: 14, background: p.color, color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 10px', borderRadius: '0 0 8px 8px' }}>BEST VALUE</div>}
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ color: p.color, fontWeight: 900, fontSize: 17 }}>{p.name}</div>
                  <div style={{ color: t.text, fontWeight: 900, fontSize: 26, margin: '4px 0' }}>₹{p.price}<span style={{ fontSize: 13, color: t.textSub, fontWeight: 500 }}>/{p.period}</span></div>
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {p.features.map(f => <div key={f} style={{ color: t.textSub, fontSize: 12, display: 'flex', alignItems: 'flex-start', gap: 6 }}><span style={{ color: p.color, flexShrink: 0 }}>✓</span>{f}</div>)}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('payment')} style={{ width: '100%', padding: '13px', background: `linear-gradient(135deg,${plan.color},${plan.color}bb)`, border: 'none', borderRadius: 13, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: `0 6px 24px ${plan.color}40` }}>
              Subscribe {plan.icon} {plan.name} for ₹{plan.price}/{plan.period} →
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ background: plan.color + '15', border: `1px solid ${plan.color}40`, borderRadius: 13, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ color: t.text, fontWeight: 800 }}>{plan.icon} {plan.name} Plan</div><div style={{ color: t.textSub, fontSize: 12 }}>{plan.period === 'month' ? '30 days access' : '1 year access'}</div></div>
              <div style={{ color: plan.color, fontWeight: 900, fontSize: 22 }}>₹{plan.price}</div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ color: t.text, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Payment Method</div>
              {[{ id: 'upi', icon: '📱', label: 'UPI / QR Code', sub: 'GPay, PhonePe, Paytm' }, { id: 'card', icon: '💳', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay' }, { id: 'netbank', icon: '🏦', label: 'Net Banking', sub: 'All major banks' }].map(m => (
                <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 15px', borderRadius: 12, border: `1.5px solid ${method === m.id ? plan.color : t.border}`, cursor: 'pointer', marginBottom: 8, background: method === m.id ? plan.color + '10' : t.bgInput, transition: 'all .2s' }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{m.label}</div><div style={{ color: t.textSub, fontSize: 11 }}>{m.sub}</div></div>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === m.id ? plan.color : t.border}`, background: method === m.id ? plan.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{method === m.id && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}</div>
                </div>
              ))}
            </div>
            <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}30`, borderRadius: 10, padding: '8px 14px', marginBottom: 16, color: t.textSub, fontSize: 12 }}>🔒 Demo mode — no real payment. In production, Razorpay SDK processes the transaction.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('plans')} style={{ padding: '12px 20px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 12, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }}>← Back</button>
              <button onClick={handlePay} disabled={loading} style={{ flex: 1, padding: '13px', background: loading ? t.border : `linear-gradient(135deg,${plan.color},${plan.color}bb)`, border: 'none', borderRadius: 13, color: loading ? t.textSub : '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Spinner />Processing...</span> : `Pay ₹${plan.price} →`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PurchaseModal({ course, onConfirm, onClose, t }) {
  const [step, setStep] = useState('review') // review → payment → success
  const [method, setMethod] = useState('upi')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setStep('success')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: 20 }} onClick={e => e.target === e.currentTarget && step !== 'success' && onClose()}>
      <div style={{ background: t.bgCard, borderRadius: 24, width: '100%', maxWidth: 460, border: `1px solid ${t.border}`, boxShadow: t.shadow, animation: 'popIn .3s ease', overflow: 'hidden' }}>
        {step === 'success' ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Purchase Successful!</h2>
            <p style={{ color: t.textSub, marginBottom: 6 }}>You now have full access to</p>
            <p style={{ color: t.accent, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>{course.title}</p>
            <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 12, padding: '12px 20px', marginBottom: 24, color: t.warning, fontSize: 14, fontWeight: 700 }}>⚡ +50 XP Earned for first purchase!</div>
            <button onClick={() => { onConfirm(course); onClose() }} style={{ background: `linear-gradient(135deg,${t.accent},#7c3aed)`, border: 'none', color: '#fff', padding: '13px 32px', borderRadius: 13, cursor: 'pointer', fontSize: 15, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Start Learning →</button>
          </div>
        ) : (
          <>
            <div style={{ background: course.color + '18', padding: '20px 24px', borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 36 }}>{course.icon}</span>
                <div><div style={{ color: t.text, fontWeight: 800, fontSize: 16 }}>{course.title}</div><div style={{ color: t.textSub, fontSize: 12 }}>by {course.instructor}</div></div>
                <button onClick={onClose} style={{ marginLeft: 'auto', background: t.bgHover, border: 'none', color: t.textSub, width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '14px 18px', background: t.bgHover, borderRadius: 12 }}>
                <span style={{ color: t.textSub }}>Course Price</span><span style={{ color: t.text, fontWeight: 700 }}>₹{course.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, padding: '14px 18px', background: t.accentSoft, border: `1px solid ${t.accent}30`, borderRadius: 12 }}>
                <span style={{ color: t.accent, fontWeight: 700 }}>Total Payable</span><span style={{ color: t.accent, fontWeight: 900, fontSize: 18 }}>₹{course.price}</span>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ color: t.text, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>Payment Method</div>
                {[{ id: 'upi', icon: '📱', label: 'UPI / QR Code', sub: 'GPay, PhonePe, Paytm' }, { id: 'card', icon: '💳', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay' }, { id: 'netbank', icon: '🏦', label: 'Net Banking', sub: 'All major banks' }].map(m => (
                  <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${method === m.id ? t.accent : t.border}`, cursor: 'pointer', marginBottom: 8, background: method === m.id ? t.accentSoft : t.bgInput, transition: 'all .2s' }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}><div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{m.label}</div><div style={{ color: t.textSub, fontSize: 11 }}>{m.sub}</div></div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === m.id ? t.accent : t.border}`, background: method === m.id ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{method === m.id && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}30`, borderRadius: 10, padding: '8px 14px', marginBottom: 16, color: t.textSub, fontSize: 12 }}>🔒 Demo mode — no real payment is processed</div>

              <button onClick={handlePay} disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? t.border : `linear-gradient(135deg,${t.accent},#7c3aed)`, border: 'none', borderRadius: 13, color: loading ? t.textSub : '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><Spinner />Processing...</span> : `Pay ₹${course.price} →`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function StudentDashboard({ user, setActive, setViewCourse, t }) {
  const firstName = user.name.split(' ')[0]
  const enrolled = user.enrolledCourses || []
  const enrolledCourses = getAllCourses().filter(c => enrolled.some(e => e.courseId === c._id || e === c._id))
  const progresses = enrolledCourses.map(c => CP(c, user.courseProgress?.[c._id]))
  const lvl = getLvl(user.xp || 0)
  const today = TODAY()
  const studiedToday = user.lastStudyDate === today

  return (
    <div style={{ padding: 32, maxWidth: 1100, animation: 'fadeUp .4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ color: t.text, fontSize: 26, fontWeight: 900, margin: 0 }}>Welcome back, {firstName} 👋</h1>
          <p style={{ color: t.textSub, fontSize: 14, marginTop: 5 }}>{user.institution || user.rollNo || 'Student'} · Keep learning!</p>
        </div>
        <div style={{ background: studiedToday ? t.successSoft : t.warningSoft, border: `1px solid ${studiedToday ? t.success : t.warning}40`, borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>{studiedToday ? '✅' : '🎯'}</span>
          <div><div style={{ color: studiedToday ? t.success : t.warning, fontWeight: 800, fontSize: 14 }}>{studiedToday ? 'Goal Complete!' : 'Daily Goal'}</div><div style={{ color: t.textSub, fontSize: 12 }}>{studiedToday ? 'Streak safe 🔥' : 'Watch 1 video'}</div></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 26, flexWrap: 'wrap' }}>
        <StatCard label="Enrolled Courses" value={enrolledCourses.length} icon="📚" color={t.accent} sub="Active" t={t} d={0} />
        <StatCard label="Total XP" value={user.xp || 0} icon="⚡" color={t.warning} sub={`Lv.${lvl.cur.level} ${lvl.cur.title}`} t={t} d={.05} />
        <StatCard label="Study Streak" value={`${user.streak || 0}d`} icon="🔥" color="#ef4444" sub={user.streak >= 7 ? '🏆 Week hero!' : 'days running'} t={t} d={.1} />
        <StatCard label="Badges" value={user.badges?.length || 0} icon="🏅" color={t.purple} sub={`of ${BADGES.length}`} t={t} d={.15} />
      </div>

      {/* Level bar */}
      <Card t={t} style={{ padding: '18px 22px', marginBottom: 22, animation: 'fadeUp .5s ease .2s both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: lvl.cur.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>⭐</div>
            <div><div style={{ color: t.text, fontWeight: 800 }}>Level {lvl.cur.level} — {lvl.cur.title}</div><div style={{ color: t.textSub, fontSize: 12 }}>{lvl.nxt ? `${lvl.nxt.min - (user.xp || 0)} XP to ${lvl.nxt.title}` : '🏆 Max level!'}</div></div>
          </div>
          <div style={{ color: lvl.cur.color, fontSize: 22, fontWeight: 900 }}>{user.xp || 0} XP</div>
        </div>
        <PBar v={lvl.pct} color={lvl.cur.color} t={t} />
      </Card>

      {/* Enrolled courses */}
      {enrolledCourses.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ color: t.text, fontSize: 18, fontWeight: 800, margin: 0 }}>Continue Learning</h2>
            <button onClick={() => setActive('my-courses')} style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.textSub, padding: '6px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }} onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub }}>View All →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: 14 }}>
            {enrolledCourses.map((c, i) => {
              const { done, total, pct, isComplete } = progresses[i] || CP(c, [])
              return (
                <div key={c._id} className="card-lift" onClick={() => { setViewCourse(c); setActive('my-courses') }}
                  style={{ background: t.bgCard, borderRadius: 18, padding: 18, border: `1px solid ${t.border}`, cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: t.shadowCard, animation: `fadeUp .5s ease ${.05 * i + .25}s both` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: isComplete ? t.success : c.color }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{c.icon}</span>
                    {isComplete ? <Badge text="✓ Done" color={t.success} /> : <Badge text={c.category} color={c.color} />}
                  </div>
                  <h3 style={{ color: t.text, fontSize: 13, fontWeight: 700, margin: '0 0 3px' }}>{c.title}</h3>
                  <p style={{ color: t.textSub, fontSize: 11, margin: '0 0 12px' }}>{c.instructor}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: t.textSub, fontSize: 11 }}>{done}/{total} videos</span>
                    <span style={{ color: isComplete ? t.success : c.color, fontSize: 11, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <PBar v={pct} color={isComplete ? t.success : c.color} t={t} />
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <Card t={t} style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🎓</div>
          <h3 style={{ color: t.text, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Start Your Learning Journey</h3>
          <p style={{ color: t.textSub, marginBottom: 20 }}>Browse our course marketplace to enroll in free and paid courses.</p>
          <button onClick={() => setActive('marketplace')} style={{ background: `linear-gradient(135deg,${t.accent},#7c3aed)`, border: 'none', color: '#fff', padding: '12px 28px', borderRadius: 13, cursor: 'pointer', fontSize: 15, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Browse Courses →</button>
        </Card>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color, sub, t, d = 0 }) {
  return <Card t={t} style={{ padding: '18px 22px', flex: 1, minWidth: 140, animation: `fadeUp .5s ease ${d}s both` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div><div style={{ color: t.textMuted, fontSize: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{label}</div><div style={{ color: t.text, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>{sub && <div style={{ color: t.textSub, fontSize: 11, marginTop: 5 }}>{sub}</div>}</div>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{icon}</div>
    </div>
  </Card>
}

// ─────────────────────────────────────────────────────────────────────────────
// MY LEARNING (Student's enrolled courses + video player)
// ─────────────────────────────────────────────────────────────────────────────
function MyLearning({ user, viewCourse, setViewCourse, onWatchVideo, onGenerateNotes, t }) {
  const [view, setView] = useState('videos')
  const [notesModal, setNotesModal] = useState(null)
  const [showCertQuiz, setShowCertQuiz] = useState(false)
  const enrolled = user.enrolledCourses || []
  const enrolledCourses = getAllCourses().filter(c => enrolled.some(e => e.courseId === c._id || e === c._id))

  if (!viewCourse) return (
    <div style={{ padding: 32, animation: 'fadeUp .4s ease' }}>
      <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 20 }}>📚 My Learning</h2>
      {enrolledCourses.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: t.textSub }}><div style={{ fontSize: 48, marginBottom: 14 }}>📭</div><div style={{ fontSize: 16, color: t.text, fontWeight: 700 }}>No courses yet</div><div style={{ fontSize: 13, marginTop: 6 }}>Go to Marketplace to enroll</div></div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {enrolledCourses.map((c, i) => {
          const { done, total, pct, isComplete } = CP(c, user.courseProgress?.[c._id])
          return (
            <div key={c._id} className="card-lift" onClick={() => setViewCourse(c)} style={{ background: t.bgCard, borderRadius: 20, padding: 22, border: `1px solid ${t.border}`, cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: t.shadowCard, animation: `fadeUp .5s ease ${i * .06}s both` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: isComplete ? t.success : c.color }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 34 }}>{c.icon}</span>
                {isComplete ? <Badge text="✓ Complete" color={t.success} /> : <Badge text={`${pct}%`} color={c.color} />}
              </div>
              <h3 style={{ color: t.text, fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{c.title}</h3>
              <p style={{ color: t.textSub, fontSize: 12, marginBottom: 14 }}>{c.instructor} · {total} videos</p>
              <PBar v={pct} color={isComplete ? t.success : c.color} t={t} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
                <span style={{ color: t.textSub, fontSize: 11 }}>{done}/{total} watched</span>
                <span style={{ color: t.warning, fontSize: 11, fontWeight: 700 }}>+{c.xpPerVideo} XP/video</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Always normalize the course so educator-created courses have all required fields
  const c = normalizeCourse(viewCourse)
  const watched = user.courseProgress?.[c._id] || []
  const { done, total, pct, isComplete } = CP(c, watched)
  const hasActiveSub = user.subscription?.status === 'active' && new Date(user.subscription?.endDate) > new Date()
  const canWatch = (vid) => c.isFree || vid?.isFree || hasActiveSub || enrolled.some(e => e.courseId === c._id || e === c._id)

  return (
    <div style={{ padding: 32, maxWidth: 1000, animation: 'fadeUp .4s ease' }}>
      <button onClick={() => setViewCourse(null)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, color: t.textSub, padding: '7px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, marginBottom: 20, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600, transition: 'all .18s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }} onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub }}>← My Courses</button>

      <Card t={t} style={{ padding: 26, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: isComplete ? t.success : c.color }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div><div style={{ fontSize: 38, marginBottom: 8 }}>{c.icon}</div><h1 style={{ color: t.text, fontSize: 20, fontWeight: 900, margin: '0 0 4px' }}>{c.title}</h1><p style={{ color: t.textSub, fontSize: 13 }}>👨‍🏫 {c.instructor}</p><p style={{ color: t.warning, fontSize: 12, fontWeight: 700, marginTop: 4 }}>⚡ +{c.xpPerVideo} XP per video</p></div>
          <div style={{ textAlign: 'right' }}><div style={{ color: isComplete ? t.success : c.color, fontSize: 38, fontWeight: 900 }}>{pct}%</div><div style={{ color: t.textSub, fontSize: 11 }}>{isComplete ? '🎉 Complete!' : 'Progress'}</div></div>
        </div>
        <div style={{ marginTop: 18 }}><PBar v={pct} color={isComplete ? t.success : c.color} t={t} /><div style={{ color: t.textSub, fontSize: 12, marginTop: 7 }}>{done}/{total} videos · {total - done} remaining</div></div>
        {isComplete && <div style={{ marginTop: 14, background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 12, padding: '10px 16px', color: t.success, fontWeight: 700, fontSize: 14 }}>🎉 You've completed this course!</div>}
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: t.bgCard, borderRadius: 14, padding: 6, border: `1px solid ${t.border}`, width: 'fit-content' }}>
        {[['videos', 'Videos'], ['resources', 'Resources'], ['reviews', 'Reviews'], ['certificate', isComplete ? 'Take Exam' : 'Certificate']].map(([id, lbl]) => (
          <button key={id} onClick={() => setView(id)} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', background: view === id ? `linear-gradient(135deg,${c.color},${c.color}cc)` : 'transparent', color: view === id ? '#fff' : t.textSub, fontSize: 13, fontWeight: view === id ? 700 : 500, transition: 'all .2s', borderBottom: id==='certificate' && isComplete ? `2px solid ${t.warning}` : 'none' }}>{lbl}{id==='certificate' && isComplete ? ' 🏆' : ''}</button>
        ))}
      </div>

      {view === 'videos' && (
        <div>
          <p style={{ color: t.textSub, fontSize: 13, marginBottom: 16 }}>🎯 Watch videos to earn XP and increase completion. <span style={{ background: t.accentSoft, color: t.accent, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{done}/{total} done</span></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
            {c.videos.map(v => {
              const canPlay = canWatch(v)
              const isWatched = watched.includes(v.id)
              return <VideoCard key={v.id} v={v} watched={isWatched} canPlay={canPlay} courseColor={c.color} xp={c.xpPerVideo} onMark={() => canPlay && onWatchVideo(c._id, v.id)} onNotes={() => setNotesModal({ v, c })} hasNotes={!!(user.notes?.[`${c._id}_${v.id}`])} t={t} />
            })}
          </div>
        </div>
      )}

      {view === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(!c.resources || c.resources.length === 0) ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: t.textSub }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>No resources yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>The educator hasn't added resources to this course.</div>
            </div>
          ) : c.resources.map((r, i) => (
            <div key={i} style={{ background: t.bgCard, borderRadius: 13, padding: '14px 18px', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor = t.borderHover} onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: r.type === 'pdf' ? t.dangerSoft : t.warningSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{r.type === 'pdf' ? '📄' : '📝'}</div>
              <div style={{ flex: 1 }}><div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{r.name}</div><div style={{ color: t.textSub, fontSize: 11, textTransform: 'capitalize' }}>{r.type}</div></div>
              <button style={{ background: t.bgInput, border: `1px solid ${t.border}`, color: t.textSub, padding: '5px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }}>Open ↗</button>
            </div>
          ))}
        </div>
      )}

      {view === 'reviews' && <ReviewSection course={c} user={user} t={t} />}

      {view === 'certificate' && (
        <div style={{ textAlign: 'center', padding: '32px 20px' }}>
          {isComplete ? (
            <>
              <img src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=400&q=80" alt="Certificate" style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 16, marginBottom: 20, opacity: 0.9 }} />
              <h3 style={{ color: t.text, fontFamily: 'Lora,serif', fontSize: 20, marginBottom: 8 }}>Ready for Certification?</h3>
              <p style={{ color: t.textSub, fontSize: 14, marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' }}>You've completed all videos! Take the 50-question certification exam to earn your verified certificate.</p>
              <button onClick={() => setShowCertQuiz(true)} style={{ padding: '13px 32px', background: `linear-gradient(135deg,${t.accent},${t.purple})`, border: 'none', color: '#fff', borderRadius: 13, cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: `0 6px 24px ${t.accent}40` }}>Start Certification Exam 🎓</button>
            </>
          ) : (
            <>
              <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80" alt="Study" style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 14, marginBottom: 20, opacity: 0.7 }} />
              <h3 style={{ color: t.text, fontFamily: 'Lora,serif', fontSize: 18, marginBottom: 8 }}>Complete All Videos First</h3>
              <p style={{ color: t.textSub, fontSize: 13 }}>Watch all {total} videos to unlock the certification exam. You've completed {done}/{total} so far.</p>
            </>
          )}
        </div>
      )}

      {showCertQuiz && <CertificationQuiz course={c} user={user} onPass={(score) => { onWatchVideo(c._id, 'cert_passed') }} onClose={() => setShowCertQuiz(false)} t={t} />}

      {notesModal && <NotesModal v={notesModal.v} courseTitle={notesModal.c.title} existing={user.notes?.[`${notesModal.c._id}_${notesModal.v.id}`]} onSave={(notes) => { onGenerateNotes(notesModal.c._id, notesModal.v.id, notes); setNotesModal(null) }} onClose={() => setNotesModal(null)} t={t} />}
    </div>
  )
}

function VideoCard({ v, watched, canPlay, courseColor, xp, onMark, onNotes, hasNotes, t }) {
  const [showYT, setShowYT] = useState(false)
  const [prog, setProg] = useState(watched ? 100 : 0)
  const ref = useRef()
  const ytThumb = v.ytId ? `https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg` : null

  const handlePlay = () => {
    if (!canPlay) return
    if (v.ytId) { setShowYT(true); if (!watched) { setTimeout(() => { onMark() }, 3000) } }
    else if (!watched) {
      ref.current = setInterval(() => setProg(p => { if (p >= 100) { clearInterval(ref.current); onMark(); return 100 } return Math.min(p + 2, 100) }), 120)
    }
  }

  return (
    <div className="card-lift" style={{ background: t.bgCard, borderRadius: 14, border: `1.5px solid ${watched ? t.success + '40' : t.border}`, overflow: 'hidden', boxShadow: t.shadowCard }}>
      {showYT && v.ytId ? (
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${v.ytId}?autoplay=1&rel=0`}
            title={v.title} frameBorder="0" allowFullScreen
            allow="autoplay; encrypted-media"
            style={{ position: 'absolute', inset: 0 }}
          />
          <button onClick={() => setShowYT(false)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 13, zIndex: 10 }}>✕</button>
        </div>
      ) : (
        <div onClick={handlePlay} style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', cursor: canPlay ? 'pointer' : 'default', background: t.bgInput }}>
          {ytThumb ? (
            <img src={ytThumb} alt={v.title} className="yt-thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display='none' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg,${courseColor}22,${courseColor}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill={courseColor+"22"}/><path d="M20 16l14 8-14 8V16z" fill={courseColor}/></svg>
            </div>
          )}
          {!canPlay && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#fff" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#fff" strokeWidth="1.8"/></svg>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Purchase to unlock</span>
          </div>}
          {canPlay && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.15)', opacity: 0, transition: 'opacity .2s' }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: courseColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${courseColor}80` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
              </div>
            </div>
          )}
          {v.isFree && <div style={{ position: 'absolute', top: 8, left: 8, background: t.success, color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, letterSpacing: .5 }}>FREE PREVIEW</div>}
          {watched && <div style={{ position: 'absolute', top: 8, right: 8, background: t.success, color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>✓ WATCHED</div>}
          {prog > 0 && prog < 100 && <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${prog}%`, height: 3, background: courseColor }} />}
          {watched && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: t.success }} />}
        </div>
      )}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: t.text, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
          <div style={{ color: t.textSub, fontSize: 10, marginTop: 2 }}>{v.duration} · +{xp} XP</div>
        </div>
        <button onClick={onNotes} style={{ background: hasNotes ? t.purpleSoft : t.bgInput, border: `1px solid ${hasNotes ? t.purple+'40' : t.border}`, color: hasNotes ? t.purple : t.textSub, padding: '4px 9px', borderRadius: 7, cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Notes</button>
        {canPlay && !watched && <button onClick={() => { onMark() }} style={{ background: courseColor, border: 'none', color: '#fff', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Mark Done</button>}
        {watched && <svg width="18" height="18" viewBox="0 0 24 24" fill={t.success}><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke={t.success} strokeWidth="2" fill="none"/></svg>}
      </div>
    </div>
  )
}

function ReviewSection({ course, user, t }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isEnrolled = (user.enrolledCourses || []).some(e => e.courseId === course._id || e === course._id)

  return (
    <div>
      {isEnrolled && !submitted && (
        <Card t={t} style={{ padding: 20, marginBottom: 20 }}>
          <h4 style={{ color: t.text, fontWeight: 700, marginBottom: 12 }}>Leave a Review</h4>
          <div style={{ marginBottom: 12 }}><StarRating value={rating} onChange={setRating} t={t} /></div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience with this course..." rows={3} style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '10px 14px', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', resize: 'vertical', outline: 'none' }} />
          <div style={{ marginTop: 10 }}><Btn color={t.accent} onClick={() => { if (rating > 0) setSubmitted(true) }} size="sm">Submit Review ⭐</Btn></div>
        </Card>
      )}
      {submitted && <div style={{ background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 12, padding: '12px 18px', marginBottom: 20, color: t.success, fontWeight: 700 }}>✅ Review submitted! +50 XP earned.</div>}

      {/* Mock reviews */}
      {[{ name: 'Priya S.', rating: 5, comment: 'Excellent course! Explained everything very clearly.', date: '2 days ago' }, { name: 'Rahul K.', rating: 4, comment: 'Very helpful for placements. Highly recommended!', date: '1 week ago' }].map((r, i) => (
        <Card key={i} t={t} style={{ padding: '16px 20px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>{r.name[0]}</div>
              <div><div style={{ color: t.text, fontWeight: 700, fontSize: 13 }}>{r.name}</div><div style={{ color: '#f59e0b', fontSize: 12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div></div>
            </div>
            <span style={{ color: t.textMuted, fontSize: 11 }}>{r.date}</span>
          </div>
          <p style={{ color: t.textSub, fontSize: 13 }}>{r.comment}</p>
        </Card>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AI NOTES MODAL
// ─────────────────────────────────────────────────────────────────────────────
function NotesModal({ v, courseTitle, existing, onSave, onClose, t }) {
  const [notes, setNotes] = useState(existing || '')
  const [loading, setLoading] = useState(false)
  const generate = async () => {
    setLoading(true)
    const key = localStorage.getItem('eduai_grok_key') || ''
    if (!key) { setNotes('⚠️ No Grok API key found.\n\nGo to AI Tutor → Add your Grok API key first, then come back to generate notes.'); setLoading(false); return }
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: 'grok-3-mini',
          max_tokens: 900,
          messages: [
            { role: 'system', content: 'You are an expert CS professor. Generate concise study notes with: **Key Concepts**, **How It Works**, **Examples**, **Time/Space Complexity** (if applicable), **Common Mistakes**, **Quick Review**. Use **bold** for important terms.' },
            { role: 'user', content: `Generate study notes for "${v.title}" from the course "${courseTitle}".` }
          ]
        })
      })
      const d = await res.json()
      if (d.error) setNotes(`Error: ${d.error.message}`)
      else setNotes(d.choices?.[0]?.message?.content || 'No content returned.')
    } catch (e) { setNotes(`Connection error: ${e.message}`) }
    setLoading(false)
  }
  useEffect(() => { if (!existing) generate() }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998, padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: t.bgCard, borderRadius: 22, width: '100%', maxWidth: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column', border: `1px solid ${t.border}`, boxShadow: t.shadow, animation: 'popIn .3s ease' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ color: t.text, fontWeight: 800, fontSize: 16 }}>📝 AI Study Notes</div><div style={{ color: t.textSub, fontSize: 12 }}>{v.title}</div></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn color={t.purple} soft onClick={generate} disabled={loading} size="sm">{loading ? '⏳ Generating...' : '🔄 Regenerate'}</Btn>
            <Btn color={t.accent} onClick={() => { onSave(notes); onClose() }} size="sm">Save ✓</Btn>
            <button onClick={onClose} style={{ background: t.bgInput, border: `1px solid ${t.border}`, color: t.textSub, width: 32, height: 32, borderRadius: 9, cursor: 'pointer', fontSize: 15 }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {loading ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 0', color: t.textSub }}><Spinner color={t.purple} size={36} /><div>Generating notes with Grok AI...</div></div>
            : <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', minHeight: 340, background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 12, color: t.text, padding: 14, fontSize: 13, fontFamily: 'JetBrains Mono,monospace', resize: 'vertical', outline: 'none', lineHeight: 1.7 }} />}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATOR DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function EducatorDashboard({ user, setActive, t }) {
  const totalEarnings = user.totalRevenue || 0
  return (
    <div style={{ padding: 32, maxWidth: 1000, animation: 'fadeUp .4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: t.text, fontSize: 24, fontWeight: 900, margin: 0 }}>Welcome, {user.name.split(' ')[0]} 👨‍🏫</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <p style={{ color: t.textSub, fontSize: 14, margin: 0 }}>{user.qualification || 'Educator'} · {user.experience || ''}</p>
          {user.educatorStatus === 'approved' ? <Badge text="✅ Verified" color={t.success} /> : <Badge text="⏳ Pending Review" color={t.warning} />}
        </div>
      </div>

      {/* Verification alert */}
      {user.educatorStatus !== "approved" && (
        <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 16, padding: '18px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28 }}>⚠️</span>
          <div style={{ flex: 1 }}><div style={{ color: t.warning, fontWeight: 800, fontSize: 15 }}>Account Verification Pending</div><div style={{ color: t.textSub, fontSize: 13, marginTop: 4 }}>Your educator account is under review. Once approved, you can publish courses. This typically takes 24–48 hours.</div></div>
          <button onClick={() => setActive('edu-profile')} style={{ background: t.warning, border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>View Profile →</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, marginBottom: 26, flexWrap: 'wrap' }}>
        <StatCard label="Total Students" value={fmt(user.totalStudents || 0)} icon="👥" color={t.accent} sub="Enrolled" t={t} d={0} />
        <StatCard label="Wallet Balance" value={`₹${user.walletBalance || 0}`} icon="💰" color={t.success} sub="Ready to withdraw" t={t} d={.05} />
        <StatCard label="Total Earnings" value={`₹${fmt(totalEarnings)}`} icon="📈" color={t.warning} sub="All time" t={t} d={.1} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card-lift" onClick={() => setActive('create-course')} style={{ background: t.bgCard, borderRadius: 18, padding: '0', border: `1px solid ${t.border}`, cursor: 'pointer', overflow: 'hidden', boxShadow: t.shadowCard }}>
          <div style={{ height: 110, overflow: 'hidden' }}><img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
          <div style={{ padding: '18px 20px' }}>
            <h3 style={{ color: t.text, fontFamily: 'Lora,serif', fontWeight: 700, marginBottom: 6 }}>Create New Course</h3>
            <p style={{ color: t.textSub, fontSize: 13 }}>Share your knowledge — design a course and reach students</p>
            <div style={{ marginTop: 14, color: t.accent, fontSize: 13, fontWeight: 700 }}>Get Started →</div>
          </div>
        </div>
        <div className="card-lift" onClick={() => setActive('my-courses-edu')} style={{ background: t.bgCard, borderRadius: 18, padding: '0', border: `1px solid ${t.border}`, cursor: 'pointer', overflow: 'hidden', boxShadow: t.shadowCard }}>
          <div style={{ height: 110, overflow: 'hidden' }}><img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
          <div style={{ padding: '18px 20px' }}>
            <h3 style={{ color: t.text, fontFamily: 'Lora,serif', fontWeight: 700, marginBottom: 6 }}>Manage Courses</h3>
            <p style={{ color: t.textSub, fontSize: 13 }}>Edit videos, resources and track your published courses</p>
            <div style={{ marginTop: 14, color: t.accent, fontSize: 13, fontWeight: 700 }}>Open Manager →</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE COURSE (Educator)
// ─────────────────────────────────────────────────────────────────────────────
function CreateCourse({ user, onCreated, t }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title: '', shortDesc: '', description: '', category: 'CS Core', level: 'Beginner', icon: '📚', color: '#5b6ef5', price: '0', xpPerVideo: '25', language: 'English', tags: '' })
  const [videos, setVideos] = useState([{ id: 'v1', title: '', duration: '10:00', thumb: '🎬', isFree: true }])
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const addVideo = () => setVideos(v => [...v, { id: `v${v.length + 1}`, title: '', duration: '10:00', thumb: '🎬', isFree: false }])
  const updateVideo = (i, k, v) => setVideos(prev => prev.map((vid, idx) => idx === i ? { ...vid, [k]: v } : vid))

  const handleSubmit = () => {
    if (!user.educatorStatus || user.educatorStatus !== 'approved') return alert('Your educator account must be approved by admin before creating courses.')
    if (!form.title.trim()) return alert('Course title required.')
    if (videos.some(v => !v.title.trim())) return alert('All video titles required.')
    // Save course to pending list for admin review
    const pending = JSON.parse(localStorage.getItem('eduai_pending_courses') || '[]')
    const newCourse = {
      id: 'course_' + Date.now(),
      ...form, videos,
      price: parseFloat(form.price) || 0,
      isFree: parseFloat(form.price) === 0,
      contentModel: parseFloat(form.price) === 0 ? 'free' : 'paid',
      instructorId: user.email,
      instructorName: user.name,
      approvalStatus: 'pending',
      submittedAt: new Date().toISOString(),
      enrolledStudents: [], totalEnrollments: 0, averageRating: 0, reviews: [],
    }
    pending.push(newCourse)
    localStorage.setItem('eduai_pending_courses', JSON.stringify(pending))
    setSubmitted(true)
    setTimeout(() => { onCreated(newCourse) }, 1500)
  }

  if (submitted) return (
    <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <Card t={t} style={{ padding: 48, textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Course Submitted!</h2>
        <p style={{ color: t.textSub, marginBottom: 20 }}>Your course "<strong style={{ color: t.text }}>{form.title}</strong>" is under review. It will go live once approved by admin (24–48h).</p>
        <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 12, padding: '12px 20px', color: t.warning, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>⏳ Pending Admin Approval</div>
      </Card>
    </div>
  )

  if (!user.educatorStatus || user.educatorStatus !== 'approved') return (
    <div style={{ padding: 32 }}>
      <Card t={t} style={{ padding: 40, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🔒</div>
        <h3 style={{ color: t.text, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Admin Verification Required</h3>
        <p style={{ color: t.textSub, marginBottom: 20 }}>
          {user.educatorStatus === 'rejected'
            ? `Your application was rejected. Reason: ${user.adminNote || 'Please contact support.'}`
            : 'Your educator account is under admin review. You will be able to create courses once approved (typically 24–48h).'}
        </p>
        {user.educatorStatus === 'rejected'
          ? <Badge text="❌ Application Rejected" color={t.danger} soft={false} />
          : <Badge text="⏳ Pending Admin Approval" color={t.warning} soft={false} />}
      </Card>
    </div>
  )

  const icons = ['📚', '🧩', '🌐', '🤖', '💻', '⚡', '🔥', '🎯', '🧠', '📊']
  const colors = ['#5b6ef5', '#059669', '#dc2626', '#d97706', '#8b5cf6', '#ec4899', '#0891b2', '#16a34a']

  return (
    <div style={{ padding: 32, maxWidth: 760, animation: 'fadeUp .4s ease' }}>
      <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 6 }}>➕ Create New Course</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 24 }}>Fill in the details below. Your course will be reviewed before publishing.</p>

      {/* Step tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['1', 'Basic Info'], ['2', 'Add Videos'], ['3', 'Preview & Submit']].map(([n, lbl]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: step === +n ? `linear-gradient(135deg,${t.accent},#7c3aed)` : t.bgCard, border: `1px solid ${step === +n ? 'transparent' : t.border}`, cursor: 'pointer', fontSize: 13, fontWeight: step === +n ? 700 : 500, color: step === +n ? '#fff' : t.textSub, transition: 'all .2s' }} onClick={() => setStep(+n)}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: step === +n ? '#ffffff30' : t.bgHover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{n}</span>{lbl}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card t={t} style={{ padding: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Course Title *</label><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Complete Python Bootcamp" style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 14px', fontSize: 14, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} /></div>
            <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Short Description * <span style={{ color: t.textMuted }}>(shown in marketplace)</span></label><input value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} placeholder="What will students learn?" style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} /></div>
            <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Full Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Detailed course description, prerequisites, outcomes..." style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', resize: 'vertical' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Category</label><select value={form.category} onChange={e => set('category', e.target.value)} style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 12px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{['CS Core', 'Full Stack', 'AI/ML', 'Mobile', 'DevOps', 'Design', 'General'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Level</label><select value={form.level} onChange={e => set('level', e.target.value)} style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 12px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}</select></div>
              <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Price (₹) — 0 = Free</label><input value={form.price} onChange={e => set('price', e.target.value)} type="number" min="0" style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 12px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} /></div>
            </div>
            <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 8, fontWeight: 600 }}>Course Icon</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{icons.map(ic => <button key={ic} onClick={() => set('icon', ic)} style={{ width: 42, height: 42, borderRadius: 10, border: `2px solid ${form.icon === ic ? t.accent : t.border}`, background: form.icon === ic ? t.accentSoft : t.bgInput, fontSize: 20, cursor: 'pointer', transition: 'all .15s' }}>{ic}</button>)}</div></div>
            <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 8, fontWeight: 600 }}>Accent Color</label><div style={{ display: 'flex', gap: 8 }}>{colors.map(c => <button key={c} onClick={() => set('color', c)} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? '#fff' : 'transparent'}`, cursor: 'pointer', boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none' }} />)}</div></div>
            <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Tags <span style={{ color: t.textMuted }}>(comma-separated)</span></label><input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="python, ml, beginner" style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} /></div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}><Btn color={t.accent} onClick={() => setStep(2)}>Next: Add Videos →</Btn></div>
        </Card>
      )}

      {step === 2 && (
        <Card t={t} style={{ padding: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ color: t.text, fontWeight: 800, margin: 0 }}>Course Videos ({videos.length})</h3>
            <Btn color={t.success} onClick={addVideo} size="sm">+ Add Video</Btn>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {videos.map((v, i) => (
              <div key={i} style={{ background: t.bgInput, borderRadius: 13, padding: '14px 16px', border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                  <input value={v.title} onChange={e => updateVideo(i, 'title', e.target.value)} placeholder="Video title..." style={{ flex: 2, minWidth: 160, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 9, color: t.text, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} />
                  <input value={v.duration} onChange={e => updateVideo(i, 'duration', e.target.value)} placeholder="15:30" style={{ width: 70, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 9, color: t.text, padding: '8px 10px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', textAlign: 'center' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.textSub, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={v.isFree} onChange={e => updateVideo(i, 'isFree', e.target.checked)} />Free preview
                  </label>
                  {videos.length > 1 && <button onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))} style={{ background: t.dangerSoft, border: 'none', color: t.danger, width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>✕</button>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            <Btn color={t.textSub} soft onClick={() => setStep(1)}>← Back</Btn>
            <Btn color={t.accent} onClick={() => setStep(3)}>Next: Preview →</Btn>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card t={t} style={{ padding: 26 }}>
          <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 18 }}>📋 Course Preview</h3>
          <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: form.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, border: `2px solid ${form.color}40` }}>{form.icon}</div>
            <div><div style={{ color: t.text, fontWeight: 800, fontSize: 18 }}>{form.title || '(No title)'}</div><div style={{ color: t.textSub, fontSize: 13 }}>{form.shortDesc || '(No description)'}</div><div style={{ display: 'flex', gap: 8, marginTop: 6 }}><Badge text={form.category} color={form.color} /><Badge text={form.level} color={t.textSub} />{parseFloat(form.price) === 0 ? <Badge text="FREE" color={t.success} /> : <Badge text={`₹${form.price}`} color={t.warning} />}</div></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: t.textSub, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>VIDEOS ({videos.length})</div>
            {videos.map((v, i) => <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: `1px solid ${t.border}` }}><span style={{ color: t.textMuted, fontSize: 12 }}>{i + 1}.</span><span style={{ color: t.text, fontSize: 13, flex: 1 }}>{v.title || '(untitled)'}</span><span style={{ color: t.textSub, fontSize: 12 }}>{v.duration}</span>{v.isFree && <Badge text="FREE" color={t.accent} />}</div>)}
          </div>
          <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 12, padding: '12px 18px', marginBottom: 20, fontSize: 13, color: t.textSub }}>⚠️ After submission, your course will be reviewed by admin before going live. You'll earn 80% of each sale.</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Btn color={t.textSub} soft onClick={() => setStep(2)}>← Back</Btn>
            <Btn color={t.accent} onClick={handleSubmit} size="lg">🚀 Submit for Review</Btn>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATOR PROFILE
// ─────────────────────────────────────────────────────────────────────────────
function EducatorProfile({ user, onUpdate, t }) {
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '', qualification: user.qualification || '', experience: user.experience || '', expertise: (user.expertise || []).join(', '), linkedIn: user.linkedIn || '', website: user.website || '' })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ padding: 32, maxWidth: 680, animation: 'fadeUp .4s ease' }}>
      <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 6 }}>👤 Educator Profile</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 24 }}>Update your profile — students see this when browsing courses</p>
      <Card t={t} style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px 20px', background: t.bgHover, borderRadius: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22 }}>{user.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
          <div>
            <div style={{ color: t.text, fontWeight: 800, fontSize: 17 }}>{user.name}</div>
            <div style={{ color: t.textSub, fontSize: 13 }}>{user.email}</div>
            <div style={{ marginTop: 6 }}>{user.educatorStatus === 'approved' ? <Badge text="✅ Verified Educator" color={t.success} /> : <Badge text="⏳ Pending Review" color={t.warning} />}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['name', 'Full Name', 'text', 'Dr. Ratan Rajan'], ['qualification', 'Qualification', 'text', 'Ph.D. Computer Science'], ['experience', 'Experience', 'text', '8 years'], ['expertise', 'Expertise (comma-separated)', 'text', 'DSA, ML, Web Dev'], ['linkedIn', 'LinkedIn URL', 'text', 'linkedin.com/in/...'], ['website', 'Website / Portfolio', 'text', 'yoursite.com']].map(([key, label, type, placeholder]) => (
            <div key={key}><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>{label}</label><input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} type={type} style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }} /></div>
          ))}
          <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Bio</label><textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} placeholder="Tell students about your teaching style, background and what makes your courses special..." style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', resize: 'vertical' }} /></div>
        </div>
        {saved && <div style={{ background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 10, padding: '10px 16px', marginTop: 14, color: t.success, fontWeight: 700, fontSize: 13 }}>✅ Profile updated!</div>}
        <div style={{ marginTop: 18 }}><Btn color={t.accent} onClick={() => { onUpdate(form); setSaved(true); setTimeout(() => setSaved(false), 3000) }}>Save Changes ✓</Btn></div>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WALLET (Educator)
// ─────────────────────────────────────────────────────────────────────────────
function Wallet({ user, t }) {
  const [withdrawn, setWithdrawn] = useState(false)
  const mockTxns = [
    { title: 'MERN Bootcamp — Purchase', student: 'Rahul K.', amount: 399.2, date: '2 days ago' },
    { title: 'DSA Course — Purchase', student: 'Priya S.', amount: 0, date: '5 days ago' },
    { title: 'ML Fundamentals — Purchase', student: 'Amit P.', amount: 639.2, date: '1 week ago' },
  ]

  return (
    <div style={{ padding: 32, maxWidth: 680, animation: 'fadeUp .4s ease' }}>
      <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 20 }}>💰 Wallet</h2>
      <Card t={t} style={{ padding: 28, marginBottom: 20, background: `linear-gradient(135deg,${t.accent}18,${t.success}10)`, border: `1px solid ${t.accent}30` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ color: t.textSub, fontSize: 13 }}>Available Balance</div><div style={{ color: t.text, fontSize: 40, fontWeight: 900, margin: '6px 0' }}>₹{user.walletBalance || 0}</div><div style={{ color: t.textSub, fontSize: 12 }}>80% of each sale goes to you · 20% platform fee</div></div>
          <button onClick={() => setWithdrawn(true)} disabled={!user.walletBalance} style={{ background: t.walletBalance > 0 ? `linear-gradient(135deg,${t.success},#059669)` : t.border, border: 'none', color: user.walletBalance > 0 ? '#fff' : t.textMuted, padding: '12px 24px', borderRadius: 13, cursor: user.walletBalance > 0 ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Withdraw →</button>
        </div>
        {withdrawn && <div style={{ background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 10, padding: '10px 14px', marginTop: 14, color: t.success, fontSize: 13, fontWeight: 700 }}>✅ Withdrawal request submitted! Typically 2–3 business days. (Demo)</div>}
      </Card>
      <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 14 }}>Recent Transactions</h3>
      {mockTxns.map((tx, i) => (
        <Card key={i} t={t} style={{ padding: '14px 18px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ color: t.text, fontWeight: 600, fontSize: 14 }}>{tx.title}</div><div style={{ color: t.textSub, fontSize: 12, marginTop: 2 }}>👤 {tx.student} · {tx.date}</div></div>
          <div style={{ color: tx.amount > 0 ? t.success : t.textSub, fontWeight: 800, fontSize: 15 }}>{tx.amount > 0 ? `+₹${tx.amount}` : 'FREE'}</div>
        </Card>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SMTP Email Config Info — server-side only, no client credentials needed
// ─────────────────────────────────────────────────────────────────────────────
function SMTPStatusInfo({ t }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.success }} />
        <span style={{ color: t.success, fontSize: 12, fontWeight: 700 }}>✅ SMTP email is server-side — no client config needed</span>
      </div>
      <div style={{ color: t.textSub, fontSize: 12, marginBottom: 10 }}>
        Emails are sent via <strong style={{ color: t.text }}>Nodemailer SMTP</strong> on the backend.
        Configure your credentials once in <code style={{ color: t.accent, fontSize: 11 }}>server/.env</code> and all
        platform emails (welcome, approvals, suspensions) will work automatically.
      </div>
      <div style={{ background: t.bgHover, borderRadius: 10, padding: '10px 14px', border: `1px solid ${t.border}`, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: t.textSub, lineHeight: 1.8 }}>
        <div><span style={{ color: t.accent }}>SMTP_HOST</span>=smtp.gmail.com</div>
        <div><span style={{ color: t.accent }}>SMTP_PORT</span>=587</div>
        <div><span style={{ color: t.accent }}>SMTP_USER</span>=your@gmail.com</div>
        <div><span style={{ color: t.accent }}>SMTP_PASS</span>=xxxx xxxx xxxx xxxx <span style={{ color: t.textMuted }}># Gmail app password</span></div>
        <div><span style={{ color: t.accent }}>EMAIL_FROM</span>=EduAI &lt;no-reply@eduai.com&gt;</div>
      </div>
      <div style={{ color: t.textMuted, fontSize: 11, marginTop: 8 }}>
        Gmail setup: enable 2FA → <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: t.accent }}>myaccount.google.com/apppasswords</a> → create app password.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PANEL — Full management: educators, courses, users, platform stats
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanel({ t, adminEmail }) {
  const [tab, setTab] = useState('overview')
  const [pendingEducators, setPendingEducators] = useState([])
  const [allEducators, setAllEducators] = useState([])
  const [pendingCourses, setPendingCourses] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [rejectModal, setRejectModal] = useState(null) // { type: 'educator'|'course', id, name }
  const [rejectNote, setRejectNote] = useState('')
  const [toast, setToast] = useState('')

  // Load data from localStorage (simulates API calls)
  const loadData = () => {
    // Pending educator registrations
    const pending = JSON.parse(localStorage.getItem('eduai_pending_educators') || '[]')
    setPendingEducators(pending.filter(e => e.educatorStatus === 'pending'))

    // All educators
    const educators = []
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('eduai_user_'))
    const users = allKeys.map(k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }).filter(Boolean)
    setAllUsers(users)
    setAllEducators(users.filter(u => u.role === 'educator'))

    // Pending courses (stored in a separate key by educators)
    const courses = JSON.parse(localStorage.getItem('eduai_pending_courses') || '[]')
    setPendingCourses(courses.filter(c => c.approvalStatus === 'pending'))
  }

  useEffect(() => { loadData() }, [tab])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const approveEducator = (email) => {
    const key = `eduai_user_${email}`
    const userData = JSON.parse(localStorage.getItem(key) || '{}')
    userData.educatorStatus = 'approved'
    userData.isVerified = true
    userData.verifiedAt = new Date().toISOString()
    userData.adminNote = ''
    localStorage.setItem(key, JSON.stringify(userData))
    const pending = JSON.parse(localStorage.getItem('eduai_pending_educators') || '[]')
    localStorage.setItem('eduai_pending_educators', JSON.stringify(pending.filter(e => e.email !== email)))
    // Send approval email
    sendEmail(email,
      '🎉 Congratulations! Your EduAI Educator Account is Approved',
      `Dear ${userData.name},\n\nCongratulations! 🎊 We are thrilled to inform you that your educator application has been reviewed and approved by our admin team.\n\nYou can now:\n• Create and publish courses on the EduAI Marketplace\n• Set free, paid (one-time), or subscription-based pricing\n• Earn 80% revenue on every course sale\n• Access detailed student analytics\n\nTo get started: Log in → Dashboard → "Create Course"\n\nWe are excited to have you as part of the EduAI teaching community!\n\nWarm regards,\nEduAI Team`,
      'success')
    showToast(`🎉 ${userData.name} approved! Congratulations email sent to inbox.`)
    loadData()
  }

  const rejectEducator = (email, note) => {
    const key = `eduai_user_${email}`
    const userData = JSON.parse(localStorage.getItem(key) || '{}')
    userData.educatorStatus = 'rejected'
    userData.isVerified = false
    userData.adminNote = note || 'Application rejected.'
    localStorage.setItem(key, JSON.stringify(userData))
    const pending = JSON.parse(localStorage.getItem('eduai_pending_educators') || '[]')
    localStorage.setItem('eduai_pending_educators', JSON.stringify(pending.filter(e => e.email !== email)))
    // Send rejection email
    sendEmail(email,
      '📋 EduAI Educator Application — Decision',
      `Dear ${userData.name},\n\nThank you for your interest in teaching on EduAI and for taking the time to apply.\n\nAfter a thorough review of your application by our admin team, we regret to inform you that we are unable to approve your educator account at this time.\n\nReason: ${note || 'Your application does not meet our current educator requirements.'}\n\nWe encourage you to:\n• Update your qualifications or portfolio\n• Gain more teaching experience\n• Reapply after 30 days with improved credentials\n\nWe appreciate your understanding and hope to welcome you to our educator community in the future.\n\nKind regards,\nEduAI Admin Team`,
      'warning')
    showToast(`${userData.name}'s application rejected. Regret email sent to inbox.`)
    setRejectModal(null); setRejectNote(''); loadData()
  }

  const approveCourse = (courseId) => {
    const courses = JSON.parse(localStorage.getItem('eduai_pending_courses') || '[]')
    const updated = courses.map(c => c.id === courseId ? { ...c, approvalStatus: 'approved', isPublished: true, approvedAt: new Date().toISOString() } : c)
    localStorage.setItem('eduai_pending_courses', JSON.stringify(updated))
    const published = JSON.parse(localStorage.getItem('eduai_published_courses') || '[]')
    const course = updated.find(c => c.id === courseId)
    if (course) {
      published.push(course)
      localStorage.setItem('eduai_published_courses', JSON.stringify(published))
      sendEmail(course.instructorId,
        `🚀 Your Course "${course.title}" Is Now Live on EduAI!`,
        `Dear ${course.instructorName || 'Educator'},\n\nFantastic news! 🎉 Your course "${course.title}" has been reviewed and approved by our content team.\n\nIt is now LIVE in the EduAI Marketplace and visible to all students worldwide.\n\nCourse Details:\n• Title: ${course.title}\n• Pricing: ${course.price === 0 ? 'Free' : '₹' + course.price}\n• Content Model: ${course.contentModel || 'Free'}\n• Videos: ${course.videos?.length || 0} lessons\n\nYou will earn 80% of every paid enrollment. Students can start enrolling right now!\n\nKeep up the excellent work!\n\nEduAI Content Team`,
        'success')
    }
    showToast('✅ Course approved and published! Email sent to educator.')
    loadData()
  }

  const rejectCourse = (courseId, note) => {
    const courses = JSON.parse(localStorage.getItem('eduai_pending_courses') || '[]')
    const updated = courses.map(c => c.id === courseId ? { ...c, approvalStatus: 'rejected', adminNote: note } : c)
    localStorage.setItem('eduai_pending_courses', JSON.stringify(updated))
    const course = courses.find(c => c.id === courseId)
    if (course) {
      sendEmail(course.instructorId,
        `📋 Course Review Update: "${course.title}"`,
        `Dear ${course.instructorName || 'Educator'},\n\nThank you for submitting your course "${course.title}" for review.\n\nAfter careful evaluation, our content review team has decided that the course requires revisions before it can be published.\n\nReviewer Feedback:\n${note || 'Please improve the course content quality, ensure videos are clear, and check the course description before resubmitting.'}\n\nNext Steps:\n• Address the feedback above\n• Update your course in the dashboard\n• Resubmit for review\n\nWe look forward to reviewing your improved submission.\n\nEduAI Content Team`,
        'warning')
    }
    showToast('Course rejected. Feedback email sent to educator.')
    setRejectModal(null); setRejectNote(''); loadData()
  }

  const totalRevenue = JSON.parse(localStorage.getItem('eduai_transactions') || '[]').reduce((s, t) => s + (t.platformFee || 0), 0)
  const allKeys2 = Object.keys(localStorage).filter(k => k.startsWith('eduai_user_'))
  const totalUsers = allKeys2.length
  const studentCount = allUsers.filter(u => u.role === 'student').length
  const educatorCount = allUsers.filter(u => u.role === 'educator').length

  const tabBtn = (id, label, count = 0) => (
    <button key={id} onClick={() => setTab(id)} style={{ padding: '9px 18px', borderRadius: 12, border: tab === id ? 'none' : `1px solid ${t.border}`, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', background: tab === id ? t.g1 : t.bgCard, color: tab === id ? '#fff' : t.textSub, fontSize: 13, fontWeight: tab === id ? 700 : 500, boxShadow: tab === id ? `0 4px 18px ${t.accent}45` : 'none', display:'flex', alignItems:'center', gap:7, transition:'all .18s' }}>
      {label}
      {count > 0 && <span style={{ background: tab===id ? '#ffffff30' : t.danger, color:'#fff', borderRadius:99, padding:'1px 7px', fontSize:10, fontWeight:800 }}>{count}</span>}
    </button>
  )

  return (
    <div style={{ padding: 32, animation: 'fadeUp .4s ease', maxWidth: 1000 }}>
      {/* Hero Banner */}
      <div style={{ background: `linear-gradient(135deg,${t.bgCard},${t.bgHover})`, borderRadius: 20, padding: '24px 28px', marginBottom: 24, border: `1px solid ${t.accent}30`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:180, height:180, borderRadius:'50%', background: t.g1, opacity:.08, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-20, width:140, height:140, borderRadius:'50%', background: t.g2, opacity:.07, pointerEvents:'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
              <div style={{ width:42, height:42, borderRadius:14, background: t.g1, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:`0 6px 20px ${t.accent}50` }}>🛡️</div>
              <h2 style={{ color: t.text, fontSize: 24, fontWeight: 900, margin: 0 }}>Admin Control Panel</h2>
            </div>
            <p style={{ color: t.textSub, fontSize: 13, margin:0 }}>Manage educators, approve courses, moderate users and monitor platform revenue.</p>
          </div>
          {(pendingEducators.length + pendingCourses.length) > 0 && (
            <div style={{ background: t.dangerSoft, border: `1px solid ${t.danger}40`, borderRadius: 12, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, animation:'pulse 2s infinite' }}>
              <span style={{ background: t.gDanger, color:'#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink:0 }}>{pendingEducators.length + pendingCourses.length}</span>
              <span style={{ color: t.danger, fontSize: 13, fontWeight: 700 }}>Items awaiting review</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Total Users" value={totalUsers || '—'} icon="👥" color={t.accent} sub="Registered" t={t} />
        <StatCard label="Students" value={studentCount || '—'} icon="🎓" color={t.success} sub="Active" t={t} />
        <StatCard label="Educators" value={educatorCount || '—'} icon="👨‍🏫" color={t.purple} sub="Verified" t={t} />
        <StatCard label="Pending Reviews" value={pendingEducators.length + pendingCourses.length} icon="⏳" color={t.warning} sub="Awaiting" t={t} />
        <StatCard label="Platform Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon="💰" color={t.success} sub="Total" t={t} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', background: t.bgCard, borderRadius: 16, padding: 8, border: `1px solid ${t.border}` }}>
        {tabBtn('overview', '📊 Overview')}
        {tabBtn('educators', '👨‍🏫 Educators', pendingEducators.length)}
        {tabBtn('courses', '📋 Courses', pendingCourses.length)}
        {tabBtn('users', '👥 Users')}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card t={t} style={{ padding: '22px 26px', border: `1px solid ${t.accent}20` }}>
            <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 16, fontSize: 15, display:'flex', alignItems:'center', gap:8 }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn color={t.warning} gradient={t.g3} onClick={() => setTab('educators')}>
                {pendingEducators.length > 0 ? `Review ${pendingEducators.length} Pending Educators ⏳` : 'Educator Verifications 👨‍🏫'}
              </Btn>
              <Btn color={t.purple} onClick={() => setTab('courses')}>
                {pendingCourses.length > 0 ? `Review ${pendingCourses.length} Pending Courses 📋` : 'Course Approvals 📋'}
              </Btn>
              <Btn color={t.accent} soft onClick={() => setTab('users')}>All Users 👥</Btn>
            </div>
          </Card>
          
          <Card t={t} style={{ padding: '22px 26px' }}>
            <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 12, fontSize: 15 }}>ℹ️ Platform Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['Revenue split', '👨‍🏫 Educator 80% / Platform 20%'], ['Content models', 'Free · Paid · Subscription · Freemium'], ['Educator flow', 'Register → Admin approval → Create courses'], ['Course flow', 'Create → Admin review → Live to students']].map(([k, v]) => (
                <div key={k} style={{ background: t.bgHover, borderRadius: 12, padding: '12px 14px', border:`1px solid ${t.border}` }}>
                  <div style={{ color: t.textMuted, fontSize: 10, fontWeight: 800, textTransform:'uppercase', letterSpacing:.8 }}>{k}</div>
                  <div style={{ color: t.text, fontSize: 13, marginTop: 4, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── EDUCATOR VERIFICATIONS ── */}
      {tab === 'educators' && (
        <div>
          {pendingEducators.length === 0 && allEducators.filter(e => e.educatorStatus === 'approved').length === 0 && (
            <Card t={t} style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 16 }}>No pending educator verifications</div>
              <div style={{ color: t.textSub, fontSize: 13, marginTop: 6 }}>Educator accounts will appear here when they register</div>
            </Card>
          )}
          {pendingEducators.length > 0 && (
            <>
              <div style={{ color: t.textSub, fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>⏳ Pending Approval ({pendingEducators.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                {pendingEducators.map((e, i) => (
                  <Card key={i} t={t} style={{ padding: '20px 24px', border: `1px solid ${t.warning}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                          <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>{e.name?.[0] || '?'}</div>
                          <div>
                            <div style={{ color: t.text, fontWeight: 800, fontSize: 15 }}>{e.name}</div>
                            <div style={{ color: t.textSub, fontSize: 12 }}>{e.email}</div>
                            <div style={{ color: t.textMuted, fontSize: 11 }}>Registered {new Date(e.joinedDate || Date.now()).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                          {e.qualification && <span style={{ color: t.textSub, fontSize: 13 }}>🎓 {e.qualification}</span>}
                          {e.experience && <span style={{ color: t.textSub, fontSize: 13 }}>⏱ {e.experience}</span>}
                          {e.institution && <span style={{ color: t.textSub, fontSize: 13 }}>🏫 {e.institution}</span>}
                        </div>
                        {e.expertise?.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{e.expertise.map(s => <Badge key={s} text={s} color={t.accent} />)}</div>}
                        {e.bio && <div style={{ color: t.textSub, fontSize: 12, marginTop: 8, fontStyle: 'italic', maxWidth: 480 }}>"{e.bio}"</div>}
                        {e.linkedIn && <div style={{ color: t.accent, fontSize: 12, marginTop: 6 }}>🔗 {e.linkedIn}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <Btn color={t.danger} soft size="sm" onClick={() => setRejectModal({ type: 'educator', id: e.email, name: e.name })}>✗ Reject</Btn>
                        <Btn color={t.success} size="sm" gradient={t.g2} onClick={() => approveEducator(e.email)}>✓ Approve & Notify</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
          {allEducators.filter(e => e.educatorStatus === 'approved').length > 0 && (
            <>
              <div style={{ color: t.textSub, fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>✅ Approved Educators</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allEducators.filter(e => e.educatorStatus === 'approved').map((e, i) => (
                  <Card key={i} t={t} style={{ padding: '14px 20px', border: `1px solid ${t.success}25` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.successSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.success, fontWeight: 800 }}>{e.name?.[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: t.text, fontWeight: 700 }}>{e.name} <Badge text="✅ Verified" color={t.success} /></div>
                        <div style={{ color: t.textSub, fontSize: 12 }}>{e.email} · {e.qualification}</div>
                      </div>
                      <div style={{ color: t.textSub, fontSize: 12 }}>💰 ₹{e.totalEarnings || 0} earned</div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
          {allEducators.filter(e => e.educatorStatus === 'rejected').length > 0 && (
            <>
              <div style={{ color: t.textSub, fontSize: 12, fontWeight: 700, margin: '20px 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>❌ Rejected</div>
              {allEducators.filter(e => e.educatorStatus === 'rejected').map((e, i) => (
                <Card key={i} t={t} style={{ padding: '14px 20px', marginBottom: 10, opacity: 0.7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.dangerSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.danger, fontWeight: 800 }}>{e.name?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: t.text, fontWeight: 700 }}>{e.name} <Badge text="Rejected" color={t.danger} /></div>
                      <div style={{ color: t.textSub, fontSize: 12 }}>{e.email}</div>
                      {e.adminNote && <div style={{ color: t.danger, fontSize: 11, marginTop: 3 }}>Reason: {e.adminNote}</div>}
                    </div>
                    <Btn color={t.success} soft size="sm" onClick={() => approveEducator(e.email)}>↺ Re-approve</Btn>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── COURSE APPROVALS ── */}
      {tab === 'courses' && (
        <div>
          {pendingCourses.length === 0 ? (
            <Card t={t} style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 16 }}>No pending course submissions</div>
              <div style={{ color: t.textSub, fontSize: 13, marginTop: 6 }}>Approved educators will submit courses for review here</div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pendingCourses.map((c, i) => (
                <Card key={i} t={t} style={{ padding: '20px 24px', border: `1px solid ${t.purple}30` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: (c.color || t.accent) + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.icon || '📚'}</div>
                        <div>
                          <div style={{ color: t.text, fontWeight: 800, fontSize: 15 }}>{c.title}</div>
                          <div style={{ color: t.textSub, fontSize: 12 }}>by {c.instructorName || c.instructor}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ color: t.textSub, fontSize: 13 }}>🎬 {c.videos?.length || 0} videos</span>
                        <span style={{ color: t.textSub, fontSize: 13 }}>{c.price === 0 || c.isFree ? '🆓 Free' : `₹${c.price}`}</span>
                        <span style={{ color: t.textSub, fontSize: 13 }}>📂 {c.category}</span>
                        <span style={{ color: t.textSub, fontSize: 13 }}>🎯 {c.level}</span>
                        <Badge text={c.contentModel || 'free'} color={c.contentModel === 'paid' ? t.warning : t.success} />
                      </div>
                      {c.shortDesc && <div style={{ color: t.textSub, fontSize: 12, fontStyle: 'italic', maxWidth: 480 }}>{c.shortDesc}</div>}
                      {c.videos?.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ color: t.textMuted, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>SAMPLE VIDEOS:</div>
                          {c.videos.slice(0, 3).map((v, vi) => (
                            <div key={vi} style={{ color: t.textSub, fontSize: 12, marginBottom: 3 }}>
                              {vi + 1}. {v.title} <span style={{ color: t.textMuted }}>({v.duration})</span> {v.isFree && <Badge text="FREE preview" color={t.accent} />}
                            </div>
                          ))}
                          {c.videos.length > 3 && <div style={{ color: t.textMuted, fontSize: 11 }}>+ {c.videos.length - 3} more videos...</div>}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <Btn color={t.danger} soft size="sm" onClick={() => setRejectModal({ type: 'course', id: c.id, name: c.title })}>✗ Reject</Btn>
                      <Btn color={t.success} size="sm" gradient={t.g2} onClick={() => approveCourse(c.id)}>🚀 Approve & Publish</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ALL USERS ── */}
      {tab === 'users' && (
        <div>
          {allUsers.length === 0 ? (
            <Card t={t} style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>👥</div>
              <div style={{ color: t.text, fontWeight: 700 }}>No users registered yet</div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allUsers.map((u, i) => {
                const isSuspended = u.suspended === true
                const isBlocked = u.blocked === true
                const isAdmin = u.role === 'admin'
                const roleColor = u.role === 'student' ? t.accent : u.role === 'educator' ? t.success : t.danger

                const suspend = () => {
                  if (isAdmin) { showToast('⛔ Cannot modify admin account'); return }
                  const key = `eduai_user_${u.email}`
                  const ud = JSON.parse(localStorage.getItem(key) || '{}')
                  if (!isSuspended) {
                    const count = (ud.suspensionCount || 0) + 1
                    const hours = count > 2 ? 7 * 24 : 24
                    const until = new Date(Date.now() + hours * 3600000).toISOString()
                    ud.suspended = true; ud.suspendedUntil = until; ud.suspensionCount = count
                    localStorage.setItem(key, JSON.stringify(ud))
                    sendEmail(u.email, '⚠️ Account Suspended',
                      `Dear ${u.name},\n\nYour account has been suspended for ${count > 2 ? '7 days' : '24 hours'} (violation #${count}).\nSuspension ends: ${new Date(until).toLocaleString('en-IN')}\n\nContact support@eduai.com to appeal.\n\nEduAI Trust & Safety`, 'warning')
                    showToast(`⚠️ ${u.name} suspended ${count > 2 ? '7 days' : '24 hours'} (×${count})`)
                  } else {
                    ud.suspended = false; delete ud.suspendedUntil
                    localStorage.setItem(key, JSON.stringify(ud))
                    sendEmail(u.email, '✅ Account Reinstated', `Dear ${u.name},\n\nYour suspension has been lifted. You may now log in.\n\nEduAI Team`, 'success')
                    showToast(`✅ ${u.name} reinstated`)
                  }
                  loadData()
                }

                const block = () => {
                  if (isAdmin) { showToast('⛔ Cannot modify admin account'); return }
                  if (!window.confirm(`${isBlocked ? 'Unblock' : 'Permanently block'} ${u.name}?`)) return
                  const key = `eduai_user_${u.email}`
                  const ud = JSON.parse(localStorage.getItem(key) || '{}')
                  ud.blocked = !ud.blocked
                  localStorage.setItem(key, JSON.stringify(ud))
                  if (!isBlocked) {
                    sendEmail(u.email, '🚫 Account Blocked', `Dear ${u.name},\n\nYour account has been permanently blocked. Contact legal@eduai.com to appeal.\n\nEduAI Trust & Safety`, 'danger')
                    showToast(`🚫 ${u.name} blocked`)
                  } else {
                    sendEmail(u.email, '✅ Account Unblocked', `Dear ${u.name},\n\nYour block has been removed. You may log in again.\n\nEduAI Team`, 'success')
                    showToast(`✅ ${u.name} unblocked`)
                  }
                  loadData()
                }

                const remove = () => {
                  if (isAdmin) { showToast('⛔ Cannot remove admin account'); return }
                  if (!window.confirm(`Permanently delete account for ${u.name}? This CANNOT be undone.`)) return
                  sendEmail(u.email, '🗑️ Account Removed', `Dear ${u.name},\n\nYour EduAI account has been permanently removed. Contact legal@eduai.com if you believe this is an error.\n\nEduAI Admin`, 'danger')
                  localStorage.removeItem(`eduai_user_${u.email}`)
                  localStorage.removeItem(`eduai_inbox_${u.email}`)
                  const pend = JSON.parse(localStorage.getItem('eduai_pending_educators') || '[]')
                  localStorage.setItem('eduai_pending_educators', JSON.stringify(pend.filter(e => e.email !== u.email)))
                  showToast(`🗑️ ${u.name} removed permanently`)
                  loadData()
                }

                return (
                  <Card key={i} t={t} style={{ padding: '0', overflow: 'hidden', border: isBlocked ? `1px solid ${t.danger}40` : isSuspended ? `1px solid ${t.warning}40` : `1px solid ${t.border}` }}>
                    {(isBlocked || isSuspended) && <div style={{ height: 3, background: isBlocked ? t.gDanger : t.g3 }} />}
                    <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${roleColor}dd,${roleColor}55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#fff', flexShrink: 0 }}>{u.name?.[0] || '?'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ color: t.text, fontWeight: 700, fontSize: 14 }}>{u.name}</span>
                          {isBlocked && <Badge text="🚫 BLOCKED" color={t.danger} pulse />}
                          {isSuspended && !isBlocked && <Badge text="⚠️ SUSPENDED" color={t.warning} pulse />}
                          {isSuspended && u.suspendedUntil && <span style={{ color: t.textMuted, fontSize: 10 }}>until {new Date(u.suspendedUntil).toLocaleDateString('en-IN')} ×{u.suspensionCount || 1}</span>}
                        </div>
                        <div style={{ color: t.textSub, fontSize: 12, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email} · Joined {new Date(u.joinedDate || Date.now()).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
                        <Badge text={u.role.charAt(0).toUpperCase() + u.role.slice(1)} color={roleColor} />
                        {u.role === 'educator' && <Badge text={u.educatorStatus || 'pending'} color={u.educatorStatus === 'approved' ? t.success : u.educatorStatus === 'rejected' ? t.danger : t.warning} />}
                        {!isAdmin && (
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button onClick={suspend}
                              style={{ padding: '5px 11px', background: isSuspended ? t.successSoft : t.warningSoft, border: `1px solid ${isSuspended ? t.success : t.warning}50`, color: isSuspended ? t.success : t.warning, borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                              {isSuspended ? '↩ Unsuspend' : '⏸ Suspend'}
                            </button>
                            <button onClick={block}
                              style={{ padding: '5px 11px', background: isBlocked ? t.successSoft : t.dangerSoft, border: `1px solid ${isBlocked ? t.success : t.danger}50`, color: isBlocked ? t.success : t.danger, borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                              {isBlocked ? '🔓 Unblock' : '🚫 Block'}
                            </button>
                            <button onClick={remove}
                              style={{ padding: '5px 11px', background: t.dangerSoft, border: `1px solid ${t.danger}50`, color: t.danger, borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#00000088', backdropFilter:'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: t.bgCard, borderRadius: 22, padding: 30, maxWidth: 460, width: '100%', animation: 'popIn .3s ease', border: `1px solid ${t.danger}30`, boxShadow:`${t.shadow},0 0 0 1px ${t.danger}15` }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:46, height:46, borderRadius:14, background: t.gDanger, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>❌</div>
              <div>
                <h3 style={{ color: t.danger, fontWeight: 900, margin:0, fontSize:17 }}>Reject {rejectModal.type === 'educator' ? 'Educator Application' : 'Course Submission'}</h3>
                <p style={{ color: t.textSub, fontSize: 12, margin:'3px 0 0' }}>A rejection email will be sent to: <strong style={{ color: t.text }}>{rejectModal.name}</strong></p>
              </div>
            </div>
            <div>
              <label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 700, textTransform:'uppercase', letterSpacing:.5 }}>Reason for rejection (included in email)</label>
              <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={4} placeholder={rejectModal.type==='educator' ? 'e.g. Insufficient teaching experience, incomplete qualifications...' : 'e.g. Video quality too low, content needs more depth...'} style={{ width: '100%', background: t.bgInput, border: `1.5px solid ${t.border}`, borderRadius: 12, color: t.text, padding: '11px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', resize: 'vertical', boxSizing: 'border-box', transition:'border-color .2s' }} onFocus={e=>e.target.style.borderColor=t.danger} onBlur={e=>e.target.style.borderColor=t.border} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <Btn color={t.textSub} soft size="sm" onClick={() => { setRejectModal(null); setRejectNote('') }}>Cancel</Btn>
              <Btn color={t.danger} size="sm" gradient={t.gDanger} onClick={() => {
                if (rejectModal.type === 'educator') rejectEducator(rejectModal.id, rejectNote)
                else rejectCourse(rejectModal.id, rejectNote)
              }}>📧 Send Rejection & Notify</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: t.bgCard, border: `1px solid ${t.accent}40`, borderRadius: 16, padding: '14px 22px', fontSize: 13, fontWeight: 700, color: t.text, zIndex: 9999, boxShadow: `${t.shadow},0 0 0 1px ${t.accent}20`, animation: 'slideDown .3s ease', maxWidth: 360, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:18 }}>{toast.startsWith('✅')||toast.startsWith('🎉') ? '✅' : toast.startsWith('⚠️') ? '⚠️' : toast.startsWith('🚫')||toast.startsWith('🗑') ? '🗑️' : '📢'}</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ, LEADERBOARD, ACHIEVEMENTS, AI TUTOR, ANALYTICS — preserved from v3
// ─────────────────────────────────────────────────────────────────────────────
function QuizPage({ t, onXP }) {
  const [state, setState] = useState('start')
  const [cur, setCur] = useState(0)
  const [answers, setAnswers] = useState({})
  const [sel, setSel] = useState(null)
  const [fb, setFb] = useState(false)
  const q = QUIZ_QUESTIONS[cur], total = QUIZ_QUESTIONS.length
  const reset = () => { setState('start'); setCur(0); setAnswers({}); setSel(null); setFb(false) }
  const next = () => { const a = { ...answers, [cur]: sel }; setAnswers(a); if (cur + 1 < total) { setCur(c => c + 1); setSel(null); setFb(false) } else setState('result') }

  if (state === 'start') return <div style={{ padding: 32, maxWidth: 600, animation: 'fadeUp .4s ease' }}>
    <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 20 }}>✏️ Quizzes</h2>
    <Card t={t} style={{ padding: 36, textAlign: 'center' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✏️</div>
      <h3 style={{ color: t.text, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>DSA Challenge Quiz</h3>
      <p style={{ color: t.textSub, fontSize: 13, marginBottom: 20 }}>Trees & Graphs · {total} Questions · Earn XP!</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 26 }}>
        {[['📋', `${total} Q`], ['⏱', '~10min'], ['⚡', '+50 XP']].map(([ic, lb]) => <div key={lb} style={{ background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 10, padding: '8px 16px', color: t.textSub, fontSize: 13 }}>{ic} {lb}</div>)}
      </div>
      <Btn color={t.accent} onClick={() => setState('active')} size="lg">Start Quiz →</Btn>
    </Card>
  </div>

  if (state === 'result') {
    const score = Object.entries(answers).filter(([i, a]) => QUIZ_QUESTIONS[+i].correct === a).length
    const pct = Math.round(score / total * 100); const pass = pct >= 70
    return <div style={{ padding: 32, maxWidth: 480, animation: 'popIn .4s ease' }}>
      <Card t={t} style={{ padding: 44, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>{pct === 100 ? '💯' : pass ? '🎉' : '📚'}</div>
        <h2 style={{ color: t.text, fontSize: 20, fontWeight: 900 }}>{pct === 100 ? 'PERFECT!' : pass ? 'Great Job!' : 'Keep Practicing!'}</h2>
        <div style={{ color: pass ? t.success : t.danger, fontSize: 48, fontWeight: 900, margin: '14px 0' }}>{pct}%</div>
        <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 12, padding: '12px 20px', marginBottom: 22 }}><div style={{ color: t.warning, fontWeight: 800 }}>⚡ +{pass ? (pct === 100 ? 150 : 50) : 20} XP Earned!</div><div style={{ color: t.textSub, fontSize: 12, marginTop: 3 }}>{score}/{total} correct</div></div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Btn color={t.textSub} soft onClick={reset}>↺ Retake</Btn>
          <Btn color={t.accent} onClick={() => { onXP(pass ? (pct === 100 ? 150 : 50) : 20, pct === 100); reset() }}>Claim XP ⚡</Btn>
        </div>
      </Card>
    </div>
  }

  return <div style={{ padding: 32, maxWidth: 620, animation: 'fadeUp .35s ease' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <span style={{ color: t.textSub, fontSize: 13 }}>Q {cur + 1}/{total}</span>
      <div style={{ display: 'flex', gap: 5 }}>{QUIZ_QUESTIONS.map((_, i) => <div key={i} style={{ width: 28, height: 5, borderRadius: 99, background: i < cur ? t.accent : i === cur ? t.accent + '88' : t.border }} />)}</div>
    </div>
    <Card t={t} style={{ padding: 28, marginBottom: 14 }}>
      <h3 style={{ color: t.text, fontSize: 16, fontWeight: 700, lineHeight: 1.55, marginBottom: 22 }}>{q.question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {q.options.map((opt, i) => {
          let bg = t.bgInput, bdr = t.border, col = t.textSub
          if (fb) { if (i === q.correct) { bg = t.successSoft; bdr = t.success; col = t.success } else if (i === sel && i !== q.correct) { bg = t.dangerSoft; bdr = t.danger; col = t.danger } }
          else if (i === sel) { bg = t.accentSoft; bdr = t.accent; col = t.accent }
          return <button key={i} onClick={() => { if (!fb) { setSel(i); setFb(true) } }} style={{ background: bg, border: `1.5px solid ${bdr}`, color: col, padding: '12px 16px', borderRadius: 13, cursor: fb ? 'default' : 'pointer', textAlign: 'left', fontSize: 14, fontFamily: 'Plus Jakarta Sans,sans-serif', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, background: fb && (i === q.correct || (i === sel && i !== q.correct)) ? (i === q.correct ? t.success : t.danger) : i === sel ? t.accent : 'transparent', color: fb && (i === q.correct || i === sel) ? '#fff' : col }}>{fb && i === q.correct ? '✓' : fb && i === sel && i !== q.correct ? '✗' : String.fromCharCode(65 + i)}</span>{opt}
          </button>
        })}
      </div>
    </Card>
    {fb && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Btn color={t.accent} onClick={next}>{cur + 1 < total ? 'Next →' : 'Finish 🏁'}</Btn></div>}
  </div>
}

function Leaderboard({ user, t }) {
  const userXP = user.xp || 0
  const all = [...MOCK_LEADERBOARD, { name: user.name, xp: userXP, streak: user.streak || 0, avatar: user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(), color: t.accent, isYou: true }].sort((a, b) => b.xp - a.xp)
  const rank = all.findIndex(u => u.isYou) + 1

  return <div style={{ padding: 32, maxWidth: 640, animation: 'fadeUp .4s ease' }}>
    <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 20 }}>🏆 Leaderboard</h2>
    <Card t={t} style={{ padding: '16px 22px', marginBottom: 20, background: `linear-gradient(135deg,${t.accent}18,${t.purple}18)`, border: `1px solid ${t.accent}30` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${t.accent},#ec4899)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 17 }}>{user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</div>
        <div style={{ flex: 1 }}><div style={{ color: t.text, fontWeight: 800, fontSize: 15 }}>{user.name} <Badge text="YOU" color={t.accent} /></div><div style={{ color: t.textSub, fontSize: 12, marginTop: 2 }}>🔥 {user.streak || 0}d streak · ⚡ {userXP} XP</div></div>
        <div style={{ textAlign: 'right' }}><div style={{ color: t.accent, fontSize: 26, fontWeight: 900 }}>#{rank}</div><div style={{ color: t.textSub, fontSize: 11 }}>rank</div></div>
      </div>
    </Card>
    <Card t={t} style={{ overflow: 'hidden' }}>
      {all.map((u, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 20px', borderBottom: i < all.length - 1 ? `1px solid ${t.border}` : 'none', background: u.isYou ? t.accentSoft : 'transparent', animation: `slideRight .4s ease ${i * .05}s both` }}>
          <div style={{ width: 28, textAlign: 'center' }}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : <span style={{ color: t.textSub, fontWeight: 800, fontSize: 14 }}>#{i + 1}</span>}</div>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${u.color},${u.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>{u.avatar}</div>
          <div style={{ flex: 1 }}><div style={{ color: t.text, fontWeight: u.isYou ? 800 : 600, fontSize: 14 }}>{u.name}{u.isYou && <span style={{ marginLeft: 6 }}><Badge text="YOU" color={t.accent} /></span>}</div><div style={{ color: t.textSub, fontSize: 11 }}>🔥 {u.streak}d streak</div></div>
          <div style={{ color: i < 3 ? ['#f59e0b', '#94a3b8', '#d97706'][i] : t.textSub, fontWeight: 800, fontSize: 15 }}>{u.xp.toLocaleString()} XP</div>
        </div>
      ))}
    </Card>
  </div>
}

function Achievements({ user, t }) {
  const earned = user.badges || []
  return <div style={{ padding: 32, maxWidth: 860, animation: 'fadeUp .4s ease' }}>
    <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 6 }}>🎖️ Achievements</h2>
    <p style={{ color: t.textSub, fontSize: 14, marginBottom: 24 }}>{earned.length}/{BADGES.length} badges earned</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 13 }}>
      {BADGES.map((b, i) => {
        const got = earned.includes(b.id)
        return <div key={b.id} className="card-lift" style={{ background: got ? t.bgCard : t.bgInput, borderRadius: 17, padding: '18px 16px', border: `1px solid ${got ? t.warning + '50' : t.border}`, textAlign: 'center', opacity: got ? 1 : 0.5, boxShadow: got ? `0 0 0 1px ${t.warning}20,${t.shadowCard}` : 'none', animation: `fadeUp .5s ease ${i * .03}s both` }}>
          <div style={{ fontSize: 36, marginBottom: 8, filter: got ? 'none' : 'grayscale(100%)' }}>{b.icon}</div>
          <div style={{ color: got ? t.text : t.textSub, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{b.title}</div>
          <div style={{ color: t.textSub, fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>{b.desc}</div>
          <div style={{ background: got ? t.warningSoft : t.bgHover, color: got ? t.warning : t.textMuted, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, display: 'inline-block' }}>{got ? `✓ +${b.xp} XP` : `🔒 ${b.xp} XP`}</div>
        </div>
      })}
    </div>
  </div>
}

function AITutor({ user, t, onQuestion }) {
  const [msgs, setMsgs] = useState([{ role: 'ai', text: `Hello ${user.name.split(' ')[0]}! 👋 I'm your **AI Tutor** powered by Grok.\n\nI can help with **any CS topic** — DSA, MERN, ML, OS, System Design, and more.\n\nWhat would you like to learn today?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('eduai_grok_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const endRef = useRef()

  const chips = ['Explain binary search trees', 'How does React useEffect work?', 'What is gradient descent?', 'Explain deadlock in OS']
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const saveKey = () => {
    const k = keyDraft.trim()
    if (!k.startsWith('xai-')) { alert('Invalid key — Grok (xAI) keys start with "xai-"'); return }
    localStorage.setItem('eduai_grok_key', k)
    setApiKey(k); setShowKeyInput(false); setKeyDraft('')
  }

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    if (!apiKey) { setShowKeyInput(true); return }
    setInput('')
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMsgs(p => [...p, { role: 'user', text: q, time }])
    setLoading(true); onQuestion()
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'grok-3-mini',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: 'You are EduAI, an expert CS tutor for students at SRMCEM Lucknow. Help with DSA, MERN, ML, OS, and any CS topic. Use **bold** for key terms. Be clear, concise, and encouraging.' },
            ...msgs.slice(-8).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: q }
          ]
        })
      })
      if (res.status === 401) {
        localStorage.removeItem('eduai_grok_key'); setApiKey('')
        setMsgs(p => [...p, { role: 'ai', text: '❌ **Invalid API Key.** Please re-enter your Grok (xAI) key.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
        setShowKeyInput(true)
      } else if (res.status === 429) {
        setMsgs(p => [...p, { role: 'ai', text: '⚠️ **Rate limit reached.** Wait a moment and try again, or check your xAI quota.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      } else {
        const d = await res.json()
        const reply = d.choices?.[0]?.message?.content || d.error?.message || 'No response received.'
        setMsgs(p => [...p, { role: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      }
    } catch (e) {
      setMsgs(p => [...p, { role: 'ai', text: `❌ Connection error: ${e.message}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    }
    setLoading(false)
  }

  const renderText = text => text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') ? <strong key={i} style={{ color: t.accent }}>{p.slice(2, -2)}</strong> : p
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '28px 28px 16px', maxWidth: 760, boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
        <div>
          <h2 style={{ color: t.text, fontSize: 19, fontWeight: 900, margin: 0 }}>AI Tutor</h2>
          <p style={{ color: t.textSub, fontSize: 12, marginTop: 2 }}>Powered by Grok-3 Mini (xAI) · Context-aware</p>
        </div>
        {/* <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {apiKey
            ? <><Badge text="● Online" color={t.success} /><button onClick={() => { setKeyDraft(apiKey); setShowKeyInput(true) }} style={{ background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }}>🔑 Key</button></>
            : <button onClick={() => setShowKeyInput(true)} style={{ background: t.warningSoft, border: `1px solid ${t.warning}50`, color: t.warning, borderRadius: 9, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 700 }}>⚠️ Add API Key</button>
          }
        </div> */}
      </div>

      {/* API Key setup banner */}
      {showKeyInput && (
        <div style={{ background: t.bgCard, border: `1px solid ${t.accent}40`, borderRadius: 16, padding: '18px 20px', marginBottom: 16, animation: 'slideDown .2s ease' }}>
          <div style={{ color: t.text, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>🔑 Grok API Key (xAI)</div>
          <div style={{ color: t.textSub, fontSize: 12, marginBottom: 12 }}>
            Get your <strong style={{ color: t.success }}>free</strong> key at <a href="https://console.x.ai" target="_blank" rel="noreferrer" style={{ color: t.accent }}>console.x.ai</a>. Free tier includes <strong style={{ color: t.textSub }}>grok-3-mini</strong> access. Key is stored only in your browser.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={keyDraft} onChange={e => setKeyDraft(e.target.value)} placeholder="xai-..." type="password"
              style={{ flex: 1, background: t.bgInput, border: `1.5px solid ${t.border}`, borderRadius: 10, color: t.text, padding: '9px 13px', fontSize: 13, outline: 'none', fontFamily: 'JetBrains Mono,monospace' }}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              onFocus={e => e.target.style.borderColor = t.accent} onBlur={e => e.target.style.borderColor = t.border} />
            <button onClick={saveKey} style={{ background: `linear-gradient(135deg,${t.accent},#7b2fff)`, border: 'none', color: '#fff', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Save</button>
            <button onClick={() => setShowKeyInput(false)} style={{ background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 10, padding: '9px 14px', cursor: 'pointer', fontSize: 13 }}>✕</button>
          </div>
          <div style={{ color: t.textMuted, fontSize: 11, marginTop: 8 }}>Uses <strong style={{ color: t.textSub }}>grok-3-mini</strong> — fast, free tier available at <a href="https://console.x.ai" target="_blank" rel="noreferrer" style={{ color: t.accent }}>console.x.ai</a>.</div>
        </div>
      )}

      {/* Chat area */}
      <div style={{ flex: 1, background: t.bgCard, borderRadius: 22, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 9, animation: 'fadeUp .3s ease' }}>
              {m.role === 'ai' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🤖</div>}
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? `linear-gradient(135deg,${t.accent},#7c3aed)` : t.bgInput, color: m.role === 'user' ? '#fff' : t.text, padding: '10px 15px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-line', border: m.role === 'user' ? 'none' : `1px solid ${t.border}` }}>
                  {renderText(m.text)}
                </div>
                <span style={{ color: t.textMuted, fontSize: 10, marginTop: 3 }}>{m.time}</span>
              </div>
              {m.role === 'user' && <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},#ec4899)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>{user.name[0]}</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},#8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
              <div style={{ background: t.bgInput, border: `1px solid ${t.border}`, padding: '11px 16px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, animation: `bounce 1s ${i * .18}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {/* Suggestion chips */}
        <div style={{ padding: '10px 14px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: `1px solid ${t.border}` }}>
          {chips.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="chip" style={{ background: t.bgInput, border: `1px solid ${t.border}`, color: t.textSub, padding: '4px 12px', borderRadius: 99, cursor: 'pointer', fontSize: 11, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }}>{s}</button>
          ))}
        </div>
        {/* Input */}
        <div style={{ padding: '8px 14px 14px', display: 'flex', gap: 9 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={apiKey ? 'Ask anything about CS...' : 'Add your Grok API key to start chatting →'}
            style={{ flex: 1, background: t.bgInput, border: `1.5px solid ${t.border}`, borderRadius: 13, color: t.text, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }}
            onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentSoft}` }}
            onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = 'none' }} />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            style={{ background: !input.trim() || loading ? t.border : `linear-gradient(135deg,${t.accent},#7c3aed)`, border: 'none', color: !input.trim() || loading ? t.textMuted : '#fff', width: 42, height: 42, borderRadius: 12, cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>➤</button>
        </div>
      </div>
    </div>
  )
}

function Analytics({ user, t }) {
  const enrolled = user.enrolledCourses || []
  const enrolledCourses = getAllCourses().filter(c => enrolled.some(e => e.courseId === c._id || e === c._id))
  const progresses = enrolledCourses.map(c => ({ ...c, ...CP(c, user.courseProgress?.[c._id]) }))
  const lvl = getLvl(user.xp || 0)

  return <div style={{ padding: 32, maxWidth: 880, animation: 'fadeUp .4s ease' }}>
    <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 20 }}>📊 My Analytics</h2>
    <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
      <StatCard label="Enrolled" value={enrolledCourses.length} icon="📚" color={t.accent} t={t} d={0} />
      <StatCard label="Total XP" value={user.xp || 0} icon="⚡" color={t.warning} t={t} d={.05} />
      <StatCard label="Study Streak" value={`${user.streak || 0}d`} icon="🔥" color="#ef4444" t={t} d={.1} />
      <StatCard label="Notes Made" value={Object.keys(user.notes || {}).length} icon="📝" color={t.purple} t={t} d={.15} />
    </div>
    <Card t={t} style={{ padding: '18px 22px', marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ color: t.text, fontWeight: 800 }}>Level {lvl.cur.level} — {lvl.cur.title}</div>
        <div style={{ color: lvl.cur.color, fontWeight: 800 }}>{user.xp || 0} XP</div>
      </div>
      <PBar v={lvl.pct} color={lvl.cur.color} t={t} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {XP_LEVELS.map(l => <div key={l.level} style={{ textAlign: 'center', opacity: (user.xp || 0) >= l.min ? 1 : .35 }}><div style={{ fontSize: 14 }}>{(user.xp || 0) >= l.min ? '⭐' : '○'}</div><div style={{ color: l.color, fontSize: 9, fontWeight: 700 }}>Lv.{l.level}</div></div>)}
      </div>
    </Card>
    {progresses.length > 0 && <Card t={t} style={{ padding: '18px 22px', marginBottom: 18 }}>
      <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 18, fontSize: 15 }}>Course Progress</h3>
      {progresses.map((c, i) => <div key={c._id} style={{ marginBottom: 18, animation: `slideRight .4s ease ${i * .07}s both` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 9, background: c.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{c.icon}</div><div><div style={{ color: t.text, fontSize: 13, fontWeight: 700 }}>{c.title}</div><div style={{ color: t.textSub, fontSize: 11 }}>{c.done}/{c.total} videos</div></div></div>
          <div style={{ color: c.isComplete ? t.success : c.color, fontSize: 17, fontWeight: 900 }}>{c.pct}%</div>
        </div>
        <PBar v={c.pct} color={c.isComplete ? t.success : c.color} t={t} />
      </div>)}
    </Card>}
    {enrolledCourses.length > 0 && <Card t={t} style={{ padding: '18px 22px' }}>
      <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 16, fontSize: 15 }}>Video Completion Map</h3>
      {enrolledCourses.map(c => { const w = user.courseProgress?.[c._id] || []; return <div key={c._id} style={{ marginBottom: 12 }}><div style={{ color: t.textSub, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{c.icon} {c.title}</div><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{c.videos.map(v => <div key={v.id} title={v.title} style={{ width: 18, height: 18, borderRadius: 5, background: w.includes(v.id) ? c.color : t.border, boxShadow: w.includes(v.id) ? `0 0 6px ${c.color}60` : 'none', cursor: 'help' }} />)}</div></div> })}
    </Card>}
  </div>
}


// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATION QUIZ — 50-question mandatory end-of-course exam
// ─────────────────────────────────────────────────────────────────────────────
function CertificationQuiz({ course, user, onPass, onClose, t }) {
  const quiz = CERT_QUIZZES[course._id] || CERT_QUIZZES.c1
  // ALL hooks at top — never after conditional returns (Rules of Hooks)
  const [phase, setPhase] = useState('intro')
  const [answers, setAnswers] = useState({})
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState(null)
  const [fb, setFb] = useState(false)
  const [tabWarning, setTabWarning] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const total = quiz.questions.length
  const q = quiz.questions[cur] || quiz.questions[0]

  const resetExam = () => { setPhase('intro'); setAnswers({}); setCur(0); setSel(null); setFb(false); setShowCancelConfirm(false) }

  useEffect(() => {
    if (phase !== 'active') return
    const handleVisibility = () => { if (document.hidden) { resetExam(); setTabWarning(true) } }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [phase])

  const levelColor = { easy: t.success, moderate: t.warning, hard: t.danger }
  const levelBg = { easy: t.successSoft, moderate: t.warningSoft, hard: t.dangerSoft }

  const next = () => {
    const a = { ...answers, [cur]: sel }
    setAnswers(a)
    if (cur + 1 < total) { setCur(c => c + 1); setSel(null); setFb(false) }
    else setPhase('result')
  }

  const score = Object.entries(answers).filter(([i, a]) => quiz.questions[+i]?.ans === a).length
  const pct = Math.round(score / total * 100)
  const passed = score >= quiz.passMark

  if (phase === 'intro') return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
      <div style={{ background: t.bgCard, borderRadius: 24, maxWidth: 520, width: '100%', border: `1px solid ${t.border}`, boxShadow: t.shadow, animation: 'popIn .3s ease', overflow: 'hidden' }}>
        <div style={{ background: `linear-gradient(135deg,${t.accent},${t.purple})`, padding: '32px 36px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 15l-2 5-3-2-4 2 2-4-5-3 5-1 1-5 3 4 3-4 1 5 5 1-5 3z" stroke="white" strokeWidth="1.5" fill="none"/></svg>
          </div>
          <h2 style={{ color: '#fff', fontSize: 22, fontFamily: 'Lora,serif', marginBottom: 8 }}>Certification Exam</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{course.title}</p>
        </div>
        <div style={{ padding: '28px 36px' }}>
          {tabWarning && (
            <div style={{ background: t.dangerSoft, border: `1px solid ${t.danger}40`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{fontSize:18}}>⚠️</span>
              <div>
                <div style={{ color: t.danger, fontWeight: 800, fontSize: 13 }}>Exam Reset — Tab Switch Detected</div>
                <div style={{ color: t.textSub, fontSize: 12 }}>You switched tabs during the exam. Your answers were discarded. Please stay on this tab for the entire exam.</div>
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[['50', 'Questions'], ['35+', 'Pass Mark'], ['Easy/Med/Hard', 'Difficulty Mix']].map(([v, l]) => (
              <div key={l} style={{ background: t.bgInput, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ color: t.accent, fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{v}</div>
                <div style={{ color: t.textSub, fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}40`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: t.textSub, fontSize: 13 }}>
            ⚠️ <strong style={{color:t.warning}}>Anti-cheat active:</strong> Switching tabs will immediately reset your exam to the beginning.
          </div>
          <div style={{ background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 12, padding: '10px 14px', marginBottom: 20, color: t.textSub, fontSize: 12 }}>
            You must score 35/50 (70%) or above to receive your certificate. Complete all course videos first.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '11px 22px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 11, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }}>Not Now</button>
            <button onClick={() => { setTabWarning(false); setPhase('active') }} style={{ padding: '11px 28px', background: `linear-gradient(135deg,${t.accent},${t.purple})`, border: 'none', color: '#fff', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Start Exam →</button>
          </div>
        </div>
      </div>
    </div>
  )

  if (phase === 'result') {
    const easy = quiz.questions.filter(q=>q.level==='easy').length
    const med = quiz.questions.filter(q=>q.level==='moderate').length
    const hard = quiz.questions.filter(q=>q.level==='hard').length
    const easyScore = quiz.questions.filter((q,i)=>q.level==='easy'&&answers[i]===q.ans).length
    const medScore = quiz.questions.filter((q,i)=>q.level==='moderate'&&answers[i]===q.ans).length
    const hardScore = quiz.questions.filter((q,i)=>q.level==='hard'&&answers[i]===q.ans).length
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
        <div style={{ background: t.bgCard, borderRadius: 24, maxWidth: 560, width: '100%', border: `1px solid ${t.border}`, boxShadow: t.shadow, animation: 'popIn .3s ease', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ background: passed ? `linear-gradient(135deg,${t.success},#16a34a)` : `linear-gradient(135deg,${t.danger},#9b1c1c)`, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{passed ? '🎓' : '📚'}</div>
            <h2 style={{ color: '#fff', fontSize: 24, fontFamily: 'Lora,serif', marginBottom: 6 }}>{passed ? 'Congratulations!' : 'Keep Practicing'}</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>{passed ? 'You\'ve earned your certificate!' : `You scored ${score}/50. Need ${quiz.passMark} to pass.`}</p>
          </div>
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', border: `6px solid ${passed ? t.success : t.danger}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: passed ? t.success : t.danger, fontSize: 28, fontWeight: 900 }}>{score}</div>
                <div style={{ color: t.textSub, fontSize: 11 }}>out of 50</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[['Easy', easyScore, easy, t.success], ['Moderate', medScore, med, t.warning], ['Hard', hardScore, hard, t.danger]].map(([lbl, s, t2, col]) => (
                <div key={lbl} style={{ background: t.bgInput, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                  <div style={{ color: col, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
                  <div style={{ color: t.text, fontSize: 18, fontWeight: 800 }}>{s}/{t2}</div>
                </div>
              ))}
            </div>
            {passed && (
              <div style={{ background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 14, padding: '16px 20px', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ color: t.success, fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Certificate Issued!</div>
                <div style={{ color: t.textSub, fontSize: 12 }}>Check your email. Your certificate PDF is ready to download.</div>
                <div style={{ color: t.textMuted, fontSize: 11, marginTop: 6 }}>Cert ID: EDUAI-{course._id.toUpperCase()}-{user.email.split('@')[0].toUpperCase()}-{Date.now().toString(36).toUpperCase()}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {!passed && <button onClick={() => { setPhase('intro'); setAnswers({}); setCur(0); setSel(null); setFb(false) }} style={{ padding: '11px 22px', background: t.accent, border: 'none', color: '#fff', borderRadius: 11, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 700 }}>Retry Exam</button>}
              {passed && <button onClick={() => { onPass(score); onClose() }} style={{ padding: '11px 28px', background: `linear-gradient(135deg,${t.success},#16a34a)`, border: 'none', color: '#fff', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Get Certificate</button>}
              <button onClick={onClose} style={{ padding: '11px 22px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 11, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Active exam
  const easyCount = quiz.questions.slice(0, cur+1).filter(q=>q.level==='easy').length
  const modCount = quiz.questions.slice(0, cur+1).filter(q=>q.level==='moderate').length
  const hardCount = quiz.questions.slice(0, cur+1).filter(q=>q.level==='hard').length
  return (
    <div style={{ position: 'fixed', inset: 0, background: t.bg, zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', animation: 'fadeUp .3s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, background: t.bgCard, borderRadius: 14, padding: '14px 20px', border: `1px solid ${t.border}` }}>
          <div>
            <div style={{ color: t.text, fontWeight: 700, fontSize: 14 }}>🎓 Certification Exam — {course.title}</div>
            <div style={{ color: t.textSub, fontSize: 12, marginTop: 2 }}>Question {cur + 1} of {total} · Pass mark: {quiz.passMark}/50</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: t.successSoft, color: t.success, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 7 }}>Easy {easyCount}</span>
            <span style={{ background: t.warningSoft, color: t.warning, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 7 }}>Med {modCount}</span>
            <span style={{ background: t.dangerSoft, color: t.danger, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 7 }}>Hard {hardCount}</span>
            <button onClick={() => setShowCancelConfirm(true)}
              style={{ padding: '6px 14px', background: t.dangerSoft, border: `1px solid ${t.danger}40`, color: t.danger, borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif', marginLeft: 4 }}>
              ✕ Cancel
            </button>
          </div>
        </div>
        {/* Anti-cheat reminder */}
        <div style={{ background: t.warningSoft, border: `1px solid ${t.warning}30`, borderRadius: 10, padding: '7px 14px', marginBottom: 14, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{fontSize:13}}>🔒</span>
          <span style={{ color: t.textSub, fontSize: 11 }}>Anti-cheat active — switching tabs will reset your exam immediately</span>
        </div>
        {/* Cancel confirm dialog */}
        {showCancelConfirm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000, padding:20 }}>
            <div style={{ background:t.bgCard, borderRadius:20, padding:32, maxWidth:380, width:'100%', border:`1px solid ${t.danger}40`, boxShadow:t.shadow, animation:'popIn .25s ease', textAlign:'center' }}>
              <div style={{fontSize:44, marginBottom:12}}>⚠️</div>
              <h3 style={{ color:t.text, fontWeight:900, marginBottom:8 }}>Cancel Exam?</h3>
              <p style={{ color:t.textSub, fontSize:13, marginBottom:24 }}>Your progress will be lost. You can restart the exam at any time.</p>
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={() => setShowCancelConfirm(false)}
                  style={{ padding:'10px 22px', background:t.bgHover, border:`1px solid ${t.border}`, color:t.textSub, borderRadius:11, cursor:'pointer', fontSize:13, fontFamily:'Plus Jakarta Sans,sans-serif', fontWeight:600 }}>
                  Keep Going
                </button>
                <button onClick={() => { setShowCancelConfirm(false); resetExam(); onClose() }}
                  style={{ padding:'10px 22px', background:t.gDanger, border:'none', color:'#fff', borderRadius:11, cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif' }}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Progress bar */}
        <div style={{ background: t.border, borderRadius: 99, height: 6, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ width: `${((cur + 1) / total) * 100}%`, height: '100%', background: `linear-gradient(90deg,${t.accent},${t.purple})`, borderRadius: 99, transition: 'width .4s' }} />
        </div>
        {/* Question */}
        <div style={{ background: t.bgCard, borderRadius: 18, padding: '28px', border: `1px solid ${t.border}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ background: levelBg[q.level], color: levelColor[q.level], fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 7, textTransform: 'uppercase', letterSpacing: .5 }}>{q.level}</span>
            <span style={{ color: t.textMuted, fontSize: 12 }}>Q{cur + 1}</span>
          </div>
          <p style={{ color: t.text, fontSize: 16, fontWeight: 600, lineHeight: 1.65, marginBottom: 24 }}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.opts.map((opt, i) => {
              let bg = t.bgInput, border = t.border, col = t.textSub
              if (fb) {
                if (i === q.ans) { bg = t.successSoft; border = t.success; col = t.success }
                else if (i === sel && i !== q.ans) { bg = t.dangerSoft; border = t.danger; col = t.danger }
              } else if (i === sel) { bg = t.accentSoft; border = t.accent; col = t.accent }
              return (
                <button key={i} onClick={() => { if (!fb) { setSel(i); setFb(true) } }}
                  style={{ background: bg, border: `1.5px solid ${border}`, color: col, padding: '13px 16px', borderRadius: 12, cursor: fb ? 'default' : 'pointer', textAlign: 'left', fontSize: 14, fontFamily: 'Plus Jakarta Sans,sans-serif', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .15s', fontWeight: fb && i === q.ans ? 700 : 500 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0, background: fb && (i===q.ans||(i===sel&&i!==q.ans)) ? (i===q.ans?t.success:t.danger) : i===sel?t.accent:'transparent', color: fb&&(i===q.ans||i===sel)?'#fff':col }}>{fb&&i===q.ans?'✓':fb&&i===sel&&i!==q.ans?'✗':String.fromCharCode(65+i)}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
        {fb && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={next} style={{ padding: '12px 28px', background: `linear-gradient(135deg,${t.accent},${t.purple})`, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
              {cur + 1 < total ? 'Next Question →' : 'Submit Exam'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES EDITOR — proper component for ManageCourses resources tab
// ─────────────────────────────────────────────────────────────────────────────
function ResourcesEditor({ course, t, onUpdate }) {
  const [resources, setResources] = useState(course.resources || [])
  const [form, setForm] = useState({ name: '', type: 'pdf', url: '' })
  const add = () => {
    if (!form.name.trim()) return
    const updated = [...resources, { name: form.name.trim(), type: form.type, url: form.url.trim() }]
    setResources(updated); onUpdate(updated)
    setForm({ name: '', type: 'pdf', url: '' })
  }
  const remove = (i) => {
    const updated = resources.filter((_, idx) => idx !== i)
    setResources(updated); onUpdate(updated)
  }
  const inp = { background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 9, color: t.text, padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', width: '100%' }
  const typeIcon = { pdf: '📄', notes: '📝', link: '🔗', video: '🎬' }
  return (
    <div style={{ background: t.bgCard, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}` }}>
      {resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: t.textSub, fontSize: 13, marginBottom: 20 }}>No resources yet. Add PDFs, notes, or links below.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {resources.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.bgInput, borderRadius: 10, padding: '10px 14px', border: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 18 }}>{typeIcon[r.type] || '📎'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                {r.url && <div style={{ color: t.accent, fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.url}</div>}
              </div>
              <Badge text={r.type.toUpperCase()} color={t.textSub} />
              <button onClick={() => remove(i)} style={{ background: t.dangerSoft, border: 'none', color: t.danger, width: 28, height: 28, borderRadius: 7, cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: t.bgInput, borderRadius: 12, padding: '16px', border: `1px solid ${t.border}` }}>
        <div style={{ color: t.text, fontWeight: 700, marginBottom: 12, fontSize: 14 }}>➕ Add Resource</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 10 }}>
          <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Resource name *" style={inp} />
          <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} style={{...inp, cursor: 'pointer'}}>
            {['pdf', 'notes', 'link', 'video'].map(t2 => <option key={t2} value={t2}>{t2.toUpperCase()}</option>)}
          </select>
        </div>
        <input value={form.url} onChange={e => setForm(f => ({...f, url: e.target.value}))} placeholder="URL or file link (optional)" style={{...inp, marginBottom: 12}} />
        <button onClick={add} style={{ padding: '9px 20px', background: t.success, border: 'none', color: '#fff', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>+ Add Resource</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MANAGE COURSES — Educator's course management dashboard
// ─────────────────────────────────────────────────────────────────────────────
function ManageCourses({ user, setActive, t }) {
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState(null)
  const [editTab, setEditTab] = useState('details') // details | videos | resources
  const [editForm, setEditForm] = useState({})
  const [addVideoForm, setAddVideoForm] = useState({ title: '', duration: '10:00', ytId: '', isFree: false })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem('eduai_pending_courses') || '[]')
    const published = JSON.parse(localStorage.getItem('eduai_published_courses') || '[]')
    const all = [...pending, ...published].filter(c => c.instructorId === user.email)
    setCourses(all)
  }, [user.email])

  const saveEdit = () => {
    // Update in both pending and published stores
    const updateStore = (key) => {
      const arr = JSON.parse(localStorage.getItem(key) || '[]')
      const updated = arr.map(c => c.id === selected.id ? { ...c, ...editForm } : c)
      localStorage.setItem(key, JSON.stringify(updated))
    }
    updateStore('eduai_pending_courses')
    updateStore('eduai_published_courses')
    setSelected(s => ({ ...s, ...editForm }))
    setCourses(cs => cs.map(c => c.id === selected.id ? { ...c, ...editForm } : c))
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  const addVideo = () => {
    if (!addVideoForm.title.trim()) return
    const newVid = { id: 'v' + Date.now(), ...addVideoForm }
    const updateStore = (key) => {
      const arr = JSON.parse(localStorage.getItem(key) || '[]')
      const updated = arr.map(c => c.id === selected.id ? { ...c, videos: [...(c.videos||[]), newVid] } : c)
      localStorage.setItem(key, JSON.stringify(updated))
    }
    updateStore('eduai_pending_courses'); updateStore('eduai_published_courses')
    setSelected(s => ({ ...s, videos: [...(s.videos||[]), newVid] }))
    setCourses(cs => cs.map(c => c.id === selected.id ? { ...c, videos: [...(c.videos||[]), newVid] } : c))
    setAddVideoForm({ title: '', duration: '10:00', ytId: '', isFree: false })
  }

  const removeVideo = (vid) => {
    const updateStore = (key) => {
      const arr = JSON.parse(localStorage.getItem(key) || '[]')
      const updated = arr.map(c => c.id === selected.id ? { ...c, videos: (c.videos||[]).filter(v=>v.id!==vid.id) } : c)
      localStorage.setItem(key, JSON.stringify(updated))
    }
    updateStore('eduai_pending_courses'); updateStore('eduai_published_courses')
    setSelected(s => ({ ...s, videos: (s.videos||[]).filter(v=>v.id!==vid.id) }))
    setCourses(cs => cs.map(c => c.id === selected.id ? { ...c, videos: (c.videos||[]).filter(v=>v.id!==vid.id) } : c))
  }

  const inp = { width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 11, color: t.text, padding: '10px 13px', fontSize: 13, outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif' }

  if (!selected) return (
    <div style={{ padding: 32, animation: 'fadeUp .4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: t.text, fontSize: 20, fontFamily: 'Lora,serif', fontWeight: 700, margin: 0 }}>My Courses</h2>
          <p style={{ color: t.textSub, fontSize: 13, marginTop: 4 }}>{courses.length} course{courses.length !== 1 ? 's' : ''} created</p>
        </div>
        <button onClick={() => setActive('create-course')} style={{ padding: '10px 20px', background: t.accent, border: 'none', color: '#fff', borderRadius: 11, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>+ New Course</button>
      </div>
      {courses.length === 0 ? (
        <div style={{ background: t.bgCard, borderRadius: 20, padding: '60px 40px', textAlign: 'center', border: `1px solid ${t.border}` }}>
          <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&q=80" alt="Create" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, opacity: 0.7 }} />
          <h3 style={{ color: t.text, fontFamily: 'Lora,serif', marginBottom: 8 }}>No courses yet</h3>
          <p style={{ color: t.textSub, fontSize: 13, marginBottom: 20 }}>Share your knowledge — create your first course and reach hundreds of students.</p>
          <button onClick={() => setActive('create-course')} style={{ padding: '12px 28px', background: t.accent, border: 'none', color: '#fff', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Create First Course →</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {courses.map((c, i) => (
            <div key={i} className="card-lift" style={{ background: t.bgCard, borderRadius: 16, border: `1px solid ${t.border}`, padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: t.bgInput }}>
                <img src={COURSE_IMAGES[c.thumb] || COURSE_IMAGES.default} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 15 }}>{c.title}</div>
                <div style={{ color: t.textSub, fontSize: 12, marginTop: 3 }}>{(c.videos||[]).length} videos · {c.price === 0 ? 'Free' : `₹${c.price}`} · {c.category}</div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ background: c.approvalStatus === 'approved' ? t.successSoft : c.approvalStatus === 'rejected' ? t.dangerSoft : t.warningSoft, color: c.approvalStatus === 'approved' ? t.success : c.approvalStatus === 'rejected' ? t.danger : t.warning, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                    {c.approvalStatus === 'approved' ? 'Published' : c.approvalStatus === 'rejected' ? 'Rejected' : 'Pending Review'}
                  </span>
                </div>
              </div>
              <button onClick={() => { setSelected(c); setEditForm({ title: c.title, shortDesc: c.shortDesc||'', description: c.description||'', price: c.price||0, category: c.category||'CS Core' }) }} style={{ padding: '9px 18px', background: t.bgHover, border: `1px solid ${t.border}`, color: t.textSub, borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600 }}>Manage →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div style={{ padding: 32, animation: 'fadeUp .4s ease', maxWidth: 800 }}>
      <button onClick={() => setSelected(null)} style={{ background: t.bgCard, border: `1px solid ${t.border}`, color: t.textSub, padding: '7px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600, marginBottom: 20 }}>← All Courses</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
          <img src={COURSE_IMAGES[selected.thumb] || COURSE_IMAGES.default} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h2 style={{ color: t.text, fontFamily: 'Lora,serif', fontSize: 20, fontWeight: 700, margin: 0 }}>{selected.title}</h2>
          <div style={{ color: t.textSub, fontSize: 13, marginTop: 3 }}>{(selected.videos||[]).length} videos · <span style={{ color: selected.approvalStatus==='approved'?t.success:t.warning }}>{selected.approvalStatus === 'approved' ? 'Published' : 'Pending Review'}</span></div>
        </div>
      </div>
      {saved && <div style={{ background: t.successSoft, border: `1px solid ${t.success}40`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: t.success, fontWeight: 700, fontSize: 13 }}>✓ Changes saved successfully</div>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {[['details','Course Details'],['videos','Videos'],['resources','Resources']].map(([id,lbl]) => (
          <button key={id} onClick={() => setEditTab(id)} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', background: editTab===id ? t.accent : t.bgCard, color: editTab===id ? '#fff' : t.textSub, fontSize: 13, fontWeight: editTab===id ? 700 : 500, border: editTab===id ? 'none' : `1px solid ${t.border}` }}>{lbl}</button>
        ))}
      </div>
      {editTab === 'details' && (
        <div style={{ background: t.bgCard, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['title','Course Title'],['shortDesc','Short Description'],['category','Category'],['price','Price (₹)']].map(([k,l]) => (
            <div key={k}>
              <label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>{l}</label>
              <input value={editForm[k]||''} onChange={e=>setEditForm(f=>({...f,[k]:e.target.value}))} style={inp} />
            </div>
          ))}
          <div><label style={{ color: t.textSub, fontSize: 12, display: 'block', marginBottom: 5, fontWeight: 600 }}>Full Description</label>
            <textarea value={editForm.description||''} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} rows={4} style={{...inp, resize:'vertical'}} />
          </div>
          <button onClick={saveEdit} style={{ padding: '12px 24px', background: t.accent, border: 'none', color: '#fff', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif', alignSelf: 'flex-start' }}>Save Changes</button>
        </div>
      )}
      {editTab === 'videos' && (
        <div style={{ background: t.bgCard, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {(selected.videos||[]).map((v, i) => (
              <div key={i} style={{ background: t.bgInput, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                {v.ytId && <img src={`https://img.youtube.com/vi/${v.ytId}/default.jpg`} alt="" style={{ width: 56, height: 40, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{i+1}. {v.title}</div>
                  <div style={{ color: t.textSub, fontSize: 11, marginTop: 2 }}>{v.duration} {v.isFree ? '· FREE preview' : ''} {v.ytId ? `· YT: ${v.ytId}` : ''}</div>
                </div>
                <button onClick={() => removeVideo(v)} style={{ background: t.dangerSoft, border: 'none', color: t.danger, width: 28, height: 28, borderRadius: 7, cursor: 'pointer', fontSize: 14 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ background: t.bgInput, borderRadius: 14, padding: '18px', border: `1px solid ${t.border}` }}>
            <div style={{ color: t.text, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Add New Video</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input value={addVideoForm.title} onChange={e=>setAddVideoForm(f=>({...f,title:e.target.value}))} placeholder="Video title *" style={inp} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input value={addVideoForm.duration} onChange={e=>setAddVideoForm(f=>({...f,duration:e.target.value}))} placeholder="Duration (e.g. 15:30)" style={inp} />
                <input value={addVideoForm.ytId} onChange={e=>setAddVideoForm(f=>({...f,ytId:e.target.value}))} placeholder="YouTube video ID (optional)" style={inp} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.textSub, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={addVideoForm.isFree} onChange={e=>setAddVideoForm(f=>({...f,isFree:e.target.checked}))} />
                Free preview video
              </label>
              <button onClick={addVideo} style={{ padding: '10px 20px', background: t.success, border: 'none', color: '#fff', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif', alignSelf: 'flex-start' }}>+ Add Video</button>
            </div>
          </div>
        </div>
      )}
      {editTab === 'resources' && (
        <ResourcesEditor course={selected} t={t} onUpdate={(updatedResources) => {
          const updateStore = (key) => {
            const arr = JSON.parse(localStorage.getItem(key) || '[]')
            const updated = arr.map(c => c.id === selected.id ? { ...c, resources: updatedResources } : c)
            localStorage.setItem(key, JSON.stringify(updated))
          }
          updateStore('eduai_pending_courses'); updateStore('eduai_published_courses')
          setSelected(s => ({ ...s, resources: updatedResources }))
          setCourses(cs => cs.map(c => c.id === selected.id ? { ...c, resources: updatedResources } : c))
        }} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION PAGE
// ─────────────────────────────────────────────────────────────────────────────
function SubscriptionPage({ user, onSubscribe, t }) {
  const hasActiveSub = user.subscription?.status === 'active' && new Date(user.subscription?.endDate) > new Date()
  const [showModal, setShowModal] = useState(false)

  const plans = [
    { id: 'free', name: 'Free', price: 0, period: '', color: t.textSub, icon: '🎓', features: ['4 free courses', 'Basic AI Tutor (5 questions/day)', 'Quizzes & Leaderboard', 'XP & Badges'], locked: [] },
    { id: 'pro', name: 'Pro', price: 299, period: '/month', color: t.accent, icon: '⚡', features: ['Everything in Free', 'All subscription courses', 'Unlimited AI Tutor', 'AI-generated notes', 'Downloadable resources', 'Certificate of completion'], locked: [] },
    { id: 'premium', name: 'Premium', price: 1999, period: '/year', color: '#f59e0b', icon: '👑', features: ['Everything in Pro', '1 full year access', 'Priority support', 'Mock interview sessions', 'Resume review', 'Job placement assistance', '🎯 Best Value — Save ₹1,589!'], locked: [] },
  ]

  return (
    <div style={{ padding: 32, maxWidth: 860, animation: 'fadeUp .4s ease' }}>
      <h2 style={{ color: t.text, fontSize: 22, fontWeight: 900, marginBottom: 6 }}>👑 Subscription Plans</h2>
      <p style={{ color: t.textSub, fontSize: 14, marginBottom: 24 }}>Unlock all premium and subscription-only courses</p>

      {hasActiveSub && (
        <div style={{ background: `linear-gradient(135deg,#f59e0b18,#d9770612)`, border: `1px solid #f59e0b50`, borderRadius: 18, padding: '18px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👑</div>
          <div>
            <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: 16 }}>{user.subscription.plan.toUpperCase()} Plan — Active</div>
            <div style={{ color: t.textSub, fontSize: 13, marginTop: 3 }}>Access until {new Date(user.subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}><Badge text="✅ Active" color="#f59e0b" /></div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 28 }}>
        {plans.map(p => {
          const isCurrent = user.subscription?.plan === p.id && hasActiveSub
          return (
            <div key={p.id} style={{ background: t.bgCard, borderRadius: 22, border: `2px solid ${isCurrent ? p.color : (p.id === 'premium' ? '#f59e0b40' : t.border)}`, padding: '24px 22px', position: 'relative', transition: 'all .2s', boxShadow: isCurrent ? `0 0 0 2px ${p.color}40` : t.shadowCard }}>
              {p.id === 'premium' && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 14px', borderRadius: '0 0 10px 10px', letterSpacing: 1 }}>BEST VALUE</div>}
              {isCurrent && <div style={{ position: 'absolute', top: 14, right: 14 }}><Badge text="Current Plan" color={p.color} /></div>}
              <div style={{ fontSize: 32, marginBottom: 10 }}>{p.icon}</div>
              <div style={{ color: p.color, fontWeight: 900, fontSize: 18, marginBottom: 4 }}>{p.name}</div>
              <div style={{ color: t.text, fontWeight: 900, fontSize: 28, marginBottom: 16 }}>
                {p.price === 0 ? 'Free' : `₹${p.price}`}
                <span style={{ fontSize: 13, color: t.textSub, fontWeight: 400 }}>{p.period}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: t.textSub, fontSize: 13 }}>
                    <span style={{ color: p.color, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              {p.id === 'free'
                ? <div style={{ width: '100%', padding: '11px', background: t.bgHover, border: `1px solid ${t.border}`, borderRadius: 12, color: t.textSub, fontSize: 14, fontWeight: 700, textAlign: 'center' }}>{hasActiveSub ? 'Downgrade (on expiry)' : '✅ Your Current Plan'}</div>
                : isCurrent
                  ? <div style={{ width: '100%', padding: '11px', background: p.color + '20', border: `1px solid ${p.color}40`, borderRadius: 12, color: p.color, fontSize: 14, fontWeight: 700, textAlign: 'center' }}>✅ Active</div>
                  : <button onClick={() => setShowModal(true)} style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg,${p.color},${p.color}cc)`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: `0 4px 18px ${p.color}40` }}>
                      Subscribe {p.icon}
                    </button>
              }
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <Card t={t} style={{ padding: '20px 24px' }}>
        <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 16, fontSize: 15 }}>❓ Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['Can I cancel anytime?', 'Yes. Your plan stays active until the end of the billing period.'],
            ['Do purchased courses stay after cancellation?', 'Yes — one-time purchases are yours forever. Subscription access ends when plan expires.'],
            ['What payment methods are accepted?', 'UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Net Banking via Razorpay.'],
            ['Is there a student discount?', 'Premium is already priced for students. Email support for institutional bulk discounts.'],
          ].map(([q, a]) => (
            <div key={q} style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 12 }}>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{q}</div>
              <div style={{ color: t.textSub, fontSize: 12 }}>{a}</div>
            </div>
          ))}
        </div>
      </Card>

      {showModal && <SubscriptionModal onConfirm={(plan) => { onSubscribe(plan); setShowModal(false) }} onClose={() => setShowModal(false)} t={t} currentPlan={user.subscription?.plan} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [active, setActive] = useState(null)
  const [isDark, setIsDark] = useState(true)
  const [viewCourse, setViewCourse] = useState(null)
  const [purchaseModal, setPurchaseModal] = useState(null)
  const [subscriptionModal, setSubscriptionModal] = useState(false)
  const [xpFloats, setXpFloats] = useState([])
  const [badgeToasts, setBadgeToasts] = useState([])
  const t = isDark ? THEMES.dark : THEMES.light

  useEffect(() => {
    const th = localStorage.getItem('eduai_theme')
    if (th) setIsDark(th !== 'light')
    const u = localStorage.getItem('eduai_current_user')
    if (u) { try { const parsed = JSON.parse(u); setUser(parsed); setActive(parsed.role === 'educator' ? 'edu-dashboard' : parsed.role === 'admin' ? 'admin' : 'dashboard') } catch { localStorage.removeItem('eduai_current_user') } }
  }, [])

  const toggleTheme = () => setIsDark(d => { localStorage.setItem('eduai_theme', !d ? 'dark' : 'light'); return !d })

  const save = useCallback((u) => { localStorage.setItem('eduai_current_user', JSON.stringify(u)); if (u.email) localStorage.setItem(`eduai_user_${u.email}`, JSON.stringify(u)) }, [])

  const handleLogin = (u) => { setUser(u); setActive(u.role === 'educator' ? 'edu-dashboard' : u.role === 'admin' ? 'admin' : 'dashboard'); save(u) }
  const handleLogout = () => { if (user) save(user); localStorage.removeItem('eduai_current_user'); setUser(null); setActive(null) }

  const handleSubscribe = (plan) => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + (plan === 'premium' ? 365 : 30))
    updateUser(prev => ({ ...prev, subscription: { plan, status: 'active', startDate: new Date().toISOString(), endDate: endDate.toISOString() } }), { purchased: true })
    setSubscriptionModal(false)
    addXP(100)
  }

  const addXP = (amount, e) => { const id = Date.now(); const x = e?.clientX || window.innerWidth / 2; const y = e?.clientY || window.innerHeight / 2; setXpFloats(p => [...p, { id, amount, x: x - 30, y: y - 20 }]) }

  const updateUser = useCallback((updater, event = {}) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      const { earned, newBadges } = checkBadges(updated, event)
      updated.badges = earned
      if (newBadges.length) setBadgeToasts(t => [...t, ...newBadges])
      save(updated)
      return updated
    })
  }, [save])

  const handleWatchVideo = useCallback((courseId, videoId, e) => {
    const course = DEMO_COURSES.find(c => c._id === courseId)
    const xpGain = course?.xpPerVideo || 25
    updateUser(prev => {
      const watched = prev.courseProgress?.[courseId] || []
      if (watched.includes(videoId)) return prev
      const today = TODAY()
      let streak = prev.streak || 0, days = prev.totalDaysStudied || 0
      if (prev.lastStudyDate !== today) {
        const yest = new Date(); yest.setDate(yest.getDate() - 1)
        const yk = yest.toISOString().split('T')[0]
        streak = prev.lastStudyDate === yk ? streak + 1 : 1; days++
      }
      addXP(xpGain, e)
      return { ...prev, xp: (prev.xp || 0) + xpGain, streak, totalDaysStudied: days, lastStudyDate: today, courseProgress: { ...prev.courseProgress, [courseId]: [...watched, videoId] } }
    })
  }, [updateUser])

  const handleEnroll = (course) => {
    const nc = normalizeCourse(course)
    updateUser(prev => ({ ...prev, enrolledCourses: [...(prev.enrolledCourses || []), { courseId: nc._id, enrolledAt: new Date().toISOString(), paidAmount: 0 }] }))
    // Update enrollment count in localStorage courses
    const updateEnrollment = (key) => {
      try {
        const arr = JSON.parse(localStorage.getItem(key) || '[]')
        const updated = arr.map(c => (c.id === nc._id || c._id === nc._id) ? { ...c, totalEnrollments: (c.totalEnrollments || 0) + 1, enrolledStudents: [...(c.enrolledStudents || [])] } : c)
        localStorage.setItem(key, JSON.stringify(updated))
      } catch {}
    }
    updateEnrollment('eduai_published_courses')
    sendEmail(user?.email || '', `✅ Enrolled in ${nc.title}`, `You have successfully enrolled in "${nc.title}".\n\nStart learning now in My Learning section.\n\nEduAI Team`, 'success')
    setViewCourse(nc); setActive('my-courses')
  }

  const handlePurchaseConfirm = (course) => {
    const nc = normalizeCourse(course)
    updateUser(prev => ({ ...prev, enrolledCourses: [...(prev.enrolledCourses || []), { courseId: nc._id, enrolledAt: new Date().toISOString(), paidAmount: nc.price }] }), { purchased: true })
    addXP(50)
    // Update educator wallet and enrollment count
    try {
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith('eduai_user_'))
      allKeys.forEach(key => {
        const edu = JSON.parse(localStorage.getItem(key) || '{}')
        if (edu.email === nc.instructorId) {
          const earnings = Math.round(nc.price * 0.8)
          edu.walletBalance = (edu.walletBalance || 0) + earnings
          edu.totalRevenue = (edu.totalRevenue || 0) + earnings
          edu.totalEarnings = (edu.totalRevenue || 0)
          edu.totalStudents = (edu.totalStudents || 0) + 1
          localStorage.setItem(key, JSON.stringify(edu))
          sendEmail(edu.email, ` New Enrollment: ${nc.title}`, `A student enrolled in your course "${nc.title}".\nYou earned: ₹${earnings} (80%).\nWallet balance: ₹${edu.walletBalance}\n\nEduAI Platform`, 'success')
        }
      })
      const arr = JSON.parse(localStorage.getItem('eduai_published_courses') || '[]')
      const updated = arr.map(c => (c.id === nc._id || c._id === nc._id) ? { ...c, totalEnrollments: (c.totalEnrollments || 0) + 1 } : c)
      localStorage.setItem('eduai_published_courses', JSON.stringify(updated))
    } catch {}
    sendEmail(user?.email || '', `✅ Purchase Successful: ${nc.title}`, `You have successfully purchased "${nc.title}" for ₹${nc.price}.\n\nStart learning now!\n\nEduAI Team`, 'success')
  }
  const handleGenerateNotes = (courseId, videoId, notes) => { updateUser(prev => ({ ...prev, notes: { ...(prev.notes || {}), [`${courseId}_${videoId}`]: notes }, notesGenerated: (prev.notesGenerated || 0) + 1 })) }
  const handleAIQuestion = () => { updateUser(prev => ({ ...prev, aiQuestions: (prev.aiQuestions || 0) + 1 })) }
  const handleQuizXP = (amount, perfect) => { updateUser(prev => ({ ...prev, xp: (prev.xp || 0) + amount }), { quizPerfect: perfect }); addXP(amount) }
  const handleEducatorUpdate = (fields) => { updateUser(prev => ({ ...prev, ...fields, expertise: typeof fields.expertise === 'string' ? fields.expertise.split(',').map(s => s.trim()).filter(Boolean) : fields.expertise })) }

  if (!user) return <AuthScreen onLogin={handleLogin} t={t} isDark={isDark} onToggleTheme={toggleTheme} />

  const renderContent = () => {
    if (user.role === 'admin') return <AdminPanel t={t} adminEmail={user.email} />
    if (user.role === 'educator') {
      switch (active) {
        case 'edu-dashboard': return <EducatorDashboard user={user} setActive={setActive} t={t} />
        case 'create-course': return <CreateCourse user={user} onCreated={() => setActive('my-courses-edu')} t={t} />
        case 'wallet': return <Wallet user={user} t={t} />
        case 'edu-profile': return <EducatorProfile user={user} onUpdate={handleEducatorUpdate} t={t} />
        case 'my-courses-edu': return <ManageCourses user={user} setActive={setActive} t={t} />
        case 'edu-analytics': return (
          <div style={{ padding: 32, animation: 'fadeUp .4s ease', maxWidth: 900 }}>
            <h2 style={{ color: t.text, fontSize: 20, fontFamily: 'Lora,serif', fontWeight: 700, marginBottom: 20 }}>📊 Course Analytics</h2>
            {(() => {
              const pending = JSON.parse(localStorage.getItem('eduai_pending_courses') || '[]')
              const published = JSON.parse(localStorage.getItem('eduai_published_courses') || '[]')
              const courses = [...pending, ...published].filter(c => c.instructorId === user.email)
              const totalStudents = courses.reduce((s, c) => s + (c.totalEnrollments || 0), 0)
              const totalEarnings = courses.reduce((s, c) => s + ((c.totalEnrollments || 0) * (c.price || 0) * 0.8), 0)
              if (!courses.length) return (
                <Card t={t} style={{ padding: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
                  <div style={{ color: t.textSub, fontSize: 14 }}>No courses yet. Create a course to see analytics.</div>
                </Card>
              )
              return (
                <>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                    <StatCard label="Total Courses" value={courses.length} icon="📚" color={t.accent} sub="Created" t={t} d={0} />
                    <StatCard label="Published" value={courses.filter(c => c.approvalStatus === 'approved').length} icon="🚀" color={t.success} sub="Live" t={t} d={.05} />
                    <StatCard label="Total Students" value={totalStudents} icon="👥" color={t.purple} sub="Enrolled" t={t} d={.1} />
                    <StatCard label="Total Earnings" value={`₹${Math.round(totalEarnings)}`} icon="💰" color={t.warning} sub="80% revenue" t={t} d={.15} />
                  </div>
                  <Card t={t} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', borderBottom: `1px solid ${t.border}`, background: t.bgHover }}>
                      <div style={{ color: t.text, fontWeight: 800, fontSize: 14 }}>Per-Course Breakdown</div>
                    </div>
                    {courses.map((c, i) => {
                      const enrolled = c.totalEnrollments || 0
                      const revenue = Math.round(enrolled * (c.price || 0) * 0.8)
                      // Count how many students have this course in their enrolledCourses
                      const allUserKeys = Object.keys(localStorage).filter(k => k.startsWith('eduai_user_'))
                      const realEnrolled = allUserKeys.filter(k => {
                        try {
                          const u = JSON.parse(localStorage.getItem(k))
                          return (u.enrolledCourses || []).some(e => e.courseId === c.id || e.courseId === c._id)
                        } catch { return false }
                      }).length
                      return (
                        <div key={i} style={{ padding: '14px 20px', borderBottom: i < courses.length - 1 ? `1px solid ${t.border}` : 'none', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: (c.color || t.accent) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon || '📚'}</div>
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <div style={{ color: t.text, fontWeight: 700, fontSize: 14 }}>{c.title}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                              <span style={{ background: c.approvalStatus === 'approved' ? t.successSoft : t.warningSoft, color: c.approvalStatus === 'approved' ? t.success : t.warning, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>
                                {c.approvalStatus === 'approved' ? '🟢 Published' : '⏳ Pending'}
                              </span>
                              <span style={{ color: t.textSub, fontSize: 12 }}>{(c.videos || []).length} videos</span>
                              <span style={{ color: t.textSub, fontSize: 12 }}>{c.price === 0 ? 'Free' : `₹${c.price}`}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ color: t.accent, fontWeight: 900, fontSize: 20 }}>{realEnrolled}</div>
                              <div style={{ color: t.textSub, fontSize: 10 }}>Students</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ color: t.success, fontWeight: 900, fontSize: 20 }}>₹{revenue}</div>
                              <div style={{ color: t.textSub, fontSize: 10 }}>Earnings</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </Card>
                </>
              )
            })()}
          </div>
        )
        default: return <EducatorDashboard user={user} setActive={setActive} t={t} />
      }
    }
    // Student
    switch (active) {
      case 'dashboard': return <StudentDashboard user={user} setActive={setActive} setViewCourse={setViewCourse} t={t} />
      case 'marketplace': return <Marketplace user={user} onEnroll={handleEnroll} onPurchase={(c) => setPurchaseModal(c)} onSubscribe={() => setSubscriptionModal(true)} setActive={setActive} setViewCourse={setViewCourse} t={t} />
      case 'my-courses': return <MyLearning user={user} viewCourse={viewCourse} setViewCourse={setViewCourse} onWatchVideo={handleWatchVideo} onGenerateNotes={handleGenerateNotes} t={t} />
      case 'quiz': return <QuizPage t={t} onXP={handleQuizXP} />
      case 'ai-tutor': return <AITutor user={user} t={t} onQuestion={handleAIQuestion} />
      case 'leaderboard': return <Leaderboard user={user} t={t} />
      case 'achievements': return <Achievements user={user} t={t} />
      case 'analytics': return <Analytics user={user} t={t} />
      case 'subscription': return <SubscriptionPage user={user} onSubscribe={handleSubscribe} t={t} />
      default: return <StudentDashboard user={user} setActive={setActive} setViewCourse={setViewCourse} t={t} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: t.bg, fontFamily: "'Outfit',sans-serif", overflow: 'hidden', transition: 'background .35s' }}>
      <GS t={t} />
      <Sidebar active={active} setActive={(tab) => { setActive(tab); if (tab !== 'my-courses' && tab !== 'marketplace') setViewCourse(null) }} user={user} onLogout={handleLogout} t={t} isDark={isDark} onToggle={toggleTheme} />
      <main style={{ flex: 1, overflowY: 'auto', transition: 'background .35s' }}>{renderContent()}</main>

      {xpFloats.map(f => <XPFloat key={f.id} amount={f.amount} x={f.x} y={f.y} onDone={() => setXpFloats(p => p.filter(x => x.id !== f.id))} />)}
      {badgeToasts.length > 0 && <BadgeToast badgeId={badgeToasts[0]} onDone={() => setBadgeToasts(p => p.slice(1))} t={t} />}
      {purchaseModal && <PurchaseModal course={purchaseModal} onConfirm={handlePurchaseConfirm} onClose={() => setPurchaseModal(null)} t={t} />}
      {subscriptionModal && <SubscriptionModal onConfirm={handleSubscribe} onClose={() => setSubscriptionModal(false)} t={t} currentPlan={user?.subscription?.plan} />}
    </div>
  )
}

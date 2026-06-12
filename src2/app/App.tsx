import { useState } from "react";
import { CourseCard, type Course } from "./components/CourseCard";
import { CourseDetail } from "./components/CourseDetail";

{/* MARKER-MAKE-KIT-INVOKED */}

const COURSES: Course[] = [
  {
    id: "1",
    title: "Full-Stack Web Development with React & Node",
    instructor: "Elena Marchetti",
    category: "Development",
    duration: "42h 30m",
    students: 18420,
    rating: 4.8,
    price: 89,
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    description: "Master the complete modern web development stack. You'll build real-world applications from scratch using React on the front end and Node.js with Express on the back end, with a focus on clean architecture and production-ready code.",
    skills: [
      "Build scalable REST APIs with Node.js & Express",
      "Create dynamic UIs with React and hooks",
      "Manage state with Redux Toolkit",
      "Work with PostgreSQL and MongoDB",
      "Deploy applications to AWS and Vercel",
      "Write unit and integration tests",
    ],
    lessons: [
      { title: "Introduction & Environment Setup", duration: "45m" },
      { title: "JavaScript Fundamentals Refresher", duration: "1h 20m" },
      { title: "React Components & JSX", duration: "1h 10m" },
      { title: "Hooks: useState, useEffect, useContext", duration: "1h 45m" },
      { title: "Building a REST API with Express", duration: "2h 00m" },
      { title: "Database Design with PostgreSQL", duration: "1h 30m" },
      { title: "Authentication & Authorization", duration: "1h 55m" },
      { title: "Deployment & CI/CD Pipelines", duration: "1h 00m" },
    ],
  },
  {
    id: "2",
    title: "Data Science: From Zero to Production",
    instructor: "Dr. Amara Osei",
    category: "Data Science",
    duration: "36h 00m",
    students: 12850,
    rating: 4.9,
    price: 94,
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    description: "A rigorous, practical data science curriculum that takes you from Python basics through machine learning and into production deployment. Built for professionals who want real skills, not just theory.",
    skills: [
      "Python for data analysis with pandas & NumPy",
      "Data visualization with Matplotlib & Seaborn",
      "Statistical analysis and hypothesis testing",
      "Machine learning with scikit-learn",
      "Deep learning fundamentals with PyTorch",
      "Deploy models as REST APIs",
    ],
    lessons: [
      { title: "Python & Jupyter Notebooks", duration: "1h 00m" },
      { title: "Data Wrangling with pandas", duration: "2h 20m" },
      { title: "Exploratory Data Analysis", duration: "1h 40m" },
      { title: "Statistics for Data Science", duration: "2h 00m" },
      { title: "Supervised Learning Algorithms", duration: "2h 30m" },
      { title: "Model Evaluation & Tuning", duration: "1h 50m" },
      { title: "Neural Networks & Deep Learning", duration: "3h 00m" },
      { title: "Productionizing ML Models", duration: "1h 20m" },
    ],
  },
  {
    id: "3",
    title: "UI/UX Design: Craft Interfaces That Convert",
    instructor: "Sophie Lindström",
    category: "Design",
    duration: "28h 15m",
    students: 9340,
    rating: 4.7,
    price: 79,
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1597418895783-f7de85be2839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    description: "Learn design thinking, user research, wireframing, and high-fidelity prototyping in Figma. This course blends theory with hands-on projects that build a professional portfolio ready for the job market.",
    skills: [
      "User research and persona development",
      "Information architecture & user flows",
      "Wireframing and low-fidelity prototyping",
      "High-fidelity design in Figma",
      "Design systems and component libraries",
      "Usability testing and iteration",
    ],
    lessons: [
      { title: "Design Thinking Framework", duration: "55m" },
      { title: "User Research Methods", duration: "1h 30m" },
      { title: "Information Architecture", duration: "1h 10m" },
      { title: "Wireframing in Figma", duration: "2h 00m" },
      { title: "Visual Design Principles", duration: "1h 45m" },
      { title: "Building a Design System", duration: "2h 20m" },
      { title: "Prototyping & Animations", duration: "1h 30m" },
      { title: "Portfolio Project Walkthrough", duration: "1h 00m" },
    ],
  },
  {
    id: "4",
    title: "Business Strategy for the Digital Age",
    instructor: "Marcus Van Der Berg",
    category: "Business",
    duration: "22h 00m",
    students: 7210,
    rating: 4.6,
    price: 69,
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    description: "A practical MBA-style curriculum condensed into a focused online course. Learn competitive analysis, digital business models, financial fundamentals, and leadership frameworks used at Fortune 500 companies.",
    skills: [
      "Competitive analysis with Porter's Five Forces",
      "Digital business model design",
      "Financial statement interpretation",
      "Go-to-market strategy development",
      "OKR and KPI frameworks",
      "Leadership and team management",
    ],
    lessons: [
      { title: "Strategic Thinking Fundamentals", duration: "1h 00m" },
      { title: "Market Analysis Frameworks", duration: "1h 30m" },
      { title: "Digital Business Models", duration: "1h 20m" },
      { title: "Financial Literacy for Leaders", duration: "2h 00m" },
      { title: "Go-to-Market Strategy", duration: "1h 40m" },
      { title: "Product & Pricing Strategy", duration: "1h 15m" },
      { title: "Leading High-Performance Teams", duration: "1h 30m" },
      { title: "Capstone: Strategy Presentation", duration: "45m" },
    ],
  },
  {
    id: "5",
    title: "Advanced Python: Concurrency & System Design",
    instructor: "Hiroshi Tanaka",
    category: "Development",
    duration: "31h 45m",
    students: 5890,
    rating: 4.9,
    price: 99,
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    description: "Go deep into Python's internals. This course covers concurrency with asyncio and multiprocessing, system design patterns, performance profiling, and building scalable, maintainable Python services.",
    skills: [
      "Async programming with asyncio",
      "Multiprocessing and threading",
      "Profiling and performance optimization",
      "Design patterns in Python",
      "Distributed systems fundamentals",
      "Building high-throughput microservices",
    ],
    lessons: [
      { title: "Python Internals & the GIL", duration: "1h 30m" },
      { title: "Threading vs. Multiprocessing", duration: "2h 00m" },
      { title: "Asyncio Deep Dive", duration: "2h 30m" },
      { title: "Profiling & Benchmarking", duration: "1h 45m" },
      { title: "Design Patterns in Python", duration: "2h 15m" },
      { title: "Distributed Systems 101", duration: "2h 00m" },
      { title: "Building a Scalable Microservice", duration: "3h 00m" },
      { title: "Testing Async Code", duration: "1h 20m" },
    ],
  },
  {
    id: "6",
    title: "Photography: Light, Composition & Story",
    instructor: "Nadia Petrov",
    category: "Creative",
    duration: "18h 30m",
    students: 11650,
    rating: 4.8,
    price: 59,
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1759984782106-4b56d0aa05b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    description: "Learn to see and capture the world like a professional photographer. From understanding your camera's settings to mastering natural light and post-processing in Lightroom, this course builds lasting visual storytelling skills.",
    skills: [
      "Camera settings: aperture, shutter, ISO",
      "Understanding and controlling light",
      "Composition rules and when to break them",
      "Street, portrait, and landscape photography",
      "Post-processing workflow in Lightroom",
      "Building a cohesive photography portfolio",
    ],
    lessons: [
      { title: "Understanding Your Camera", duration: "1h 10m" },
      { title: "The Exposure Triangle", duration: "1h 30m" },
      { title: "Mastering Natural Light", duration: "1h 45m" },
      { title: "Composition Fundamentals", duration: "1h 20m" },
      { title: "Portrait Photography", duration: "1h 30m" },
      { title: "Street & Documentary Photography", duration: "1h 15m" },
      { title: "Lightroom Editing Workflow", duration: "2h 00m" },
      { title: "Building Your Portfolio", duration: "55m" },
    ],
  },
];

const CATEGORIES = ["Todas", "Química", "Biología", "Física", "Anatomia", "Engenharia"];

export default function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.35rem", color: "var(--primary)" }}>
            Lumina
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Browse</a>
            <a href="#" className="hover:text-foreground transition-colors">Instructors</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              Sign in
            </button>
            <button className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-sm tracking-widest uppercase mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
            Expert-led online courses
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1 }} className="mb-6">
            Skills that shape<br />
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>your future.</em>
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}>
            Learn from practitioners, not academics. Every course is built around real-world outcomes.
          </p>
          <div className="relative max-w-lg mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses or instructors…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl pl-12 pr-4 py-3.5 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-accent text-sm transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-accent/20 border-y border-border py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12">
          {[
            { value: "65,000+", label: "Students enrolled" },
            { value: "180+", label: "Expert instructors" },
            { value: "4.8 ★", label: "Average rating" },
            { value: "94%", label: "Completion rate" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }} className="mb-1">
              Featured Courses
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available
            </p>
          </div>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onClick={setSelectedCourse} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem" }}>No courses found</p>
            <p className="text-sm mt-2">Try a different search or category.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--primary)" }}>
            Lumina
          </span>
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 Lumina Learning. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

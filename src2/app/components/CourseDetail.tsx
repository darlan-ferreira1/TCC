import type { Course } from "./CourseCard";

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export function CourseDetail({ course, onBack }: CourseDetailProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-primary">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:px-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
                {course.category}
              </span>
              <span className="text-primary-foreground/70 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                {course.level}
              </span>
            </div>
            <h1 className="text-primary-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2 }}>
              {course.title}
            </h1>
            <p className="text-primary-foreground/80 text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              by {course.instructor}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats */}
            <div className="flex flex-wrap gap-6 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-accent text-xl">★</span>
                <span className="font-semibold text-lg" style={{ fontFamily: "'DM Mono', monospace" }}>{course.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>rating</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span className="font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{course.students.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>students</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>{course.duration}</span>
                <span className="text-muted-foreground text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>total</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }} className="mb-4">About this course</h2>
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {course.description}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }} className="mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.skills.map((skill) => (
                  <div key={skill} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }} className="mb-4">Curriculum</h2>
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0" style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{lesson.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4" style={{ fontFamily: "'DM Mono', monospace" }}>{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ${course.price}
                </span>
              </div>

              <button className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg transition-opacity hover:opacity-90 mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Enroll Now
              </button>
              <button className="w-full border border-border text-foreground py-3.5 rounded-lg hover:bg-secondary transition-colors" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Try Free Preview
              </button>

              <div className="mt-6 space-y-3 pt-6 border-t border-border">
                {[
                  { label: "Duration", value: course.duration },
                  { label: "Level", value: course.level },
                  { label: "Lessons", value: `${course.lessons.length} lessons` },
                  { label: "Students", value: course.students.toLocaleString() },
                  { label: "Certificate", value: "Yes, included" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</span>
                    <span className="text-foreground font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

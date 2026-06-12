interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  duration: string;
  students: number;
  rating: number;
  price: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  imageUrl: string;
  description: string;
  lessons: { title: string; duration: string }[];
  skills: string[];
}

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <button
      onClick={() => onClick(course)}
      className="group bg-card text-card-foreground rounded-lg border border-border overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full"
    >
      <div className="relative overflow-hidden aspect-[16/9] bg-muted">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>
            {course.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="leading-snug mb-1 group-hover:text-primary transition-colors duration-200" style={{ fontFamily: "'Playfair Display', serif" }}>
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          by {course.instructor}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {course.students.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <span className="text-accent" style={{ fontSize: "14px" }}>★</span>
            <span className="text-sm font-medium" style={{ fontFamily: "'DM Mono', monospace" }}>{course.rating.toFixed(1)}</span>
          </div>
          <span className="text-lg font-semibold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
            ${course.price}
          </span>
        </div>
      </div>
    </button>
  );
}

export type { Course };

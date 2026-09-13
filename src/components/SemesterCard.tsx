import { Course, Grade } from "@/types/course";

type SemesterCardProps = {
  title: string;
  courses: Course[];
  grades: Record<string, Grade | undefined>;
  onGradeChange: (
    code: string,
    grade: Grade | undefined
  ) => void;
};

const gradeOptions: Grade[] = [
  "A",
  "B+",
  "B",
  "C+",
  "C",
  "D+",
  "D",
  "F",
];

export default function SemesterCard({
  title,
  courses,
  grades,
  onGradeChange,
}: SemesterCardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {/* Semester Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Select your grade for each course
        </p>
      </div>

      {/* Course List */}
      <div className="divide-y divide-slate-100">
        {courses.map((course) => (
          <div
            key={course.code}
            className="flex items-center justify-between gap-4 py-5"
          >
            {/* Course Information */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-900">
                  {course.code}
                </span>

                <span className="text-sm text-slate-400">
                  {course.credits} credits
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-600">
                {course.name}
              </p>
            </div>

            {/* Grade Select */}
            <select
              value={grades[course.code] ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onGradeChange(
                  course.code,
                  value === ""
                    ? undefined
                    : (value as Grade)
                );
              }}
              className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                Select Grade
              </option>

              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
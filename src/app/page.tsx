"use client";

import UserMenu from "@/components/UserMenu";
import { useEffect, useState } from "react";
import SemesterCard from "@/components/SemesterCard";
import GPAChart from "@/components/GPAChart";
import { Course, Grade } from "@/types/course";
import {
  calculateSemesterGPA,
  calculateCumulativeGPAUntil,
} from "@/lib/gpa";
import { getCourses } from "@/lib/courses";
import {
  getGrades,
  saveGrade,
  resetGrades,
} from "@/lib/grades";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  const [grades, setGrades] = useState<
    Record<string, Grade | undefined>
  >({});

  // โหลดข้อมูล Courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error(
          "Failed to load courses - full error:",
          error
        );
      }
    }

    loadCourses();
  }, []);

  // โหลด Grades ของ User ที่ Login อยู่
  useEffect(() => {
    async function loadGrades() {
      try {
        const savedGrades = await getGrades();
        setGrades(savedGrades);
      } catch (error) {
        console.error(
          "Failed to load grades - full error:",
          error
        );
      }
    }

    loadGrades();
  }, []);

  // เมื่อผู้ใช้เปลี่ยนเกรด
  async function handleGradeChange(
    code: string,
    grade: Grade | undefined
  ) {
    setGrades((currentGrades) => ({
      ...currentGrades,
      [code]: grade,
    }));

    if (grade !== undefined) {
      try {
        await saveGrade(code, grade);
        console.log(`Grade saved: ${code} = ${grade}`);
      } catch (error) {
        console.error("Failed to save grade:", error);
      }
    }
  }

  // Reset เกรดทั้งหมด
  async function handleResetGrades() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all grades?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await resetGrades();
      setGrades({});
      console.log("All grades have been reset");
    } catch (error) {
      console.error("Failed to reset grades:", error);
    }
  }

  // แยกรายวิชาตาม Semester
  const semester1 = courses.filter(
    (course) =>
      course.academicYear === 2025 &&
      course.semester === "1"
  );

  const semester2 = courses.filter(
    (course) =>
      course.academicYear === 2025 &&
      course.semester === "2"
  );

  const summer = courses.filter(
    (course) =>
      course.academicYear === 2025 &&
      course.semester === "Summer"
  );

  const semester2026 = courses.filter(
    (course) =>
      course.academicYear === 2026 &&
      course.semester === "1"
  );

  // รวมข้อมูลแต่ละ Semester
  const terms = [
    {
      year: 2025,
      semester: "1" as const,
      title: "2025 1st Semester",
      courses: semester1,
    },
    {
      year: 2025,
      semester: "2" as const,
      title: "2025 2nd Semester",
      courses: semester2,
    },
    {
      year: 2025,
      semester: "Summer" as const,
      title: "2025 Summer",
      courses: summer,
    },
    {
      year: 2026,
      semester: "1" as const,
      title: "2026 1st Semester",
      courses: semester2026,
    },
  ];

  // คำนวณ CUM-GPA ล่าสุด
  const cumulativeGPA = calculateCumulativeGPAUntil(
    courses,
    grades,
    2026,
    "1"
  );

  // สร้างข้อมูลสำหรับ GPA Chart
  const gpaChartData = terms.map((term) => {
    const semesterGPA = calculateSemesterGPA(
      term.courses,
      grades
    );

    const termCumulativeGPA =
      calculateCumulativeGPAUntil(
        courses,
        grades,
        term.year,
        term.semester
      );

    const gradedCredits = term.courses
      .filter(
        (course) =>
          course.countsForGPA &&
          grades[course.code] !== undefined
      )
      .reduce(
        (total, course) => total + course.credits,
        0
      );

    return {
      term: term.title,
      semesterGPA:
        gradedCredits === 0
          ? null
          : Number(semesterGPA.toFixed(2)),
      cumulativeGPA:
        gradedCredits === 0
          ? null
          : Number(termCumulativeGPA.toFixed(2)),
    };
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              ICT GPA Tracker
            </h1>

            <p className="mt-2 text-slate-500">
              Track your academic performance and GPA progress.
            </p>
          </div>

          <UserMenu />
        </header>

        {/* CUM-GPA */}
        <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            CUM-GPA
          </p>

          <p className="mt-2 text-6xl font-bold tracking-tight text-slate-900">
            {cumulativeGPA === 0
              ? "—"
              : cumulativeGPA.toFixed(2)}
          </p>

          <button
            type="button"
            onClick={handleResetGrades}
            className="mt-6 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Reset Grades
          </button>
        </section>

        {/* GPA History */}
        <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            GPA History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3">
                    Academic Term
                  </th>
                  <th className="px-4 py-3">
                    GPA Credits
                  </th>
                  <th className="px-4 py-3">
                    SEM-GPA
                  </th>
                  <th className="px-4 py-3">
                    CUM-GPA
                  </th>
                </tr>
              </thead>

              <tbody>
                {terms.map((term) => {
                  const semesterGPA =
                    calculateSemesterGPA(
                      term.courses,
                      grades
                    );

                  const termCumulativeGPA =
                    calculateCumulativeGPAUntil(
                      courses,
                      grades,
                      term.year,
                      term.semester
                    );

                  const gradedCredits =
                    term.courses
                      .filter(
                        (course) =>
                          course.countsForGPA &&
                          grades[course.code] !== undefined
                      )
                      .reduce(
                        (total, course) =>
                          total + course.credits,
                        0
                      );

                  return (
                    <tr
                      key={term.title}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-4 font-medium">
                        {term.title}
                      </td>

                      <td className="px-4 py-4">
                        {gradedCredits === 0
                          ? "—"
                          : gradedCredits}
                      </td>

                      <td className="px-4 py-4">
                        {gradedCredits === 0
                          ? "—"
                          : semesterGPA.toFixed(2)}
                      </td>

                      {/* ถ้า Semester นี้ยังไม่มีเกรด
                          จะยังไม่แสดง CUM-GPA */}
                      <td className="px-4 py-4">
                        {gradedCredits === 0
                          ? "—"
                          : termCumulativeGPA.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* GPA Chart */}
        <div className="mb-8">
          <GPAChart data={gpaChartData} />
        </div>

        {/* Courses */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Courses
          </h2>

          <div className="space-y-6">
            <SemesterCard
              title="2025 1st Semester"
              courses={semester1}
              grades={grades}
              onGradeChange={handleGradeChange}
            />

            <SemesterCard
              title="2025 2nd Semester"
              courses={semester2}
              grades={grades}
              onGradeChange={handleGradeChange}
            />

            <SemesterCard
              title="2025 Summer"
              courses={summer}
              grades={grades}
              onGradeChange={handleGradeChange}
            />

            <SemesterCard
              title="2026 1st Semester"
              courses={semester2026}
              grades={grades}
              onGradeChange={handleGradeChange}
            />
          </div>
        </section>

      </div>
    </main>
  );
}
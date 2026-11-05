"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ข้อมูลสำหรับเพิ่ม Course
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("1");
  const [countsForGPA, setCountsForGPA] = useState(true);

  // Course ที่กำลังแก้ไข
  const [editingCourse, setEditingCourse] =
    useState<Course | null>(null);

  const router = useRouter();

  // ตรวจสอบว่า User เป็น Admin หรือไม่
  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        alert("You do not have permission to access this page.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
      await loadCourses();
    }

    checkAdmin();
  }, [router]);

  // โหลด Courses
  async function loadCourses() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("academic_year", { ascending: true })
      .order("semester", { ascending: true })
      .order("code", { ascending: true });

    if (error) {
      console.error("Failed to load courses:", error);
      setLoading(false);
      return;
    }

    const formattedCourses: Course[] = data.map((course) => ({
      code: course.code,
      name: course.name,
      credits: Number(course.credits),
      academicYear: course.academic_year,
      semester: course.semester,
      countsForGPA: course.counts_for_gpa,
    }));

    setCourses(formattedCourses);
    setLoading(false);
  }

  // เพิ่ม Course ใหม่
  async function handleAddCourse(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !code.trim() ||
      !name.trim() ||
      !credits ||
      !academicYear
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("courses")
      .insert({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        credits: Number(credits),
        academic_year: Number(academicYear),
        semester,
        counts_for_gpa: countsForGPA,
      });

    if (error) {
      alert(`Failed to add course: ${error.message}`);
      return;
    }

    // ล้าง Form
    setCode("");
    setName("");
    setCredits("");
    setAcademicYear("");
    setSemester("1");
    setCountsForGPA(true);

    await loadCourses();
    alert("Course added successfully!");
  }

  // เริ่มแก้ไข Course
  function handleEdit(course: Course) {
    setEditingCourse(course);
  }

  // บันทึกข้อมูลที่แก้ไข
  async function handleSaveEdit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingCourse) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("courses")
      .update({
        name: editingCourse.name,
        credits: Number(editingCourse.credits),
        academic_year: Number(editingCourse.academicYear),
        semester: editingCourse.semester,
        counts_for_gpa: editingCourse.countsForGPA,
      })
      .eq("code", editingCourse.code);

    if (error) {
      alert(`Failed to update course: ${error.message}`);
      return;
    }

    setEditingCourse(null);
    await loadCourses();

    alert("Course updated successfully!");
  }

  // ลบ Course
  async function handleDelete(courseCode: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${courseCode}?`
    );

    if (!confirmed) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("code", courseCode);

    if (error) {
      alert(`Failed to delete course: ${error.message}`);
      return;
    }

    await loadCourses();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Manage courses for ICT GPA Tracker
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back to GPA Tracker
          </button>
        </header>

        {/* Add Course Form */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Add New Course
          </h2>

          <form
            onSubmit={handleAddCourse}
            className="grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="ITDS120"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Course Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Course name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Credits
              </label>
              <input
                type="number"
                min="0"
                value={credits}
                onChange={(event) => setCredits(event.target.value)}
                placeholder="3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Academic Year
              </label>
              <input
                type="number"
                value={academicYear}
                onChange={(event) =>
                  setAcademicYear(event.target.value)
                }
                placeholder="2026"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Semester
              </label>
              <select
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input
                id="countsForGPA"
                type="checkbox"
                checked={countsForGPA}
                onChange={(event) =>
                  setCountsForGPA(event.target.checked)
                }
              />

              <label
                htmlFor="countsForGPA"
                className="text-sm font-medium text-slate-700"
              >
                Counts for GPA
              </label>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                Add Course
              </button>
            </div>
          </form>
        </section>

        {/* Edit Course Form */}
        {editingCourse && (
          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Edit Course: {editingCourse.code}
            </h2>

            <form
              onSubmit={handleSaveEdit}
              className="grid gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Course Name
                </label>
                <input
                  type="text"
                  value={editingCourse.name}
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Credits
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingCourse.credits}
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,
                      credits: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Academic Year
                </label>
                <input
                  type="number"
                  value={editingCourse.academicYear}
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,
                      academicYear: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Semester
                </label>
                <select
                  value={editingCourse.semester}
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,
                      semester: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="editCountsForGPA"
                  type="checkbox"
                  checked={editingCourse.countsForGPA}
                  onChange={(event) =>
                    setEditingCourse({
                      ...editingCourse,
                      countsForGPA: event.target.checked,
                    })
                  }
                />

                <label
                  htmlFor="editCountsForGPA"
                  className="text-sm font-medium text-slate-700"
                >
                  Counts for GPA
                </label>
              </div>

              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Course List */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Courses
          </h2>

          {courses.length === 0 ? (
            <p className="text-slate-500">
              No courses found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course Name</th>
                    <th className="px-4 py-3">Credits</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Semester</th>
                    <th className="px-4 py-3">GPA</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course.code}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-4 font-medium">
                        {course.code}
                      </td>
                      <td className="px-4 py-4">
                        {course.name}
                      </td>
                      <td className="px-4 py-4">
                        {course.credits}
                      </td>
                      <td className="px-4 py-4">
                        {course.academicYear}
                      </td>
                      <td className="px-4 py-4">
                        {course.semester}
                      </td>
                      <td className="px-4 py-4">
                        {course.countsForGPA ? "Yes" : "No"}
                      </td>

                      <td className="flex gap-2 px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(course)}
                          className="rounded-lg border border-blue-200 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(course.code)
                          }
                          className="rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
import { supabase } from "@/lib/supabase";
import { Course } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  // ดึงข้อมูล Courses จาก Supabase
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("academic_year", { ascending: true })
    .order("semester", { ascending: true })
    .order("code", { ascending: true });

  // ถ้าเกิด Error ให้ส่ง Error กลับไป
  if (error) {
    throw new Error(error.message);
  }

  // แปลงชื่อ Column จาก Supabase ให้ตรงกับ Type Course
  return data.map((course) => ({
    code: course.code,
    name: course.name,
    credits: Number(course.credits),
    academicYear: course.academic_year,
    semester: course.semester,
    countsForGPA: course.counts_for_gpa,
  }));
}
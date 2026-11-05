import { createClient } from "@/lib/supabase/client";
import { Grade } from "@/types/course";

// โหลด Grades ของ User ที่ Login อยู่
export async function getGrades() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not logged in");
  }

  const { data, error } = await supabase
    .from("grades")
    .select("course_code, grade")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const grades: Record<string, Grade | undefined> = {};

  data.forEach((item) => {
    grades[item.course_code] = item.grade as Grade;
  });

  return grades;
}

// บันทึกหรืออัปเดต Grade
export async function saveGrade(
  courseCode: string,
  grade: Grade
) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not logged in");
  }

  const { error } = await supabase
    .from("grades")
    .upsert(
      {
        user_id: user.id,
        course_code: courseCode,
        grade: grade,
      },
      {
        onConflict: "user_id,course_code",
      }
    );

  if (error) {
    throw new Error(error.message);
  }
}

// ลบ Grades ทั้งหมดของ User ที่ Login อยู่
export async function resetGrades() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not logged in");
  }

  const { error } = await supabase
    .from("grades")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}
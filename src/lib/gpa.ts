import { Course, Grade } from "@/types/course";

const gradePoints: Record<Grade, number> = {
  A: 4,
  "B+": 3.5,
  B: 3,
  "C+": 2.5,
  C: 2,
  "D+": 1.5,
  D: 1,
  F: 0,
};

// คำนวณ GPA ของ Semester เดียว
export function calculateSemesterGPA(
  courses: Course[],
  grades: Record<string, Grade | undefined>
) {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach((course) => {
    const grade = grades[course.code];

    // นับเฉพาะวิชาที่ใช้คำนวณ GPA และมีเกรดแล้ว
    if (
      course.countsForGPA &&
      grade !== undefined
    ) {
      totalPoints += gradePoints[grade] * course.credits;
      totalCredits += course.credits;
    }
  });

  if (totalCredits === 0) {
    return 0;
  }

  return totalPoints / totalCredits;
}

// คำนวณ CUM-GPA ตั้งแต่ Semester แรก
// จนถึงปีและ Semester ที่กำหนด
export function calculateCumulativeGPAUntil(
  courses: Course[],
  grades: Record<string, Grade | undefined>,
  targetYear: number,
  targetSemester: string
) {
  // กำหนดลำดับของแต่ละ Semester
  const semesterOrder: Record<string, number> = {
    "1": 1,
    "2": 2,
    Summer: 3,
  };

  const targetSemesterOrder =
    semesterOrder[targetSemester];

  // เลือกเฉพาะวิชาที่อยู่ก่อนหรือเท่ากับ Term ปัจจุบัน
  const coursesUntilTerm = courses.filter((course) => {
    // ปีที่น้อยกว่า Target ให้นับทั้งหมด
    if (course.academicYear < targetYear) {
      return true;
    }

    // ปีที่มากกว่า Target ยังไม่นับ
    if (course.academicYear > targetYear) {
      return false;
    }

    // ถ้าเป็นปีเดียวกัน ให้ดูตามลำดับ Semester
    return (
      semesterOrder[course.semester] <=
      targetSemesterOrder
    );
  });

  // คำนวณ GPA จากทุกวิชาตั้งแต่ต้นจนถึง Term นี้
  return calculateSemesterGPA(
    coursesUntilTerm,
    grades
  );
}
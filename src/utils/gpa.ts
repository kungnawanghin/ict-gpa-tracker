import {
  Course,
  Grade,
  Semester,
} from "@/types/course";

export const gradePoints: Record<Grade, number> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
};

export function calculateSemesterGPA(
  courses: Course[],
  grades: Record<string, Grade | undefined>
): number {
  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    if (!course.countsForGPA) {
      continue;
    }

    const grade = grades[course.code];

    if (grade === undefined) {
      continue;
    }

    totalQualityPoints +=
      course.credits * gradePoints[grade];

    totalCredits += course.credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return totalQualityPoints / totalCredits;
}

export function calculateCumulativeGPA(
  courses: Course[],
  grades: Record<string, Grade | undefined>
): number {
  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    if (!course.countsForGPA) {
      continue;
    }

    const grade = grades[course.code];

    if (grade === undefined) {
      continue;
    }

    totalQualityPoints +=
      course.credits * gradePoints[grade];

    totalCredits += course.credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return totalQualityPoints / totalCredits;
}

export function calculateCumulativeGPAUntil(
  allCourses: Course[],
  grades: Record<string, Grade | undefined>,
  academicYear: number,
  semester: Semester
): number {
  const semesterOrder: Record<Semester, number> = {
    "1": 1,
    "2": 2,
    Summer: 3,
  };

  const targetOrder = semesterOrder[semester];

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const course of allCourses) {
    if (!course.countsForGPA) {
      continue;
    }

    const courseOrder = semesterOrder[course.semester];

    const isBeforeOrEqual =
      course.academicYear < academicYear ||
      (course.academicYear === academicYear &&
        courseOrder <= targetOrder);

    if (!isBeforeOrEqual) {
      continue;
    }

    const grade = grades[course.code];

    if (grade === undefined) {
      continue;
    }

    totalQualityPoints +=
      course.credits * gradePoints[grade];

    totalCredits += course.credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return totalQualityPoints / totalCredits;
}
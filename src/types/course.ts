export type Semester = "1" | "2" | "Summer";

export type Course = {
  code: string;
  name: string;
  credits: number;
  academicYear: number;
  semester: Semester;
  countsForGPA: boolean;
};

export type Grade =
  | "A"
  | "B+"
  | "B"
  | "C+"
  | "C"
  | "D+"
  | "D"
  | "F";
import { Grade } from "./course";

export type StudentGrade = {
  courseCode: string;
  grade?: Grade;
};
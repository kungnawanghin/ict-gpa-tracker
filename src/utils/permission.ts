import { UserRole } from "@/types/user";

export function canManageCourses(
  role: UserRole
): boolean {
  return role === "admin";
}

export function canEnterGrades(
  role: UserRole
): boolean {
  return role === "student";
}
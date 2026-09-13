export function getPerformance(gpa: number): string {
  if (gpa >= 3.50) {
    return "Excellent";
  }

  if (gpa >= 3.00) {
    return "Good";
  }

  if (gpa >= 2.50) {
    return "Average";
  }

  if (gpa >= 2.00) {
    return "Needs Improvement";
  }

  return "At Risk";
}
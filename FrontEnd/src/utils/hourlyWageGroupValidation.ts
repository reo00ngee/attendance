export function validateHourlyWageGroupRegistration({
  name,
  hourlyWage,
  comment,
}: {
  name: string;
  hourlyWage: number;
  comment?: string;
}): string | null {
  if (
    !name ||
    !hourlyWage
  ) {
    return "Name and hourly wage are required.";
  }
  if (name.length > 255) {
    return "Name must be 255 characters or less.";
  }
  if (hourlyWage < 0) {
    return "Hourly wage must be a positive number.";
  }
  if (comment && comment.length > 2000) {
    return "Comment must be 2000 characters or less.";
  }
  return null;
}



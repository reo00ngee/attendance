import { ROLES } from "../constants/roles";
import { genders } from "../constants/genders";

export function validateUserRegistration({
  firstName,
  lastName,
  email,
  password,
  confirm,
  wageGroup,
  selectedRoles,
  gender,
  phone,
  address,
  hireDate,
  retireDate,
  userId,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  wageGroup: number | "";
  selectedRoles: number[];
  gender: string;
  phone: string;
  address: string;
  hireDate: string;
  retireDate: string;
  userId?: string | null;
}): string | null {
  // 基本フィールドの必須チェック（パスワードは新規作成時のみ必須）
  if (
    !firstName ||
    !lastName ||
    !email ||
    (!userId && (!password || !confirm)) ||
    !wageGroup ||
    selectedRoles.length === 0
  ) {
    const missingFields = [];
    if (!firstName) missingFields.push("first name");
    if (!lastName) missingFields.push("last name");
    if (!email) missingFields.push("email");
    if (!userId && !password) missingFields.push("password");
    if (!userId && !confirm) missingFields.push("password confirmation");
    if (!wageGroup) missingFields.push("hourly wage group");
    if (selectedRoles.length === 0) missingFields.push("at least one role");
    
    return `The following fields are required: ${missingFields.join(", ")}.`;
  }
  if (firstName.length > 255) {
    return "First name must be 255 characters or less.";
  }
  if (lastName.length > 255) {
    return "Last name must be 255 characters or less.";
  }
  // パスワードバリデーション（パスワードが入力されている場合のみ）
  if (password && password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if ((password || confirm) && password !== confirm) {
    return "Passwords do not match.";
  }
  if (!/^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Invalid email format.";
  }
  const genderValues = genders.map((g) => g.value);
  if (gender && !genderValues.includes(Number(gender))) {
    return "Invalid gender selected.";
  }
  const roleValues = ROLES.map((r) => r.value);
  if (!selectedRoles.every((r) => roleValues.includes(r))) {
    return "Invalid role selected.";
  }
  if (isNaN(Number(wageGroup))) {
    return "Invalid hourly wage group.";
  }
  if (phone && phone.length > 20) {
    return "Phone number must be 20 characters or less.";
  }
  if (address && address.length > 255) {
    return "Address must be 255 characters or less.";
  }
  if (hireDate && isNaN(Date.parse(hireDate))) {
    return "Hire date is invalid.";
  }
  if (retireDate) {
    if (isNaN(Date.parse(retireDate))) {
      return "Retire date is invalid.";
    }
    if (hireDate && new Date(retireDate) < new Date(hireDate)) {
      return "Retire date must be after or equal to hire date.";
    }
  }
  return null;
}



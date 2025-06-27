import { roles } from "../constants/roles";
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
}): string | null {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirm ||
    !wageGroup ||
    selectedRoles.length === 0
  ) {
    return "First name, last name, email, password, hourly wage group, and at least one role are required.";
  }
  if (firstName.length > 255) {
    return "First name must be 255 characters or less.";
  }
  if (lastName.length > 255) {
    return "Last name must be 255 characters or less.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  if (!/^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Invalid email format.";
  }
  const genderValues = genders.map((g) => g.value);
  if (gender && !genderValues.includes(Number(gender))) {
    return "Invalid gender selected.";
  }
  const roleValues = roles.map((r) => r.value);
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



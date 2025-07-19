import { hasRole, getUserRoles } from "../utils/auth";

export const makePageLinks = () => {
  const userRoles = getUserRoles();
  const links = [
    { label: "Attendance Registration for Daily", path: "/attendance_registration" },
    { label: "Attendance Registration for Monthly", path: "/attendance_registration_for_monthly" },
    { label: "Attendance Management", path: "/attendance_management" },
  ];

  if (userRoles.includes(3)) {
    links.push(
      { label: "User Management", path: "/user_management" },
      { label: "User Registration", path: "/user_registration" }
    );
  }

  return links;
}


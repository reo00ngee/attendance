import { hasRole, getUserRoles } from "../utils/auth";

export const makePageLinks = () => {
  const userRoles = getUserRoles();
  const links = [
    { label: "Attendance Registration for Daily", path: "/attendance_registration_for_daily" },
    { label: "Attendance Registration for Monthly", path: "/attendance_registration_for_monthly" },
    { label: "Expense Registration", path: "/expense_registration" },
  ];

  if (userRoles.includes(2)) {
    links.push(
      { label: "Attendance Management", path: "/attendance_management" },
      { label: "Attendance Approval", path: "/attendance_approval" }
    );
  }
  if (userRoles.includes(3)) {
    links.push(
      { label: "User Management", path: "/user_management" },
      { label: "User Registration", path: "/user_registration" },
      { label: "Hourly Wage Group Management", path: "/hourly_wage_group_management" },
      { label: "Hourly Wage Group Registration", path: "/hourly_wage_group_registration" }
    );
  }

  return links;
}


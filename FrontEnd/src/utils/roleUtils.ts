import { ROLES } from '../constants/roles';

export const getRoleLabel = (value: number): string => {
  const item = ROLES.find(role => role.value === value);
  return item?.label || "Unknown Role";
};

export const isRole = (value: number): boolean => {
  return ROLES.some(role => role.value === value);
};

export const isAttendanceAndExpenseRegistration = (value: number): boolean => {
  return value === 0; // Attendance and Expense Registration
};

export const isAttendanceManagement = (value: number): boolean => {
  return value === 1; // Attendance Management
}

export const isFinanceManagement = (value: number): boolean => {
  return value === 2; // Finance Management
}

export const isUserManagement = (value: number): boolean => {
  return value === 3; // User Management
}

export const isSettingManagement = (value: number): boolean => {
  return value === 4; // Setting Management
} 
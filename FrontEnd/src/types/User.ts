import { Attendance } from "../types/Attendance";
import { ExpenseAndDeduction } from "./ExpenseAndDeduction";

export interface User {
  user_id: number;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  gender?: number | null;
  birth_date?: string | null;
  address?: string | null;
  hire_date?: string | null;
  retire_date?: string | null;
  hourly_wage_group_id: number | null;
  roles: number[];
  attendances: Attendance[];
  expenses_and_deductions: ExpenseAndDeduction[];
}
export interface ExpenseAndDeduction {
  id: number;
  expense_id: number;
  user_id: number;
  expense_or_deduction: number;
  name: string;
  amount: number;
  date: string;
  submission_status: number;
  comment: string;
}
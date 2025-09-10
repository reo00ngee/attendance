import { ExpenseAndDeduction } from '@/types/ExpenseAndDeduction';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 個別の経費データのバリデーション
 */
export const validateExpense = (expense: Partial<ExpenseAndDeduction>): string[] => {
  const errors: string[] = [];
  
  if (!expense.name || expense.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!expense.amount || expense.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!expense.date) {
    errors.push('Date is required');
  }
  
  return errors;
};

/**
 * 複数の経費データのバリデーション
 */
export const validateExpenses = (expenses: Partial<ExpenseAndDeduction>[]): ValidationResult => {
  const allErrors: string[] = [];
  
  expenses.forEach((expense, index) => {
    const errors = validateExpense(expense);
    if (errors.length > 0) {
      allErrors.push(`Row ${index + 1}: ${errors.join(', ')}`);
    }
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * リアルタイムバリデーション用のエラーメッセージ取得
 */
export const getFieldError = (errors: string[], fieldName: string): string => {
  return errors.find(error => error.includes(fieldName)) || '';
};

/**
 * フィールドにエラーがあるかチェック
 */
export const hasFieldError = (errors: string[], fieldName: string): boolean => {
  return errors.some(error => error.includes(fieldName));
};

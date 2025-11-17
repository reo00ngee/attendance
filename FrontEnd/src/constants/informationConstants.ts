// Submission Type（提出の種類）
export const SUBMISSION_TYPES = [
  { value: 0, label: "Attendance" },
  { value: 1, label: "Expense" },
] as const;

// Submission Status（提出状況）
export const INFORMATION_TYPES = [
  { value: 1, label: "Submitted", message: "The submission has been submitted by " },
  { value: 2, label: "Rejected", message: "Your submission has been rejected." },
  { value: 3, label: "Approved", message: "Your submission has been approved." },
] as const;


// 型定義
export type SubmissionType = typeof SUBMISSION_TYPES[number]['value'];
export type InformationType = typeof INFORMATION_TYPES[number]['value'];

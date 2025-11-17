export const PROMPT_SUBMISSION_REMINDER_DAYS = [
  { value: 3, label: "THREE_DAYS" },
  { value: 5, label: "FIVE_DAYS" },
  { value: 7, label: "SEVEN_DAYS" },
];

export type PromptSubmissionReminderDays = typeof PROMPT_SUBMISSION_REMINDER_DAYS[number]['value'];
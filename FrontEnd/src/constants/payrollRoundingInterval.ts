export const PAYROLL_ROUNDING_INTERVAL = [
  { value: 1, label: "ONE_MINUTE" },
  { value: 5, label: "FIVE_MINUTES" },
  { value: 15, label: "FIFTEEN_MINUTES" },
];

export type PayrollRoundingInterval = typeof PAYROLL_ROUNDING_INTERVAL[number]['value'];
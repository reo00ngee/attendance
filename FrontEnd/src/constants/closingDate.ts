export const CLOSING_DATE = [
  { value: 15, label: "FIFTEENTH" },
  { value: 20, label: "TWENTIETH" },
  { value: 25, label: "TWENTY-FIFTH" },
  { value: 30, label: "END_OF_MONTH" },
];

export type ClosingDate = typeof CLOSING_DATE[number]['value'];
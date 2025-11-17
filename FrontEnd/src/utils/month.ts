export const handlePrevMonth = (
  year: number,
  month: number,
  setYear: (y: number) => void,
  setMonth: (m: number) => void
) => {
  if (month === 1) {
    setMonth(12);
    setYear(year - 1);
  } else {
    setMonth(month - 1);
  }
};

export const handleNextMonth = (
  year: number,
  month: number,
  setYear: (y: number) => void,
  setMonth: (m: number) => void
) => {
  if (month === 12) {
    setMonth(1);
    setYear(year + 1);
  } else {
    setMonth(month + 1);
  }
};
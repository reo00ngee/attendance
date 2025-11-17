import React from 'react';
import { Box, Button } from '@mui/material';
import { format } from 'date-fns';
import { handlePrevMonth, handleNextMonth } from '../utils/month';


interface MonthNavigatorProps {
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  onMonthChange?: (year: number, month: number) => void; // カスタムロジック用
  disabled?: boolean;
  sx?: object;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  year,
  month,
  setYear,
  setMonth,
  onMonthChange,
  disabled = false,
  sx = { display: "flex", justifyContent: "center", mb: 2 }
}) => {
  
  const handlePrev = () => {
    // カスタムロジックがある場合は実行
    if (onMonthChange) {
      const newMonth = month === 1 ? 12 : month - 1;
      const newYear = month === 1 ? year - 1 : year;
      onMonthChange(newYear, newMonth);
    } else {
      // デフォルトの月移動ロジックを使用
      handlePrevMonth(year, month, setYear, setMonth);
    }
  };

  const handleNext = () => {
    // カスタムロジックがある場合は実行
    if (onMonthChange) {
      const newMonth = month === 12 ? 1 : month + 1;
      const newYear = month === 12 ? year + 1 : year;
      onMonthChange(newYear, newMonth);
    } else {
      // デフォルトの月移動ロジックを使用
      handleNextMonth(year, month, setYear, setMonth);
    }
  };

  return (
    <Box sx={sx}>
      <Button 
        onClick={handlePrev}
        variant="contained" 
        disabled={disabled}
        sx={{ minWidth: 40, mx: 1 }}
      >
        &lt;
      </Button>
      <span style={{ 
        fontSize: "1.2rem", 
        fontWeight: "bold", 
        margin: "1rem 1rem",
        opacity: disabled ? 0.6 : 1 
      }}>
        {format(new Date(year, month - 1), "MMMM yyyy")}
      </span>
      <Button 
        onClick={handleNext}
        variant="contained" 
        disabled={disabled}
        sx={{ minWidth: 40, mx: 1 }}
      >
        &gt;
      </Button>
    </Box>
  );
};

export default MonthNavigator;
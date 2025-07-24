import * as React from "react";
import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import Section from "../components/Section";
import { format, set } from "date-fns";
import { ExpenseOrDeduction } from "../types/Expense";
import { formatTimeHHMM, convertToHoursAndMinutes, formatDate } from "../utils/format";
import { calculateTotalAmount } from "../utils/calculate";
import { handlePrevMonth, handleNextMonth } from "../utils/month";

const ExpenseRegistration = () => {
  const pageTitle = "Expense Registration";
  const tableHeaders = [
    "Expense Name",
    "Amount",
    "Date",
    "Comment",
    ""
  ];
  const [expenses, setExpenses] = useState<ExpenseOrDeduction[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [unsubmittedExists, setUnsubmittedExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_all_expenses_for_user?year=${year}&month=${month}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data: ExpenseOrDeduction[] = await res.json();
          setExpenses(data);
          setTotalAmount(calculateTotalAmount(data));
        } else {
          setExpenses([]); // 安全にリセット
          setTotalAmount(0);
          setError("Failed to retrieve the expense list.");
        }
      } catch {
        setExpenses([]); // 安全にリセット
        setTotalAmount(0);
        setError("Something went wrong while fetching the data. Please try again later.");
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [year, month]); // year, monthのみ依存

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      {/* エラーがある場合は常に表示 */}
      {error && (
        <Section>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      {loading && (
        <Section>
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        </Section>
      )}

      {/* 未提出アラート */}
      {unsubmittedExists && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are expenses that have not been submitted.
          </Alert>
        </Section>
      )}

      {/* サマリー・操作ボタン */}
      <Section>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
          <Typography variant="body1">
            Total Expense Amount: {totalAmount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            component="a"
            href="/attendance_registration_for_daily"
            sx={{ minWidth: 180 }}
          >
            REGISTER
          </Button>
          <Button
            variant="contained"
            // onClick={handleSubmit}
            sx={{ minWidth: 180 }}
          >
            SUBMIT
          </Button>
        </Box>
      </Section>

      {/* テーブル */}
      <Section>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button onClick={() => handlePrevMonth(year, month, setYear, setMonth)} variant="contained" sx={{ minWidth: 40, mx: 1 }}>&lt;</Button>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "1rem 1rem" }}>
            {format(new Date(year, month - 1), "MMMM yyyy")}
          </span>
          <Button onClick={() => handleNextMonth(year, month, setYear, setMonth)} variant="contained" sx={{ minWidth: 40, mx: 1 }}>&gt;</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell key={index} align="right">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense, i) => (
                <TableRow key={i}>
                  <TableCell align="right">{expense.name}</TableCell>
                  <TableCell align="right">{expense.amount}</TableCell>
                  <TableCell align="right">{formatDate(expense.date)}</TableCell>
                  <TableCell align="right">{expense.comment} </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        minWidth: 120,
                        height: 40,
                        fontSize: "1rem",
                        px: 2,
                      }}
                      component="a"
                      // href={`/attendance_registration_for_daily?attendance_id=${attendance.attendance_id}`}
                    >
                      Modify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Box>
  );
};

export default ExpenseRegistration;

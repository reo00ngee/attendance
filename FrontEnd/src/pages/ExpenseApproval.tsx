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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from '../components/NavigationButton';
import { useSearchParams, Navigate } from "react-router-dom";
import { Attendance } from "../types/Attendance";
import { formatTimeHHMM, convertToHoursAndMinutes, formatDate, truncateLongLetter } from "../utils/format";
import { calculateTotalAmount } from "../utils/calculate";
import { hasRole } from '../utils/auth';
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import MonthNavigator from "../components/MonthNavigator";
import { ExpenseAndDeduction } from "../types/ExpenseAndDeduction";


const ExpenseApproval = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");

  const [year, setYear] = useState(() => {
    return queryYear ? parseInt(queryYear, 10) : new Date().getFullYear();
  });

  const [month, setMonth] = useState(() => {
    return queryMonth ? parseInt(queryMonth, 10) : new Date().getMonth() + 1;
  });
  const pageTitle = "Expense Approval";
  const tableHeaders = [
    "Expense Name	",
    "Amount",
    "Date",
    "Comment",
  ];
  const [expenses, setExpenses] = useState<ExpenseAndDeduction[]>([]);

  const [expensesAmount, setExpensesAmount] = useState<number>(0);
  const [numberOfExpenses, setNumberOfExpenses] = useState<number>(0);
  const [noExpenses, setNoExpenses] = useState(false);
  const [allApproved, setAllApproved] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { notification, showNotification, clearNotification } = useNotification();

  const handleApprove = async () => {
    setLoading(true);
    clearNotification();

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/approve_expenses?user_id=${userId}&year=${year}&month=${month}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        showNotification("Expenses and Deductions approved successfully", 'success');
        const data: ExpenseAndDeduction[] = await res.json();
        setExpenses(data);
        setNoExpenses(data.length === 0);
        setAllApproved(data.length > 0 && data.every(expense => expense.submission_status === 3));
        setExpensesAmount(calculateTotalAmount(data));
        setNumberOfExpenses(data.length);

      } else {
        const errorData = await res.json();
        showNotification(errorData.message || "Failed to approve expenses", 'error');
      }
    } catch (err) {
      showNotification("Something went wrong while approving the expenses.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectMessage.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setLoading(true);
    clearNotification();
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/reject_expenses?user_id=${userId}&year=${year}&month=${month}&rejection_reason=${encodeURIComponent(rejectMessage)}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

      if (res.ok) {
        showNotification("Expenses rejected successfully", 'success');
        setRejectDialogOpen(false);
        setRejectMessage("");
        const data: ExpenseAndDeduction[] = await res.json();
        setExpenses(data);
        setNoExpenses(data.length === 0);

        setExpensesAmount(calculateTotalAmount(data));
        setNumberOfExpenses(data.length);
        setAllApproved(data.length > 0 && data.every(expense => expense.submission_status === 3));
      } else {
        const errorData = await res.json();
        showNotification(errorData.message || "Failed to reject expenses", 'error');
      }
    } catch (err) {
      showNotification("Something went wrong while rejecting the expenses.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setRejectMessage("");
  };

  useEffect(() => {
    setLoading(true);
    clearNotification();
    const fetchExpenses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_submitted_and_approved_expenses?user_id=${userId}&year=${year}&month=${month}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        if (res.ok) {
          const data: ExpenseAndDeduction[] = await res.json();
          setExpenses(data);
          setNoExpenses(data.length === 0);
          setAllApproved(data.length > 0 && data.every(expense => expense.submission_status === 3));

          setExpensesAmount(calculateTotalAmount(data));
          setNumberOfExpenses(data.length);
          setAllApproved(data.length > 0 && data.every(expense => expense.submission_status === 3));


        }
      } catch (err) {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [year, month]);

  if (!hasRole(2)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  if (!userId) {
    return <Navigate to="/attendance_management" replace />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 統一されたアラート表示 */}
      <NotificationAlert notification={notification} />

      {/* 状態に応じた追加メッセージ */}
      {allApproved && (
        <Section>
          <Alert severity="success" sx={{ mb: 2 }}>
            All attendances have been approved.
          </Alert>
        </Section>
      )}

      {noExpenses && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no expenses submitted.
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />

      {/* サマリー・操作ボタン */}
      <Section>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
          <Typography variant="body1">
            Total Expense Amount: {expensesAmount}
          </Typography>
          <Typography variant="body1">
            Number of Expenses: {numberOfExpenses}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/expense_and_deduction_management"
            sx={{ minWidth: 180 }}
          >
            EXPENSE AND DEDUCTION MANAGEMENT
          </NavigationButton>
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={loading || noExpenses || allApproved}
            sx={{ minWidth: 180 }}
          >
            APPROVE
          </Button>
          <Button
            variant="contained"
            onClick={handleReject}
            disabled={loading || noExpenses || allApproved}
            sx={{
              minWidth: 180,
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            REJECT
          </Button>
        </Box>
      </Section>

      {/* テーブル */}
      <Section>
        <MonthNavigator
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
          disabled={loading}
        />
        <TableContainer component={Paper} sx={{ opacity: loading ? 0.6 : 1 }}>
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
                  <TableCell align="right">
                    <Tooltip title={expense.comment || "No comment"} arrow>
                      <span style={{ cursor: "pointer" }}>{expense.comment ? truncateLongLetter(expense.comment, 30) : "No comment"}</span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Expense</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this expense:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Rejection Reason"
            variant="outlined"
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseApproval;

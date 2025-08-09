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
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip // 追加
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import { format } from "date-fns";
import { ExpenseOrDeduction } from "../types/Expense";
import { formatDate } from "../utils/format";
import { calculateTotalAmount } from "../utils/calculate";
import { handlePrevMonth, handleNextMonth } from "../utils/month";
import { truncateLongLetter } from "../utils/format";
import MonthNavigator from "../components/MonthNavigator";

const ExpenseRegistration = () => {
  const pageTitle = "Expense Registration";
  const tableHeaders = [
    "Expense Name",
    "Amount",
    "Date",
    "Comment",
    // "Actions" // 削除ボタン用のカラム追加
  ];

  const [expenses, setExpenses] = useState<ExpenseOrDeduction[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [noExpense, setNoExpense] = useState(false);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [unsubmittedExists, setUnsubmittedExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, clearNotification } = useNotification();

  // Edit Mode関連
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExpenses, setEditedExpenses] = useState<ExpenseOrDeduction[]>([]);
  const [newExpenses, setNewExpenses] = useState<Partial<ExpenseOrDeduction>[]>([]);
  const [deletedExpenseIds, setDeletedExpenseIds] = useState<number[]>([]); // 削除対象のID配列

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      clearNotification();
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_all_expenses_for_user?year=${year}&month=${month}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          }
        );
        if (res.ok) {
          const data: ExpenseOrDeduction[] = await res.json();
          setExpenses(data);
          setNoExpense(data.length === 0);
          setTotalAmount(calculateTotalAmount(data));
          setUnsubmittedExists(data.some(expense => expense.submission_status === 0));
        } else {
          showNotification("Failed to fetch expense data", 'error');
        }
      } catch {
        setExpenses([]);
        setTotalAmount(0);
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [year, month]);

  const handleMonthChangeWithValidation = (newYear: number, newMonth: number) => {
    // Edit Modeで何らかの変更がある場合のみ確認
    if (isEditMode) {
      const confirmed = window.confirm('Unsaved changes will be lost. Continue?');
      if (!confirmed) return;
    }

    if (isEditMode) {
      setIsEditMode(false);
      setEditedExpenses([]);
      setNewExpenses([]);
      setDeletedExpenseIds([]);
    }

    setYear(newYear);
    setMonth(newMonth);

    clearNotification();
  };

  // Edit Modeの切り替え
  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Edit Mode OFF: リセット
      setEditedExpenses([]);
      setNewExpenses([]);
      setDeletedExpenseIds([]);
    } else {
      // Edit Mode ON: 現在のデータをコピー
      setEditedExpenses([...expenses]);
    }
    setIsEditMode(!isEditMode);
  };

  // 既存expenseの更新
  const updateExpense = (index: number, field: keyof ExpenseOrDeduction, value: any) => {
    const updated = [...editedExpenses];
    updated[index] = { ...updated[index], [field]: value };
    setEditedExpenses(updated);
  };

  // 既存expenseの削除マーク
  const markExpenseForDeletion = (expenseId: number) => {
    if (deletedExpenseIds.includes(expenseId)) {
      // 既に削除対象の場合は解除
      setDeletedExpenseIds(deletedExpenseIds.filter(id => id !== expenseId));
    } else {
      // 削除対象に追加
      setDeletedExpenseIds([...deletedExpenseIds, expenseId]);
    }
  };

  // 新しいexpenseの追加
  const addNewExpense = () => {
    const newExpense: Partial<ExpenseOrDeduction> = {
      name: "",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      comment: "",
      expense_or_deduction: 0,
      submission_status: 0
    };
    setNewExpenses([...newExpenses, newExpense]);
  };

  // 新しいexpenseの更新
  const updateNewExpense = (index: number, field: string, value: any) => {
    const updated = [...newExpenses];
    updated[index] = { ...updated[index], [field]: value };
    setNewExpenses(updated);
  };

  // 新しいexpenseの削除
  const removeNewExpense = (index: number) => {
    setNewExpenses(newExpenses.filter((_, i) => i !== index));
  };

  // 一括保存
  const handleSave = async () => {
    setLoading(true);
    clearNotification();
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/batch_update_expenses`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          updated: editedExpenses.filter(expense => !deletedExpenseIds.includes(expense.id)),
          created: newExpenses.filter(expense => expense.name && expense.amount),
          deleted: deletedExpenseIds,
          year,
          month
        }),
      });

      if (res.ok) {
        const data: ExpenseOrDeduction[] = await res.json();
        setExpenses(data);
        setNoExpense(data.length === 0);
        setTotalAmount(calculateTotalAmount(data));
        setUnsubmittedExists(data.some(expense => expense.submission_status === 0));
        handleToggleEditMode();
      } else {
        showNotification("Failed to save changes", 'error');
      }
    } catch {
      showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (unsubmittedExists === false) {
      showNotification("All expenses have already been submitted.", 'warning');
      return;
    }
    setLoading(true);
    clearNotification();
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/submit_expenses?year=${year}&month=${month}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data: ExpenseOrDeduction[] = await res.json();
        setExpenses(data);
        setNoExpense(data.length === 0);
        setTotalAmount(calculateTotalAmount(data));
        setUnsubmittedExists(data.some(expense => expense.submission_status === 0));
      } else {
        showNotification("Failed to submit expenses", 'error');
      }
    } catch {
      showNotification("Something went wrong while fetching the data. Please try again later.", 'error');

    }
    setLoading(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />


      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {/* 未提出アラート */}
      {unsubmittedExists && expenses.length > 0 && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are expenses that have not been submitted.
          </Alert>
        </Section>
      )}

      {noExpense && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no expenses to display.
          </Alert>
        </Section>
      )}

      {/* ローディング表示 */}
      <LoadingSpinner loading={loading} />

      {/* サマリー・操作ボタン */}
      <Section>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
          <Typography variant="body1">
            Total Expense Amount: {totalAmount}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isEditMode}
                onChange={handleToggleEditMode}
                color="primary"
              />
            }
            label="MODIFY"
          />
          {isEditMode && (
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ minWidth: 180 }}
            >
              SAVE
            </Button>
          )}
          {!isEditMode && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!unsubmittedExists || loading || noExpense}
              sx={{ minWidth: 180 }}
            >
              SUBMIT
            </Button>
          )}
        </Box>
      </Section>

      {/* テーブル */}
      <Section>
        <MonthNavigator
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
          onMonthChange={handleMonthChangeWithValidation} // カスタムハンドラーを使用
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
              {/* 既存のexpenses */}
              {(isEditMode ? editedExpenses : expenses)
                .filter(expense => !deletedExpenseIds.includes(expense.id))
                .map((expense, i) => {
                  // 元の配列でのインデックスを取得
                  const originalIndex = (isEditMode ? editedExpenses : expenses).findIndex(
                    e => e.id === expense.id
                  );

                  return (
                    <TableRow key={expense.id || i}>
                      <TableCell align="right">
                        {isEditMode ? (
                          <TextField
                            value={expense.name}
                            onChange={(e) => updateExpense(originalIndex, 'name', e.target.value)}
                            size="small"
                            fullWidth
                          />
                        ) : (
                          expense.name
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isEditMode ? (
                          <TextField
                            type="number"
                            value={expense.amount}
                            onChange={(e) => updateExpense(originalIndex, 'amount', Number(e.target.value))}
                            size="small"
                            fullWidth
                          />
                        ) : (
                          expense.amount
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isEditMode ? (
                          <TextField
                            type="date"
                            value={format(new Date(expense.date), "yyyy-MM-dd")}
                            onChange={(e) => updateExpense(originalIndex, 'date', e.target.value)}
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        ) : (
                          formatDate(expense.date)
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isEditMode ? (
                          <TextField
                            value={expense.comment || ""}
                            onChange={(e) => updateExpense(originalIndex, 'comment', e.target.value)}
                            size="small"
                            fullWidth
                          />
                        ) : (
                          <Tooltip title={expense.comment || ""} arrow>
                            <span style={{ cursor: 'pointer' }}>                                {truncateLongLetter(expense.comment)}
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isEditMode && (
                          <IconButton
                            color="error"
                            onClick={() => markExpenseForDeletion(expense.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {/* 新しいexpenses */}
              {isEditMode && newExpenses.map((expense, i) => (
                <TableRow key={`new-${i}`}>
                  <TableCell align="right">
                    <TextField
                      value={expense.name || ""}
                      onChange={(e) => updateNewExpense(i, 'name', e.target.value)}
                      placeholder="Expense name"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={expense.amount || 0}
                      onChange={(e) => updateNewExpense(i, 'amount', Number(e.target.value))}
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="date"
                      value={expense.date || format(new Date(), "yyyy-MM-dd")}
                      onChange={(e) => updateNewExpense(i, 'date', e.target.value)}
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      value={expense.comment || ""}
                      onChange={(e) => updateNewExpense(i, 'comment', e.target.value)}
                      placeholder="Comment"
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeNewExpense(i)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        {/* ADD EXPENSE ボタン */}
        {isEditMode && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={addNewExpense}
              startIcon={<AddIcon />}
              sx={{ minWidth: 200 }}
            >
              ADD EXPENSE
            </Button>
          </Box>
        )}
      </Section>
    </Box>
  );
};

export default ExpenseRegistration;

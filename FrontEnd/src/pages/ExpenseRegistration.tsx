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
  CircularProgress,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip // 追加
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Section from "../components/Section";
import { format } from "date-fns";
import { ExpenseOrDeduction } from "../types/Expense";
import { formatDate } from "../utils/format";
import { calculateTotalAmount } from "../utils/calculate";
import { handlePrevMonth, handleNextMonth } from "../utils/month";

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
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [unsubmittedExists, setUnsubmittedExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode関連
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExpenses, setEditedExpenses] = useState<ExpenseOrDeduction[]>([]);
  const [newExpenses, setNewExpenses] = useState<Partial<ExpenseOrDeduction>[]>([]);
  const [deletedExpenseIds, setDeletedExpenseIds] = useState<number[]>([]); // 削除対象のID配列

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
          setUnsubmittedExists(data.some(expense => expense.submission_status === 0));
        } else {
          setExpenses([]);
          setTotalAmount(0);
          setError("Failed to retrieve the expense list.");
        }
      } catch {
        setExpenses([]);
        setTotalAmount(0);
        setError("Something went wrong while fetching the data. Please try again later.");
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [year, month]);

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
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/batch_update_expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          updated: editedExpenses.filter(expense => !deletedExpenseIds.includes(expense.id)),
          created: newExpenses.filter(expense => expense.name && expense.amount),
          deleted: deletedExpenseIds, // 削除対象のID配列
          year,
          month
        }),
      });
      
      if (res.ok) {
        // データ再取得
        const fetchRes = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_all_expenses_for_user?year=${year}&month=${month}`,
          { credentials: "include" }
        );
        if (fetchRes.ok) {
          const data: ExpenseOrDeduction[] = await fetchRes.json();
          setExpenses(data);
          setTotalAmount(calculateTotalAmount(data));
          setUnsubmittedExists(data.some(expense => expense.submission_status === 0));
        }
        setIsEditMode(false);
        setEditedExpenses([]);
        setNewExpenses([]);
        setDeletedExpenseIds([]);
      } else {
        setError("Failed to save changes.");
      }
    } catch {
      setError("Failed to save changes.");
    }
  };

  // コメント表示用のヘルパー関数
  const truncateComment = (comment: string | null | undefined, maxLength: number = 50): string => {
    if (!comment) return "";
    return comment.length > maxLength ? comment.substring(0, maxLength) + "..." : comment;
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      {/* エラー表示 */}
      {error && (
        <Section>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Section>
      )}

      {/* ローディング表示 */}
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
              // onClick={handleSubmit}
              sx={{ minWidth: 180 }}
            >
              SUBMIT
            </Button>
          )}
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
        
        {!loading && !error && expenses.length === 0 && !isEditMode ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No expenses found for {format(new Date(year, month - 1), "MMMM yyyy")}
            </Typography>
          </Paper>
        ) : (
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
                              <span style={{ cursor: 'pointer' }}>
                                {truncateComment(expense.comment)}
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
        )}

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

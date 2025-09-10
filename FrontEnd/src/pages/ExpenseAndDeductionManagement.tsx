import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from '../components/NavigationButton';
import { Navigate } from 'react-router-dom';
import { User } from "../types/User";
import { ExpenseAndDeduction } from "../types/ExpenseAndDeduction";
import { hasRole } from "../utils/auth";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import MonthNavigator from "../components/MonthNavigator";


const ExpenseAndDeductionManagement = () => {
  const pageTitle = "Expense and Deduction Management";
  const tableHeaders = [
    "User Name",
    "Email",
    "Total Expense Amount",
    "Total Deduction Amount",
    "Number of Expenses and Deductions",
    "",
    "",
  ];
  const { notification, showNotification, clearNotification } = useNotification();
  const [users, setUsers] = React.useState<User[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [noUser, setNoUser] = useState(false);
  const [expensesAmountArray, setExpensesAmountArray] = useState<number[]>([]);
  const [deductionsAmountArray, setDeductionsAmountArray] = useState<number[]>([]);
  const [numberOfExpensesAndDeductionsArray, setNumberOfExpensesAndDeductionsArray] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      clearNotification();
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_users_with_expenses_and_deductions?year=${year}&month=${month}`, {
          credentials: "include"
        });

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
          setNoUser(data.length === 0);

          const expensesAmountArray: number[] = [];
          const deductionsAmountArray: number[] = [];
          const numberOfExpensesAndDeductionsArray: number[] = [];

          data.forEach((user) => {
            let userTotalExpensesAmount = 0;
            let userTotalDeductionsAmount = 0;
            let userNumberOfExpensesAndDeductions = 0;

            user.expenses_and_deductions?.forEach((expense: ExpenseAndDeduction) => {
              if (expense.expense_or_deduction === 0) {
                userTotalExpensesAmount += expense.amount;
              } else {
                userTotalDeductionsAmount += expense.amount;
              }
              userNumberOfExpensesAndDeductions += 1;
            });

            expensesAmountArray.push(userTotalExpensesAmount);
            deductionsAmountArray.push(userTotalDeductionsAmount);
            numberOfExpensesAndDeductionsArray.push(userNumberOfExpensesAndDeductions);
          });

          // 一括でsetState
          setExpensesAmountArray(expensesAmountArray);
          setDeductionsAmountArray(deductionsAmountArray);
          setNumberOfExpensesAndDeductionsArray(numberOfExpensesAndDeductionsArray);
        } else {
          showNotification("Failed to fetch user data", 'error');
        }
      } catch (error) {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [year, month]);

  if (!hasRole(2)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {noUser && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no users to display.
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />


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
              {users.map((user, i) => (
                <TableRow key={i}>
                  <TableCell align="right">{user.first_name + " " + user.last_name}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{expensesAmountArray[i] || 0}</TableCell>
                  <TableCell align="right">{deductionsAmountArray[i] || 0}</TableCell>
                  <TableCell align="right">{numberOfExpensesAndDeductionsArray[i] || 0}</TableCell>
                  <TableCell align="right">
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/expense_approval?user_id=${user.id}&year=${year}&month=${month}`}
                      sx={{
                        minWidth: 120,
                        height: 40,
                        fontSize: "1rem",
                        px: 2,
                      }}
                    >
                      APPROVAL
                    </NavigationButton>
                  </TableCell>
                  <TableCell align="right">
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/expense_and_deduction_registration?user_id=${user.id}&year=${year}&month=${month}`}
                      sx={{
                        minWidth: 120,
                        height: 40,
                        fontSize: "1rem",
                        px: 2,
                      }}
                    >
                      REGISTRATION
                    </NavigationButton>
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

export default ExpenseAndDeductionManagement;
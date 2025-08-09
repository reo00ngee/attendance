import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
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
import { Navigate } from 'react-router-dom';
import { format, set } from "date-fns";
import { User } from "../types/User";
import { convertToHoursAndMinutes } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";
import { hasRole } from "../utils/auth";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import MonthNavigator from "../components/MonthNavigator";


const AttendanceManagement = () => {
  const pageTitle = "Attendance Management";
  const tableHeaders = [
    "User Name",
    "Email",
    "Total Work Hours",
    "Total Working Days",
    "",
  ];
  const { notification, showNotification, clearNotification } = useNotification();
  const [users, setUsers] = React.useState<User[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [noUser, setNoUser] = useState(false);
  const [totalWorkHoursArray, setTotalWorkHoursArray] = useState<number[]>([]);
  const [totalWorkingDaysArray, setTotalWorkingDaysArray] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      clearNotification();
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_users_with_attendances?year=${year}&month=${month}`, {
          credentials: "include"
        });

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
          setNoUser(data.length === 0);

          const workHoursArray: number[] = [];
          const workingDaysArray: number[] = [];

          data.forEach((user) => {
            let userTotalWorkHours = 0;
            let userWorkingDays = 0;

            user.attendances?.forEach((attendance) => {
              const [b, n] = calculateBreakMinutesAndNetWorkingMinutes(attendance);
              userTotalWorkHours += n;
              if (attendance.start_time) {
                userWorkingDays += 1;
              }
            });

            workHoursArray.push(userTotalWorkHours);
            workingDaysArray.push(userWorkingDays);
          });

          // 一括でsetState
          setTotalWorkHoursArray(workHoursArray);
          setTotalWorkingDaysArray(workingDaysArray);
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

  if (!hasRole(1)) {
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
                  <TableCell align="right">{convertToHoursAndMinutes(totalWorkHoursArray[i]) || 0}</TableCell>
                  <TableCell align="right">{totalWorkingDaysArray[i] || 0}</TableCell>
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
                      href={`/attendance_approval?user_id=${user.id}&year=${year}&month=${month}`}
                    >
                      APPROVAL
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

export default AttendanceManagement;
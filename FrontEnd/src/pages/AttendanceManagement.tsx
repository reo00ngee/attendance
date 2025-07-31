import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from "@mui/material";
import Section from "../components/Section";
import { Navigate } from 'react-router-dom';
import { format, set } from "date-fns";
import { Attendance } from "../types/Attendance";
import { User } from "../types/User";
import { formatTimeHHMM, convertToHoursAndMinutes, formatDate } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";
import { handlePrevMonth, handleNextMonth } from "../utils/month";
import { hasRole } from "../utils/auth";


const AttendanceManagement = () => {
  const pageTitle = "Attendance Management";
  const tableHeaders = [
    "User Name",
    "Email",
    "Total Work Hours",
    "Total Working Days",
    "",
  ];
  const [users, setUsers] = React.useState<User[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [totalWorkHoursArray, setTotalWorkHoursArray] = useState<number[]>([]);
  const [totalWorkingDaysArray, setTotalWorkingDaysArray] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_users_with_attendances?year=${year}&month=${month}`, {
          credentials: "include"
        });

        const data: User[] = await response.json();
        setUsers(data);

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

      } catch (error) {
        setError("Failed to fetch attendance data");
      }
      setLoading(false);
    };
    fetchAttendanceData();
  }, [year, month]);

  if (!hasRole(1)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

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

      {/* サマリー・操作ボタン */}
      <Section>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
          <Typography variant="body1">
          </Typography>
          <Typography variant="body1">
          </Typography>
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
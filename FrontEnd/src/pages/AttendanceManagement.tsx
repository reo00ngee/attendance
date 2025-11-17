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
  Button,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from '../components/NavigationButton';
import { Navigate } from 'react-router-dom';
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

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'CREATED';
      case 1: return 'SUBMITTED';
      case 2: return 'REJECTED';
      case 3: return 'APPROVED';
      case 4: return 'CREATED_BY_MANAGER';
      case 5: return 'CALCULATED';
      default: return String(status);
    }
  };

  const handleAttendanceClosure = async () => {
    setLoading(true);
    clearNotification();
    try {
      // Pre-check for clearer validation message
      const check = await fetch(`${process.env.REACT_APP_BASE_URL}api/check_attendance_closure`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const checkBody = await check.json().catch(() => ({}));
      if (!check.ok || checkBody?.success === false) {
        const data = Array.isArray(checkBody?.data) ? checkBody.data : [];
        const names = Array.from(new Set(data.map((d: any) => d.user_name))).filter(Boolean);
        const namePreview = names.slice(0, 5).join(', ');
        const moreCount = Math.max(0, names.length - 5);
        const counts: Record<string, number> = {};
        data.forEach((d: any) => {
          const label = getStatusLabel(d?.submission_status);
          if (label === 'CREATED' || label === 'SUBMITTED' || label === 'REJECTED') {
            counts[label] = (counts[label] || 0) + 1;
          }
        });
        const breakdown = Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(', ');
        const msg = names.length > 0
          ? `Cannot close attendance. Found non-eligible records (${breakdown}). Affected users: ${namePreview}${moreCount ? ` and ${moreCount} more` : ''}.`
          : (checkBody?.error || 'Cannot close attendance due to validation errors.');
        showNotification(msg, 'error');
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/perform_attendance_closure`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success) {
          setUsers((prev) => prev.map((u) => ({
            ...u,
            company: {
              id: (u as any).company?.id ?? u.company_id ?? 0,
              attendance_ready: Boolean(data.attendance_ready ?? (u as any).company?.attendance_ready ?? true),
              expense_ready: Boolean((u as any).company?.expense_ready),
            },
          })));
          showNotification("Attendance closure successful", 'success');
        } else {
          showNotification("Failed to close attendance", 'error');
        }
      } else {
        showNotification("Failed to close attendance", 'error');
      }
    } catch {
      showNotification("Something went wrong while closing attendance. Please try again later.", 'error');
    } finally {
      setLoading(false);
    }
  };

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

      <Section>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAttendanceClosure}
            disabled={loading || users.length === 0 || Boolean((users as any)[0]?.company?.attendance_ready)}
            sx={{ minWidth: 180 }}
          >
            Attendance Closure
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
              {users.map((user, i) => (
                <TableRow key={i}>
                  <TableCell align="right">{user.first_name + " " + user.last_name}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{convertToHoursAndMinutes(totalWorkHoursArray[i]) || 0}</TableCell>
                  <TableCell align="right">{totalWorkingDaysArray[i] || 0}</TableCell>
                  <TableCell align="right">
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/attendance_approval?user_id=${user.id}&year=${year}&month=${month}`}
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
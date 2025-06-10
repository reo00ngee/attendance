import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Attendance } from "../types/Attendance";
import { formatTimeHHMM } from "../utils/format";
import { calculateDiffTime } from "../utils/calculate";



// type AttendanceRow = {
//   date: string;
//   start: string;
//   end: string;
//   break: string;
//   work: string;
// };

const AttendanceRegistrationForMonthly = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const formatDate = (startTime: string): string => {
    const date = new Date(startTime);
    const month = date.getMonth() + 1; // 0-indexed
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); // 例: "Thu"
    return `${month}/${day} ${weekday}`;
  };

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_all_attendances_for_user?year=${year}&month=${month}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        const data = await res.json();
        setAttendances(data);
        console.log("Attendance data:", data);

      } catch (err) {
        console.error("Error saving attendance:", err);
      }
    };

    fetchAttendances();
  }
    , [year, month]);
  return (
    <>
      <Box sx={{ p: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={handlePrevMonth}>&lt;</button>
          <span>{year}年 {String(month).padStart(2, '0')}月</span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="h6">月間勤務表（月次勤怠）</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          総労働時間:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Start Time</TableCell>
                <TableCell align="right">End Time</TableCell>
                <TableCell align="right">Break</TableCell>
                <TableCell align="right">Working Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.map((attendance, i) => (
                <TableRow key={i}>
                  <TableCell align="right">{formatDate(attendance.start_time)}</TableCell>
                  <TableCell align="right">{formatTimeHHMM(attendance.start_time)}</TableCell>
                  <TableCell align="right">{formatTimeHHMM(attendance.end_time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default AttendanceRegistrationForMonthly;

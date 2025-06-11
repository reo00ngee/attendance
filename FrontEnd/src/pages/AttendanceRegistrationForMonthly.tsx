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
import { format } from "date-fns";
import { Attendance } from "../types/Attendance";
import { getUserName } from "../utils/user";
import { formatTimeHHMM, convertToHoursAndMinutes, formatDate } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";

const AttendanceRegistrationForMonthly = () => {
  const pageTitle = "Attendance Registration For Monthly";
  const tableHeaders = [
    "Date",
    "Start Time",
    "",
    "End Time",
    "Break",
    "Working Hours"
  ];
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [breakMinutesArray, setBreakMinutesArray] = useState<number[]>([]);
  const [netWorkingMinutesArray, setNetWorkingMinutesArray] = useState<number[]>([]);
  const [totalWorkingMinutes, setTotalWorkingMinutes] = useState<number>(0);

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

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_all_attendances_for_user?year=${year}&month=${month}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        const data: Attendance[] = await res.json();
        setAttendances(data);
        console.log("Attendance data:", data);

        const breaks: number[] = [];
        const netWorks: number[] = [];

        data.forEach((att) => {
          const [b, n] = calculateBreakMinutesAndNetWorkingMinutes(att);
          breaks.push(b);
          netWorks.push(n);
        });

        setBreakMinutesArray(breaks);
        setNetWorkingMinutesArray(netWorks);

        const total = netWorkingMinutesArray.reduce((sum, minutes) => sum + minutes, 0);
        setTotalWorkingMinutes(total);

      } catch (err) {
        console.error("Error saving attendance:", err);
      }
    };

    fetchAttendances();
  }
    , [year, month]);
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{pageTitle}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>{getUserName()}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">月間勤務表（月次勤怠）</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          総労働時間:{convertToHoursAndMinutes(totalWorkingMinutes)}
        </Typography>
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={handlePrevMonth}>&lt;</button>
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {format(new Date(year, month - 1), "MMMM yyyy")}
            </span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
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
              {attendances.map((attendance, i) => (
                <TableRow key={i}>
                  <TableCell align="right">{formatDate(attendance.start_time)}</TableCell>
                  <TableCell align="right">{formatTimeHHMM(attendance.start_time)}</TableCell>
                  <TableCell align="right">~</TableCell>
                  <TableCell align="right">{formatTimeHHMM(attendance.end_time)}</TableCell>
                  <TableCell align="right">{convertToHoursAndMinutes(breakMinutesArray[i])} </TableCell>
                  <TableCell align="right">{convertToHoursAndMinutes(netWorkingMinutesArray[i])} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AttendanceRegistrationForMonthly;

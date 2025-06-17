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
} from "@mui/material";
import Section from "../components/Section";
import { format } from "date-fns";
import { Attendance } from "../types/Attendance";
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
    "Working Hours",
    ""
  ];
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [breakMinutesArray, setBreakMinutesArray] = useState<number[]>([]);
  const [netWorkingMinutesArray, setNetWorkingMinutesArray] = useState<number[]>([]);
  const [totalWorkingMinutes, setTotalWorkingMinutes] = useState<number>(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState<number>(0);

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

  const handleModify = (attendanceId: number) => {
    // Implement the logic to modify the attendance record
    console.log("Modify attendance with ID:", attendanceId);
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

        const breaks: number[] = [];
        const netWorks: number[] = [];

        data.forEach((att) => {
          const [b, n] = calculateBreakMinutesAndNetWorkingMinutes(att);
          breaks.push(b);
          netWorks.push(n);
        });

        setBreakMinutesArray(breaks);
        setNetWorkingMinutesArray(netWorks);

        setTotalWorkingMinutes(netWorks.reduce((sum, minutes) => sum + minutes, 0));
        setTotalWorkingDays(data.filter(att => att.start_time).length);

      } catch (err) {
        console.error("Error saving attendance:", err);
      }
    };

    fetchAttendances();
  }, [year, month]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      {/* サマリー・操作ボタン */}
      <Section>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
          <Typography variant="body1">
            Total Working Hours: {convertToHoursAndMinutes(totalWorkingMinutes)}
          </Typography>
          <Typography variant="body1">
            Total Working Days: {totalWorkingDays}d
          </Typography>
        </Box>
<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
  <Button
    variant="contained"
    component="a"
    href="/attendance_registration_for_daily"
    sx={{ minWidth: 180 }}
  >
    REGISTER
  </Button>
</Box>
      </Section>

      {/* テーブル */}
      <Section>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button onClick={handlePrevMonth} variant="contained" sx={{ minWidth: 40, mx: 1 }}>&lt;</Button>
          <span style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "1rem 1rem" }}>
            {format(new Date(year, month - 1), "MMMM yyyy")}
          </span>
          <Button onClick={handleNextMonth} variant="contained" sx={{ minWidth: 40, mx: 1 }}>&gt;</Button>
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
                      href={`/attendance_registration_for_daily?attendance_id=${attendance.attendance_id}`}
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

export default AttendanceRegistrationForMonthly;

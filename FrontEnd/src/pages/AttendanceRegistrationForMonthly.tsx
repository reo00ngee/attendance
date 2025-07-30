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
  CircularProgress
} from "@mui/material";
import Section from "../components/Section";
import { format, set } from "date-fns";
import { Attendance } from "../types/Attendance";
import { formatTimeHHMM, convertToHoursAndMinutes, formatDate } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";
import { handlePrevMonth, handleNextMonth } from "../utils/month";

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
  const [unsubmittedExists, setUnsubmittedExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (unsubmittedExists === false) {
      alert("All attendances have already been submitted.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/submit_attendances?year=${year}&month=${month}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {

        const data: Attendance[] = await res.json();
        setAttendances(data);
        setUnsubmittedExists(data.some(att => att.submission_status === 0));


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
      }
    } catch (err) {
      setError("Something went wrong while fetching the data. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchAttendances = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_all_attendances_for_user?year=${year}&month=${month}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        if (res.ok) {
          const data: Attendance[] = await res.json();
          setAttendances(data);
          setUnsubmittedExists(data.some(att => att.submission_status === 0));

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
        }
      } catch (err) {
        setError("Something went wrong while fetching the data. Please try again later.");
      }
      setLoading(false);
    };

    fetchAttendances();
  }, [year, month]);

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

      {/* 未提出アラート */}
      {unsubmittedExists && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are attendances that have not been submitted.
          </Alert>
        </Section>
      )}

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            component="a"
            href="/attendance_registration_for_daily"
            sx={{ minWidth: 180 }}
          >
            REGISTER
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ minWidth: 180 }}
          >
            SUBMIT
          </Button>
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

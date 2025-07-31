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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import Section from "../components/Section";
import { useSearchParams, Navigate } from "react-router-dom";
import { format, set } from "date-fns";
import { Attendance } from "../types/Attendance";
import { formatTimeHHMM, convertToHoursAndMinutes, formatDate, formatTimeForInput, truncateLongLetter } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";
import { handlePrevMonth, handleNextMonth } from "../utils/month";
import { hasRole } from '../utils/auth';


const AttendanceApproval = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const pageTitle = "Attendance Approval";
  const tableHeaders = [
    "Date",
    "Start Time",
    "",
    "End Time",
    "Break",
    "Working Hours",
    "Comment"
  ];
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const [breakMinutesArray, setBreakMinutesArray] = useState<number[]>([]);
  const [netWorkingMinutesArray, setNetWorkingMinutesArray] = useState<number[]>([]);
  const [totalWorkingMinutes, setTotalWorkingMinutes] = useState<number>(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState<number>(0);
  const [noAttendance, setNoAttendance] = useState(false);
  const [allApproved, setAllApproved] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/approve_attendances?user_id=${userId}&year=${year}&month=${month}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setMessage("Attendance approved successfully");
        const data: Attendance[] = await res.json();
        setAttendances(data);
        setNoAttendance(data.length === 0);
        setAllApproved(data.length > 0 && data.every(att => att.submission_status === 3));

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
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to approve attendance");
      }
    } catch (err) {
      setError("Something went wrong while approving the attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectMessage.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/reject_attendances?user_id=${userId}&year=${year}&month=${month}&rejection_reason=${encodeURIComponent(rejectMessage)}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

      if (res.ok) {
        setMessage("Attendance rejected successfully");
        setRejectDialogOpen(false);
        setRejectMessage("");
        const data: Attendance[] = await res.json();
        setAttendances(data);
        setNoAttendance(data.length === 0);


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
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to reject attendance");
      }
    } catch (err) {
      setError("Something went wrong while rejecting the attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setRejectMessage("");
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMessage(null);
    const fetchAttendances = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_submitted_and_approved_attendances?user_id=${userId}&year=${year}&month=${month}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        if (res.ok) {
          const data: Attendance[] = await res.json();
          setAttendances(data);
          setNoAttendance(data.length === 0);
          setAllApproved(data.length > 0 && data.every(att => att.submission_status === 3));

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

  if (!hasRole(1)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  if (!userId) {
    return <Navigate to="/attendance_management" replace />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      {/* メッセージがある場合は常に表示 */}
      {message && (
        <Section>
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        </Section>
      )}

      {allApproved && (
        <Section>
          <Alert severity="success" sx={{ mb: 2 }}>
            All attendances have been approved.
          </Alert>
        </Section>
      )}

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
      {noAttendance && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no attendances submitted.
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
            href="/attendance_management"
            sx={{ minWidth: 180 }}
          >
            ATTENDANCE MANAGEMENT
          </Button>
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={loading || noAttendance || allApproved}
            sx={{ minWidth: 180 }}
          >
            APPROVE
          </Button>
          <Button
            variant="contained"
            onClick={handleReject}
            disabled={loading || noAttendance || allApproved}
            sx={{
              minWidth: 180,
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            REJECT
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
                    <Tooltip title={attendance.comment || "No comment"} arrow>
                      <span style={{ cursor: "pointer" }}>{attendance.comment ? truncateLongLetter(attendance.comment, 30) : "No comment"}</span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Attendance</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this attendance:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Rejection Reason"
            variant="outlined"
            value={rejectMessage}
            onChange={(e) => setRejectMessage(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceApproval;

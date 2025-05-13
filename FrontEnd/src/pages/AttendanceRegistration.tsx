import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
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
} from "@mui/material";
import { Attendance, AttendanceBreak } from "../types/Attendance";

export const App = () => {
  const [workMinutes, setWorkMinutes] = useState<number>(0);
  const [breakMinutes, setBreakMinutes] = useState<number>(0);
  const [attendance, setAttendance] = useState<Attendance>({
    start_time: "",
    end_time: "",
    attendance_breaks: [],
  });

  const calculateTime = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    return (end.getTime() - start.getTime()) / 1000 / 60; // minutes
  };

  const convertToHoursAndMinutes = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hours ${minutes} minutes`;
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_latest_attendances_for_user`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
        });
        const data: Attendance = await res.json();
        setAttendance(data);

        const work = calculateTime(data.start_time, data.end_time);
        const breakSum = data.attendance_breaks.reduce((sum, b) => {
          return sum + calculateTime(b.start_time, b.end_time);
        }, 0);

        setWorkMinutes(work);
        setBreakMinutes(breakSum);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, []);

  // Button click function (can be shared)
  const postAction = async (endpoint: string) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/${endpoint}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      console.error(`Error during ${endpoint}:`, err);
    }
  };

  const netWorkingMinutes = workMinutes - breakMinutes;

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Attendance Registration For Today</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>UserName: YAMADA</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={() => postAction("start_work")}>
            Start Work
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={() => postAction("start_break")}>
            Start Break
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={() => postAction("finish_break")}>
            Finish Break
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={() => postAction("finish_work")}>
            Finish Work
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3, alignItems: "center" }}>
        <Grid item xs={3}>
          <Typography>Working Time Today</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel control={<Switch />} label="Modify" />
          <Button variant="contained" disabled>
            Save
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">Start Time</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">End Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Working Hours</TableCell>
                  <TableCell align="right">{attendance.start_time}</TableCell>
                  <TableCell align="right">～</TableCell>
                  <TableCell align="right">{attendance.end_time}</TableCell>
                </TableRow>

                {attendance.attendance_breaks.map((b, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{`Break ${idx + 1}`}</TableCell>
                    <TableCell align="right">{b.start_time}</TableCell>
                    <TableCell align="right">～</TableCell>
                    <TableCell align="right">{b.end_time}</TableCell>
                  </TableRow>
                ))}


                <TableRow>
                  <TableCell>Total Break Hours</TableCell>
                  <TableCell align="right">{convertToHoursAndMinutes(breakMinutes)}</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell>Net Working Hours</TableCell>
                  <TableCell />
                  <TableCell align="right">{convertToHoursAndMinutes(netWorkingMinutes)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;

import * as React from "react";
import { useState, useEffect } from "react";
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
import { Attendance } from "../types/Attendance";

export const App = () => {
  const [breakMinutes, setBreakMinutes] = useState<number>(0);
  const [netWorkingMinutes, setNetWorkingMinutes] = useState<number>(0);
  const [attendance, setAttendance] = useState<Attendance>({
    start_time: "",
    end_time: "",
    attendance_breaks: [],
  });

  function calculateTime(startTime: string, endTime?: string): number {
    if (!startTime) return 0;

    const now = new Date();

    // startTime（例: "23:30"）を Date オブジェクトに変換
    const [startHour, startMin] = startTime.split(':').map(Number);
    const start = new Date(now);
    start.setHours(startHour, startMin, 0, 0);

    let end: Date;
    if (endTime) {
      const [endHour, endMin] = endTime.split(':').map(Number);
      end = new Date(now);
      end.setHours(endHour, endMin, 0, 0);

      // 終了時間が開始時間よりも前なら翌日の時間とみなす
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
    } else {
      end = now;
    }

    const diff = (end.getTime() - start.getTime()) / (1000 * 60); // ミリ秒 → 分
    return Math.max(diff, 0); // 差が負なら0を返す（安全対策）
  }


  function convertToHoursAndMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    const hourStr = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
    const minStr = minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '';

    return [hourStr, minStr].filter(Boolean).join(' ');
  }

  function updateCalculations() {
    const work = calculateTime(attendance.start_time, attendance.end_time || undefined);
    const breakSum = attendance.attendance_breaks.reduce((sum, b) => {
      return sum + calculateTime(b.start_time, b.end_time || undefined);
    }, 0);

    setNetWorkingMinutes(work);
    setBreakMinutes(breakSum);

    // Net Working Hoursを計算し、負の値を防ぐ
    const netWorking = Math.max(work - breakSum, 0);
    setNetWorkingMinutes(netWorking);
  };

  // 初回データ取得と計算
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
        updateCalculations();
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCalculations();
    }, 60 * 1000); // 1分ごとに再計算

    return () => clearInterval(interval); // クリーンアップ
  }, [attendance]);

  useEffect(() => {
    updateCalculations(); // attendanceが更新されたら再計算
  }, [attendance]);

  // ボタンを押したときの処理
  const postAction = async (endpoint: string) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/${endpoint}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
      const data = await res.json();
      setAttendance(data);
      updateCalculations(); // ボタン押下時に計算を更新
    } catch (err) {
      console.error(`Error during ${endpoint}:`, err);
    }
  };

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
                  <TableCell align="right">{attendance.end_time || "Still Working"}</TableCell>
                </TableRow>

                {attendance.attendance_breaks.map((b, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{`Break ${idx + 1}`}</TableCell>
                    <TableCell align="right">{b.start_time}</TableCell>
                    <TableCell align="right">～</TableCell>
                    <TableCell align="right">{b.end_time || "Still on Break"}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell>Total Break Hours</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell align="right">{convertToHoursAndMinutes(breakMinutes)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Net Working Hours</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell align="right">{convertToHoursAndMinutes(netWorkingMinutes)}</TableCell>
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

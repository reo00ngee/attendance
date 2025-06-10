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
  TextField,
} from "@mui/material";
import { Attendance } from "../types/Attendance";
import { formatTimeForInput, formatTimeHHMM, convertToHoursAndMinutes } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";

const AttendanceRegistrationForDaily = () => {
  const [breakMinutes, setBreakMinutes] = useState<number>(0);
  const [netWorkingMinutes, setNetWorkingMinutes] = useState<number>(0);
  const [attendance, setAttendance] = useState<Attendance>({
    start_time: "",
    end_time: "",
    attendance_breaks: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");
  const [editedBreaks, setEditedBreaks] = useState<{ start_time: string; end_time: string }[]>([]);



  const handleStartWork = () => {
    if (!attendance.end_time) {
      alert("The previous work end time is not registered. Please register the start time first.");
      return;
    }
    postAction("start_work");
  };

  const handleFinishWork = () => {
    const unfinishedBreak = attendance.attendance_breaks.find(b => !b.end_time || b.end_time.trim() === "");

    if (unfinishedBreak) {
      alert("You have an ongoing break that hasn't ended yet. Please end it before starting a new break.");
      return;
    }
    postAction("finish_work");
  };

  const handleStartBreak = () => {
    const unfinishedBreak = attendance.attendance_breaks.find(b => !b.end_time || b.end_time.trim() === "");

    if (unfinishedBreak) {
      alert("You have an ongoing break that hasn't ended yet. Please end it before starting a new break.");
      return;
    }

    postAction("start_break");
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
        calculateBreakMinutesAndNetWorkingMinutes(data, setBreakMinutes, setNetWorkingMinutes);
        setEditedStartTime(formatTimeForInput(data.start_time));
        setEditedEndTime(formatTimeForInput(data.end_time || ""));
        setEditedBreaks(
          data.attendance_breaks.map((b) => ({
            start_time: formatTimeForInput(b.start_time),
            end_time: formatTimeForInput(b.end_time || ""),
          }))
        );
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateBreakMinutesAndNetWorkingMinutes(attendance, setBreakMinutes, setNetWorkingMinutes);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [attendance]);

  useEffect(() => {
    calculateBreakMinutesAndNetWorkingMinutes(attendance, setBreakMinutes, setNetWorkingMinutes);
  }, [attendance]);

  const postAction = async (endpoint: string) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/${endpoint}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
      const data = await res.json();
      setAttendance(data);
      calculateBreakMinutesAndNetWorkingMinutes(data, setBreakMinutes, setNetWorkingMinutes);
      setEditedStartTime(formatTimeForInput(data.start_time));
      setEditedEndTime(formatTimeForInput(data.end_time || ""));
      setEditedBreaks(
        data.attendance_breaks.map((b: { start_time: any; end_time: any }) => ({
          start_time: formatTimeForInput(b.start_time),
          end_time: formatTimeForInput(b.end_time || ""),
        }))
      );
    } catch (err) {
      console.error(`Error during ${endpoint}:`, err);
    }
  };

  // 保存ボタン押下時の処理を追加
  const handleSave = async () => {
    try {
      // 現在日時をISOで取得し、HH:MM:00まで整形する関数
      const getCurrentDateTimeString = () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
      };

      // 日付部分だけ抽出し、時間を置き換える関数
      const replaceTimePart = (originalDateTime: string, newHHMM: string): string => {
        const datePart = originalDateTime.split("T")[0];
        return `${datePart}T${newHHMM}:00`;
      };

      // attendanceのstart_timeは必ずある前提で置換
      const updatedStartTime = replaceTimePart(attendance.start_time, editedStartTime);

      // attendanceのend_timeが空・undefinedなら現在時刻をセット、それ以外は置換
      const updatedEndTime = attendance.end_time
        ? replaceTimePart(attendance.end_time, editedEndTime)
        : getCurrentDateTimeString();

      const updatedBreaks = editedBreaks.map((breakItem, idx) => {
        const datePart =
          (attendance.attendance_breaks[idx]?.start_time?.split("T")[0]) ||
          new Date().toISOString().split("T")[0];

        return {
          start_time: `${datePart}T${breakItem.start_time}:00`,
          end_time: breakItem.end_time
            ? `${datePart}T${breakItem.end_time}:00`
            : `${datePart}T${new Date().toTimeString().slice(0, 5)}:00`,
        };
      });

      const body = {
        start_time: updatedStartTime,
        end_time: updatedEndTime,
        attendance_breaks: updatedBreaks,
      };

      console.log("Updated body:", body);

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/update_attendance`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: Attendance = await res.json();
      setAttendance(data);
      calculateBreakMinutesAndNetWorkingMinutes(data, setBreakMinutes, setNetWorkingMinutes);
      setEditedStartTime(formatTimeForInput(data.start_time));
      setEditedEndTime(formatTimeForInput(data.end_time || ""));
      setEditedBreaks(
        data.attendance_breaks.map((b) => ({
          start_time: formatTimeForInput(b.start_time),
          end_time: formatTimeForInput(b.end_time || ""),
        }))
      );
      setEditMode(false);
    } catch (err) {
      console.error("Error saving attendance:", err);
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
          <Button fullWidth variant="contained" onClick={handleStartWork}>
            Start Work
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={handleStartBreak}>
            Start Break
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={() => postAction("finish_break")}>
            Finish Break
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button fullWidth variant="contained" onClick={handleFinishWork}>
            Finish Work
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3, alignItems: "center" }}>
        <Grid item xs={3}>
          <Typography>Working Time Today</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel control={<Switch checked={editMode} onChange={() => setEditMode(!editMode)} />} label="Modify" />
          <Button variant="contained" disabled={!editMode} onClick={handleSave} sx={{ ml: 2 }}>
            Save
          </Button>
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button fullWidth
            variant="contained"
            component="a"
            href="/attendance_registration_for_monthly"
          >
            MONTHLY ATTENDANCE
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
                  <TableCell align="right">
                    {editMode ? (
                      <TextField
                        size="small"
                        type="time"
                        value={editedStartTime}
                        onChange={(e) => setEditedStartTime(e.target.value)}
                        inputProps={{ step: 60 }}
                      />
                    ) : (
                      formatTimeHHMM(attendance.start_time)
                    )}
                  </TableCell>
                  <TableCell align="right">～</TableCell>
                  <TableCell align="right">
                    {editMode ? (
                      <TextField
                        size="small"
                        type="time"
                        value={editedEndTime}
                        onChange={(e) => setEditedEndTime(e.target.value)}
                        inputProps={{ step: 60 }}
                      />
                    ) : attendance.end_time ? (
                      formatTimeHHMM(attendance.end_time)
                    ) : (
                      "Still Working"
                    )}
                  </TableCell>
                </TableRow>
                {attendance.attendance_breaks.map((b, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{`Break ${idx + 1}`}</TableCell>
                    <TableCell align="right">
                      {editMode ? (
                        <TextField
                          size="small"
                          type="time"
                          value={editedBreaks[idx]?.start_time || ""}
                          onChange={(e) => {
                            const updated = [...editedBreaks];
                            updated[idx].start_time = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          inputProps={{ step: 60 }}
                        />
                      ) : (
                        formatTimeHHMM(b.start_time)
                      )}
                    </TableCell>
                    <TableCell align="right">～</TableCell>
                    <TableCell align="right">
                      {editMode ? (
                        <TextField
                          size="small"
                          type="time"
                          value={editedBreaks[idx]?.end_time || ""}
                          onChange={(e) => {
                            const updated = [...editedBreaks];
                            updated[idx].end_time = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          inputProps={{ step: 60 }}
                        />
                      ) : b.end_time ? (
                        formatTimeHHMM(b.end_time)
                      ) : (
                        "Still on Break"
                      )}
                    </TableCell>
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
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceRegistrationForDaily;
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
import { useSearchParams } from 'react-router-dom';
import Section from "../components/Section";
import { Attendance } from "../types/Attendance";
import { formatTimeForInput, formatTimeHHMM, convertToHoursAndMinutes, formatDate } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";
import { validateAttendanceInput } from "../utils/attendanceValidation";

const AttendanceRegistrationForDaily = () => {
  const pageTitle = "Attendance Registration For Daily";
  const tableHeaders = [
    "",
    "Start Time",
    "",
    "End Time",
  ]
  const [searchParams] = useSearchParams();
  const attendanceId = searchParams.get("attendance_id");
  const [breakMinutes, setBreakMinutes] = useState<number>(0);
  const [netWorkingMinutes, setNetWorkingMinutes] = useState<number>(0);
  const [attendance, setAttendance] = useState<Attendance>({
    attendance_id: 0,
    start_time: "",
    end_time: "",
    attendance_breaks: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedBreaks, setEditedBreaks] = useState<{ start_date: string; start_time: string; end_date: string; end_time: string }[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        let res;
        if (attendanceId) {
          res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_attendance_for_user?attendance_id=${attendanceId}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
          });
        } else {
          res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_latest_attendances_for_user`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
          });
        }
        const data: Attendance = await res.json();
        setAttendance(data);
        const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(data);
        setBreakMinutes(breakSum);
        setNetWorkingMinutes(netWorking);

        setEditedStartTime(formatTimeForInput(data.start_time));
        setEditedEndTime(formatTimeForInput(data.end_time || ""));
        setEditedStartDate(data.start_time ? data.start_time.split("T")[0] : "");
        setEditedEndDate(data.end_time ? data.end_time.split("T")[0] : "");
        setEditedBreaks(
          data.attendance_breaks.map((b) => ({
            start_date: b.start_time ? b.start_time.split("T")[0] : "",
            start_time: formatTimeForInput(b.start_time),
            end_date: b.end_time ? b.end_time.split("T")[0] : "",
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
      const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(attendance);
      setBreakMinutes(breakSum);
      setNetWorkingMinutes(netWorking);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [attendance]);

  useEffect(() => {
    const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(attendance);
    setBreakMinutes(breakSum);
    setNetWorkingMinutes(netWorking);
  }, [attendance]);

  const handleStartWork = () => {
    if (!attendance.end_time) {
      alert("The previous work end time is not registered. Please register the start time first.");
      return;
    }
    postAction("start_work");
  };

  const handleFinishWork = () => {
    if (attendance.end_time) {
      alert("End time has already been set.");
      return;
    }
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

  const handleFinishBreak = () => {
    const unfinishedBreak = attendance.attendance_breaks.find(b => !b.end_time || b.end_time.trim() === "");
    if (!unfinishedBreak) {
      alert("There is no ongoing break to finish.");
      return;
    }
    postAction("finish_break");
  };

  const postAction = async (endpoint: string) => {
    try {
      let url = `${process.env.REACT_APP_BASE_URL}api/${endpoint}`;

      if (endpoint !== "start_work" && attendance.attendance_id) {
        url += `?attendance_id=${attendance.attendance_id}`;
      }
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
      const data = await res.json();
      setAttendance(data);
      const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(data);
      setBreakMinutes(breakSum);
      setNetWorkingMinutes(netWorking);
      setEditedStartTime(formatTimeForInput(data.start_time));
      setEditedEndTime(formatTimeForInput(data.end_time || ""));
      setEditedStartDate(data.start_time ? data.start_time.split("T")[0] : "");
      setEditedEndDate(data.end_time ? data.end_time.split("T")[0] : "");
      setEditedBreaks(
        data.attendance_breaks.map((b: { start_time: any; end_time: any }) => ({
          start_date: b.start_time ? b.start_time.split("T")[0] : "",
          start_time: formatTimeForInput(b.start_time),
          end_date: b.end_time ? b.end_time.split("T")[0] : "",
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
      // バリデーションを外部関数で実施
      const validationError = validateAttendanceInput(
        editedStartDate,
        editedStartTime,
        editedEndDate,
        editedEndTime,
        editedBreaks,
        attendance
      );
      if (validationError) {
        alert(validationError);
        return;
      }

      // ...ここから下は既存の保存処理そのまま...
      const getCurrentDateTimeString = () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
      };

      const replaceDateTime = (date: string, time: string) => `${date}T${time}:00`;

      const updatedStartTime = replaceDateTime(editedStartDate, editedStartTime);
      const updatedEndTime = editedEndTime && editedEndDate
        ? replaceDateTime(editedEndDate, editedEndTime)
        : getCurrentDateTimeString();

      const updatedBreaks = editedBreaks.map((breakItem) => ({
        start_time: replaceDateTime(breakItem.start_date, breakItem.start_time),
        end_time: breakItem.end_time && breakItem.end_date
          ? replaceDateTime(breakItem.end_date, breakItem.end_time)
          : "",
      }));

      const body = {
        attendance_id: attendance.attendance_id,
        start_time: updatedStartTime,
        end_time: updatedEndTime,
        attendance_breaks: updatedBreaks,
      };

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
      const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(data);
      setBreakMinutes(breakSum);
      setNetWorkingMinutes(netWorking);
      setEditedStartTime(formatTimeForInput(data.start_time));
      setEditedEndTime(formatTimeForInput(data.end_time || ""));
      setEditedStartDate(data.start_time ? data.start_time.split("T")[0] : "");
      setEditedEndDate(data.end_time ? data.end_time.split("T")[0] : "");
      setEditedBreaks(
        data.attendance_breaks.map((b) => ({
          start_date: b.start_time ? b.start_time.split("T")[0] : "",
          start_time: formatTimeForInput(b.start_time),
          end_date: b.end_time ? b.end_time.split("T")[0] : "",
          end_time: formatTimeForInput(b.end_time || ""),
        }))
      );
      setEditMode(false);
    } catch (err) {
      console.error("Error saving attendance:", err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      <Section>
        {/* ボタン群 */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" onClick={handleStartWork}>
              Start Work
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" onClick={handleStartBreak}>
              Start Break
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" onClick={handleFinishBreak}>
              Finish Break
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" onClick={handleFinishWork}>
              Finish Work
            </Button>
          </Grid>
        </Grid>
      </Section>

      <Section>
        {/* サマリーや操作ボタン */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography>{formatDate(attendance.start_time)}</Typography>
          <Box>
            <FormControlLabel control={<Switch checked={editMode} onChange={() => setEditMode(!editMode)} />} label="Modify" />
            <Button variant="contained" disabled={!editMode} onClick={handleSave} sx={{ ml: 2 }}>
              Save
            </Button>
          </Box>
          <Button
            variant="contained"
            component="a"
            href="/attendance_registration_for_monthly"
            sx={{ minWidth: 180 }}
          >
            MONTHLY ATTENDANCE
          </Button>
        </Box>
        {/* テーブル */}
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
              <TableRow>
                <TableCell>Working Hours</TableCell>
                <TableCell align="right">
                  {editMode ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <TextField
                        size="small"
                        type="date"
                        value={editedStartDate}
                        onChange={e => setEditedStartDate(e.target.value)}
                        sx={{ minWidth: 100, flex: 1 }}
                      />
                      <TextField
                        size="small"
                        type="time"
                        value={editedStartTime}
                        onChange={e => setEditedStartTime(e.target.value)}
                        inputProps={{ step: 60 }}
                        sx={{ minWidth: 80, flex: 1 }}
                      />
                    </Box>
                  ) : (
                    formatTimeHHMM(attendance.start_time)
                  )}
                </TableCell>
                <TableCell align="right">～</TableCell>
                <TableCell align="right">
                  {editMode ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      <TextField
                        size="small"
                        type="date"
                        value={editedEndDate}
                        onChange={e => setEditedEndDate(e.target.value)}
                        sx={{ minWidth: 100, flex: 1 }}
                      />
                      <TextField
                        size="small"
                        type="time"
                        value={editedEndTime}
                        onChange={e => setEditedEndTime(e.target.value)}
                        inputProps={{ step: 60 }}
                        sx={{ minWidth: 80, flex: 1 }}
                      />
                    </Box>
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
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <TextField
                          size="small"
                          type="date"
                          value={editedBreaks[idx]?.start_date || ""}
                          onChange={e => {
                            const updated = [...editedBreaks];
                            updated[idx].start_date = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          sx={{ minWidth: 100, flex: 1 }}
                        />
                        <TextField
                          size="small"
                          type="time"
                          value={editedBreaks[idx]?.start_time || ""}
                          onChange={e => {
                            const updated = [...editedBreaks];
                            updated[idx].start_time = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          inputProps={{ step: 60 }}
                          sx={{ minWidth: 80, flex: 1 }}
                        />
                      </Box>
                    ) : (
                      formatTimeHHMM(b.start_time)
                    )}
                  </TableCell>
                  <TableCell align="right">～</TableCell>
                  <TableCell align="right">
                    {editMode ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <TextField
                          size="small"
                          type="date"
                          value={editedBreaks[idx]?.end_date || ""}
                          onChange={e => {
                            const updated = [...editedBreaks];
                            updated[idx].end_date = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          sx={{ minWidth: 100, flex: 1 }}
                        />
                        <TextField
                          size="small"
                          type="time"
                          value={editedBreaks[idx]?.end_time || ""}
                          onChange={e => {
                            const updated = [...editedBreaks];
                            updated[idx].end_time = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          inputProps={{ step: 60 }}
                          sx={{ minWidth: 80, flex: 1 }}
                        />
                      </Box>
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
      </Section>
    </Box>
  );
};

export default AttendanceRegistrationForDaily;
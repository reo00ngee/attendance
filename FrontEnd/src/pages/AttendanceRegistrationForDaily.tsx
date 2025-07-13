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
  Alert,
} from "@mui/material";
import { useSearchParams } from 'react-router-dom';
import Section from "../components/Section";
import { Attendance, EditedBreaks } from "../types/Attendance";
import { formatTimeForInput, formatTimeHHMM, convertToHoursAndMinutes, formatDate } from "../utils/format";
import { calculateBreakMinutesAndNetWorkingMinutes } from "../utils/calculate";
import { validateAttendanceInput } from "../utils/attendanceValidation";
import DeleteIcon from "@mui/icons-material/Delete";

const AttendanceRegistrationForDaily = () => {
  const tableHeaders = [
    "",
    "Start Time",
    "",
    "End Time",
  ]
  const [searchParams] = useSearchParams();
  const attendanceId = searchParams.get("attendance_id");
  const pageTitle = attendanceId
    ? "Attendance Modification For Daily"
    : "Attendance Registration For Daily";
  const [breakMinutes, setBreakMinutes] = useState<number>(0);
  const [netWorkingMinutes, setNetWorkingMinutes] = useState<number>(0);
  const [attendance, setAttendance] = useState<Attendance>({
    attendance_id: 0,
    start_time: "",
    end_time: "",
    comment: "",
    submission_status: 0,
    attendance_breaks: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedBreaks, setEditedBreaks] = useState<EditedBreaks[]>([]);
  const [editedComment, setEditedComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(attendance);
    setBreakMinutes(breakSum);
    setNetWorkingMinutes(netWorking);
  }

  // 初期データ取得
  useEffect(() => {
    if (attendanceId) {
      // クエリがある場合のみデータ取得
      const fetchAttendance = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_attendance_for_user?attendance_id=${attendanceId}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
          });
          const data: Attendance = await res.json();
          setAttendance(data);
          setEditMode(true);
          calculate();
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
          setEditedComment(data.comment || "");
        } catch (err) {
          setError("Failed to fetch attendance data. Please try again later.");
        }
      };
      fetchAttendance();
    }
  }, [attendanceId]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculate();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [attendance]);

  useEffect(() => {
    calculate();
  }, [attendance]);

  const handleStartWork = () => {
    if (attendance.start_time) {
      alert("Start time has already been set.");
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
    if (attendance.end_time) {
      const now = new Date();
      const end = new Date(attendance.end_time);
      if (now > end) {
        alert("You cannot start a break after the attendance end time.");
        return;
      }
    }

    const unfinishedBreak = attendance.attendance_breaks.find(b => !b.end_time || b.end_time.trim() === "");
    if (unfinishedBreak) {
      alert("You have an ongoing break that hasn't ended yet. Please end it before starting a new break.");
      return;
    }

    postAction("start_break");
  };

  const handleFinishBreak = () => {
    if (attendance.end_time) {
      const now = new Date();
      const end = new Date(attendance.end_time);
      if (now > end) {
        alert("You cannot finish a break after the attendance end time.");
        return;
      }
    }

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
      calculate();
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

  const handleSave = async () => {
    try {
      const validationError = validateAttendanceInput(
        editedStartDate,
        editedStartTime,
        editedEndDate,
        editedEndTime,
        editedBreaks,
        attendance
      );
      if (validationError) {
        setError(validationError); // アラートではなく画面描画用にセット
        return;
      }

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
        comment: editedComment,
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
      setEditedComment(data.comment || "");
      calculate();
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
      setError("An error occurred while processing your request.");
    }
  };

  const handleAddBreak = () => {
    setEditedBreaks([
      ...editedBreaks,
      {
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
      },
    ]);
  };

  const handleRemoveBreak = (idx: number) => {
    const updated = [...editedBreaks];
    updated.splice(idx, 1);
    setEditedBreaks(updated);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      <Section>
        {/* ボタン群：attendanceIdがない場合のみ表示 */}
        {!attendanceId && (
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
        )}
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
                  ) : attendance.start_time ? (
                    "Still Working"
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
              {editedBreaks.map((b, idx) => (
                <TableRow key={idx}>
                  <TableCell>{`Break ${idx + 1}`}</TableCell>
                  <TableCell align="right">
                    {editMode ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <TextField
                          size="small"
                          type="date"
                          value={b.start_date || ""}
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
                          value={b.start_time || ""}
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
                          value={b.end_date || ""}
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
                          value={b.end_time || ""}
                          onChange={e => {
                            const updated = [...editedBreaks];
                            updated[idx].end_time = e.target.value;
                            setEditedBreaks(updated);
                          }}
                          inputProps={{ step: 60 }}
                          sx={{ minWidth: 80, flex: 1 }}
                        />
                        <Button
                          color="error"
                          size="small"
                          sx={{ ml: 1, minWidth: "auto", p: 0 }}
                          onClick={() => handleRemoveBreak(idx)}
                        >
                          <DeleteIcon />
                        </Button>
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
              {/* 追加ボタン */}
              {editMode && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleAddBreak}
                      sx={{ mt: 1 }}
                    >
                      ADD BREAK
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* コメント欄 */}
      <Section>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Comment
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={editedComment}
              onChange={e => setEditedComment(e.target.value)}
              variant="outlined"
              placeholder="Enter your comment"
            />
          ) : (
            <Box sx={{ minHeight: 48, p: 1, bgcolor: "#fafafa", borderRadius: 1, border: "1px solid #eee" }}>
              {attendance.comment || <span style={{ color: "#bbb" }}>No comment</span>}
            </Box>
          )}
        </Box>
      </Section >
    </Box>
  );
};

export default AttendanceRegistrationForDaily;
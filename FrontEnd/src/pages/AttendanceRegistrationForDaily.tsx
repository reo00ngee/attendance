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
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from '../components/NavigationButton';
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
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

  // NotificationAlertの追加
  const { notification, showNotification, clearNotification } = useNotification();

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
  const [loading, setLoading] = useState(!!attendanceId); // attendanceIdがある場合のみtrue

  // errorをローカル用として残す（バリデーションエラー用）
  const [validationError, setValidationError] = useState<string | null>(null);

  const calculate = () => {
    const [breakSum, netWorking] = calculateBreakMinutesAndNetWorkingMinutes(attendance);
    setBreakMinutes(breakSum);
    setNetWorkingMinutes(netWorking);
  }

  // 初期データ取得
  useEffect(() => {
    if (attendanceId) {
      const fetchAttendance = async () => {
        setLoading(true);
        clearNotification();
        try {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/get_attendance_for_user?attendance_id=${attendanceId}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
          });

          if (res.ok) {
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
          } else {
            showNotification("Failed to fetch attendance data", 'error');
          }
        } catch (err) {
          showNotification("Failed to fetch attendance data. Please try again later.", 'error');
        } finally {
          setLoading(false); // 必ずloadingを終了
        }
      };
      fetchAttendance();
    } else {
      // attendanceIdがない場合は即座にloadingを終了
      setLoading(false);
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

  // ボタンの無効化判定関数
  const isStartWorkDisabled = () => {
    return !!attendance.start_time || loading;
  };

  const isStartBreakDisabled = () => {
    // start_timeがない場合は無効
    if (!attendance.start_time) return true;

    if (attendance.end_time?.trim()) {
      const now = new Date();
      const end = new Date(attendance.end_time);
      if (now > end) return true;
    }

    const unfinishedBreak = attendance.attendance_breaks.find(
      b => !b.end_time?.trim()
    );
    return !!unfinishedBreak || loading;
  };

  const isFinishBreakDisabled = () => {
    // start_timeがない場合は無効
    if (!attendance.start_time) return true;

    if (attendance.end_time?.trim()) {
      const now = new Date();
      const end = new Date(attendance.end_time);
      if (now > end) return true;
    }

    const unfinishedBreak = attendance.attendance_breaks.find(
      b => !b.end_time?.trim()
    );
    return !unfinishedBreak || loading; // 進行中の休憩がない場合は無効
  };

  const isFinishWorkDisabled = () => {
    // start_timeがない場合は無効
    if (!attendance.start_time) return true;
    if (attendance.end_time?.trim()) return true;

    const unfinishedBreak = attendance.attendance_breaks.find(
      b => !b.end_time?.trim()
    );
    return !!unfinishedBreak || loading;
  };

  // 簡素化されたhandler関数
  const handleStartWork = () => {
    if (isStartWorkDisabled()) {
      if (attendance.start_time) {
        showNotification("Start time has already been set.", 'warning');
      } else {
        showNotification("Please start work first.", 'warning');
      }
      return;
    }
    postAction("start_work");
  };
  const handleFinishWork = () => {
    if (isFinishWorkDisabled()) {
      if (!attendance.start_time) {
        showNotification("Please start work first.", 'warning');
      } else if (attendance.end_time) {
        showNotification("End time has already been set.", 'warning');
      } else {
        showNotification("You have an ongoing break that hasn't ended yet. Please end it before finishing work.", 'warning');
      }
      return;
    }
    postAction("finish_work");
  };

  const handleStartBreak = () => {
    if (isStartBreakDisabled()) {
      if (!attendance.start_time) {
        showNotification("Please start work first.", 'warning');
        return;
      }

      if (attendance.end_time?.trim()) {
        const now = new Date();
        const end = new Date(attendance.end_time);
        if (now > end) {
          showNotification("You cannot start a break after the attendance end time.", 'warning');
          return;
        }
      }

      const unfinishedBreak = attendance.attendance_breaks.find(b => !b.end_time?.trim());
      if (unfinishedBreak) {
        showNotification("You have an ongoing break that hasn't ended yet. Please end it before starting a new break.", 'warning');
        return;
      }
    }
    postAction("start_break");
  };

  const handleFinishBreak = () => {
    if (isFinishBreakDisabled()) {
      if (!attendance.start_time) {
        showNotification("Please start work first.", 'warning');
        return;
      }

      if (attendance.end_time?.trim()) {
        const now = new Date();
        const end = new Date(attendance.end_time);
        if (now > end) {
          showNotification("You cannot finish a break after the attendance end time.", 'warning');
          return;
        }
      } else {
        showNotification("There is no ongoing break to finish.", 'warning');
        return;
      }
    }
    postAction("finish_break");
  };

  const postAction = async (endpoint: string) => {
    clearNotification();
    setLoading(true);
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

      if (res.ok) {
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

        // 成功メッセージを表示
        const actionMessages = {
          start_work: "Work started successfully",
          finish_work: "Work finished successfully",
          start_break: "Break started successfully",
          finish_break: "Break finished successfully"
        };
        showNotification(actionMessages[endpoint as keyof typeof actionMessages], 'success');
      } else {
        const errorData = await res.json();
        showNotification(errorData.message || `Failed to ${endpoint.replace('_', ' ')}`, 'error');
      }
    } catch (err) {
      console.error(`Error during ${endpoint}:`, err);
      showNotification(`Error during ${endpoint.replace('_', ' ')}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    clearNotification();
    setLoading(true);
    setValidationError(null); // バリデーションエラーをクリア

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
        setValidationError(validationError); // バリデーションエラーは従来通り
        return;
      }

      const replaceDateTime = (date: string, time: string) => `${date}T${time}:00`;

      const updatedStartTime = replaceDateTime(editedStartDate, editedStartTime);
      let endDateToUse = editedEndDate;

      if (!editedEndDate) {
        endDateToUse = editedStartDate;
      }

      let updatedEndTime = editedEndTime && endDateToUse
        ? replaceDateTime(endDateToUse, editedEndTime)
        : replaceDateTime(editedStartDate, editedStartTime);

      const startDateObj = new Date(updatedStartTime);
      const endDateObj = new Date(updatedEndTime);

      if (endDateObj < startDateObj) {
        updatedEndTime = replaceDateTime(editedStartDate, editedEndTime || editedStartTime);
      }

      const updatedBreaks = editedBreaks.map((breakItem) => ({
        start_time: replaceDateTime(breakItem.start_date, breakItem.start_time),
        end_time: breakItem.end_time && breakItem.end_date
          ? replaceDateTime(breakItem.end_date, breakItem.end_time)
          : "",
      }));

      const body = {
        attendance_id: attendance.attendance_id ? attendance.attendance_id : undefined,
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

      if (res.ok) {
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
        showNotification("Attendance updated successfully", 'success');
      } else {
        const errorData = await res.json();
        showNotification(errorData.message || "Failed to update attendance", 'error');
      }
    } catch (err) {
      showNotification("An error occurred while processing your request.", 'error');
    } finally {
      setLoading(false);
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
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {/* バリデーションエラー */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* ローディング表示 */}
      <LoadingSpinner loading={loading} />

      {/* ボタン群：attendanceIdがない場合のみ表示 */}
      {!attendanceId && (
        <Section>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleStartWork}
                disabled={isStartWorkDisabled()}
              >
                Start Work
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleStartBreak}
                disabled={isStartBreakDisabled()}
              >
                Start Break
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleFinishBreak}
                disabled={isFinishBreakDisabled()}
              >
                Finish Break
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleFinishWork}
                disabled={isFinishWorkDisabled()}
              >
                Finish Work
              </Button>
            </Grid>
          </Grid>
        </Section>
      )}

      <Section>
        {/* サマリーや操作ボタン */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography>{formatDate(attendance.start_time)}</Typography>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={editMode}
                  onChange={() => setEditMode(!editMode)}
                  disabled={loading} // ローディング中は無効化
                />
              }
              label="Modify"
            />
            <Button
              variant="contained"
              disabled={!editMode || loading} // ローディング中は無効化
              onClick={handleSave}
              sx={{ ml: 2 }}
            >
              SAVE
            </Button>
          </Box>
          <NavigationButton
            variant="contained"
            to="/attendance_registration_for_monthly"
            sx={{ minWidth: 180 }}
          >
            MONTHLY ATTENDANCE
          </NavigationButton>
        </Box>

        {/* テーブル - 常に表示 */}
        <TableContainer component={Paper} sx={{ opacity: loading ? 0.6 : 1 }}>
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
                        disabled={loading} // ローディング中は無効化
                        sx={{ minWidth: 100, flex: 1 }}
                      />
                      <TextField
                        size="small"
                        type="time"
                        value={editedStartTime}
                        onChange={e => setEditedStartTime(e.target.value)}
                        disabled={loading} // ローディング中は無効化
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
                        disabled={loading} // ローディング中は無効化
                        sx={{ minWidth: 100, flex: 1 }}
                      />
                      <TextField
                        size="small"
                        type="time"
                        value={editedEndTime}
                        onChange={e => setEditedEndTime(e.target.value)}
                        disabled={loading} // ローディング中は無効化
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
                          disabled={loading} // ローディング中は無効化
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
                          disabled={loading} // ローディング中は無効化
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
                          disabled={loading} // ローディング中は無効化
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
                          disabled={loading} // ローディング中は無効化
                          inputProps={{ step: 60 }}
                          sx={{ minWidth: 80, flex: 1 }}
                        />
                        <Button
                          color="error"
                          size="small"
                          disabled={loading} // ローディング中は無効化
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
                      disabled={loading} // ローディング中は無効化
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
              disabled={loading} // ローディング中は無効化
              variant="outlined"
              placeholder="Enter your comment"
            />
          ) : (
            <Box sx={{ minHeight: 48, p: 1, bgcolor: "#fafafa", borderRadius: 1, border: "1px solid #eee" }}>
              {attendance.comment || <span style={{ color: "#bbb" }}>No comment</span>}
            </Box>
          )}
        </Box>
      </Section>
    </Box>
  );
};

export default AttendanceRegistrationForDaily;
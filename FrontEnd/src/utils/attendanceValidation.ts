export function validateAttendanceInput(
  editedStartDate: string,
  editedStartTime: string,
  editedEndDate: string,
  editedEndTime: string,
  editedBreaks: any[],
  attendance: any
): string | null {
  // 必須チェック
  if (!editedStartDate || !editedStartTime) {
    return "Start date and time are required.";
  }

  // 日付・時刻の形式チェック
  const start = new Date(`${editedStartDate}T${editedStartTime}:00`);
  if (isNaN(start.getTime())) {
    return "Start date or time is invalid.";
  }
  if (editedEndDate && editedEndTime) {
    const end = new Date(`${editedEndDate}T${editedEndTime}:00`);
    if (isNaN(end.getTime())) {
      return "End date or time is invalid.";
    }
    if (end < start) {
      return "End time must be after start time.";
    }
  }

  // 各breakのバリデーション
  for (let i = 0; i < editedBreaks.length; i++) {
    const b = editedBreaks[i];
    if (!b.start_date || !b.start_time) {
      return `Break ${i + 1}: Start date and time are required.`;
    }
    if (b.end_date && !b.end_time) {
      return `Break ${i + 1}: End time is required if end date is set.`;
    }
    if (!b.end_date && b.end_time) {
      return `Break ${i + 1}: End date is required if end time is set.`;
    }
    if (b.end_date && b.end_time) {
      const breakStart = new Date(`${b.start_date}T${b.start_time}:00`);
      const breakEnd = new Date(`${b.end_date}T${b.end_time}:00`);
      if (breakEnd < breakStart) {
        return `Break ${i + 1}: End time must be after start time.`;
      }
    }
  }

  // 後続breakがある場合、start_timeまたはend_timeが空はNG
  for (let i = 0; i < editedBreaks.length - 1; i++) {
    if (
      (!editedBreaks[i].start_time || !editedBreaks[i].start_date ||
        !editedBreaks[i].end_time || !editedBreaks[i].end_date) &&
      editedBreaks[i + 1].start_time && editedBreaks[i + 1].start_date
    ) {
      return `Break ${i + 1}: Start and end time must be set if there is a subsequent break.`;
    }
  }

  // attendanceのstart_time, end_timeをDate型で取得
  const attendanceStart = new Date(`${editedStartDate}T${editedStartTime}:00`);
  const attendanceEnd =
    editedEndDate && editedEndTime
      ? new Date(`${editedEndDate}T${editedEndTime}:00`)
      : null;

  for (let i = 0; i < editedBreaks.length; i++) {
    const b = editedBreaks[i];
    // breakの開始がattendanceの開始より前
    if (b.start_date && b.start_time) {
      const breakStart = new Date(`${b.start_date}T${b.start_time}:00`);
      if (breakStart < attendanceStart) {
        return `Break ${i + 1}: Start time must not be before attendance start time.`;
      }
      // breakの終了がattendanceの開始より前
      if (b.end_date && b.end_time) {
        const breakEnd = new Date(`${b.end_date}T${b.end_time}:00`);
        if (breakEnd < attendanceStart) {
          return `Break ${i + 1}: End time must not be before attendance start time.`;
        }
      }
    }
    // breakの開始・終了がattendanceの終了より後
    if (attendanceEnd) {
      if (b.start_date && b.start_time) {
        const breakStart = new Date(`${b.start_date}T${b.start_time}:00`);
        if (breakStart > attendanceEnd) {
          return `Break ${i + 1}: Start time must not be after attendance end time.`;
        }
      }
      if (b.end_date && b.end_time) {
        const breakEnd = new Date(`${b.end_date}T${b.end_time}:00`);
        if (breakEnd > attendanceEnd) {
          return `Break ${i + 1}: End time must not be after attendance end time.`;
        }
      }
    }
  }

  return null;
}
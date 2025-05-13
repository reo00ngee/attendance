export interface AttendanceBreak {
  start_time: string;
  end_time: string;
}

export interface Attendance {
  start_time: string;
  end_time: string;
  attendance_breaks: AttendanceBreak[]; 
}
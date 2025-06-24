export interface AttendanceBreak {
  start_time: string;
  end_time: string;
}

export interface Attendance {
  attendance_id: number;
  start_time: string;
  end_time: string;
  comment: string;
  submission_status: number;
  attendance_breaks: AttendanceBreak[]; 
}
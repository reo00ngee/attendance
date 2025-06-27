import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import Section from "../components/Section";
import { useNavigate } from "react-router-dom";

const AttendanceManagement = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Section>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Attendance Management
        </Typography>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Manage and review attendance records for all users. You can view daily and monthly attendance, register new records, and check submission statuses.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/attendance_registration_for_daily")}
            >
              Daily Attendance
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/attendance_registration_for_monthly")}
            >
              Monthly Attendance
            </Button>
          </Box>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Submission Types
          </Typography>
          <ul>
            <li>
              <b>Attendance</b>: Submission type for attendance records.
            </li>
            <li>
              <b>Expense</b>: Submission type for expense reimbursements.
            </li>
          </ul>
        </Paper>
      </Section>
    </Box>
  );
};

export default AttendanceManagement;
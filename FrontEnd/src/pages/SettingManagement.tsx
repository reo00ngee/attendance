import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSearchParams, Navigate } from "react-router-dom";
import { CLOSING_DATE } from "../constants/closingDate";
import { PAYROLL_ROUNDING_INTERVAL } from "../constants/payrollRoundingInterval";
import { PROMPT_SUBMISSION_REMINDER_DAYS } from "../constants/promptSubmissionReminderDays";
import { CURRENCY } from "../constants/currency";
import { Setting } from "../types/Setting";
import { validateUserRegistration } from "../utils/userValidation";
import { validateSettingModification } from "../utils/settingValidation";
import { hasRole } from '../utils/auth';


const SettingManagement = () => {
  const pageTitle = "Setting Management";
  const { notification, showNotification, clearNotification } = useNotification();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState<number>(1);
  const [closingDate, setClosingDate] = useState<number>(30);
  const [payrollRoundingInterval, setPayrollRoundingInterval] = useState<number>(1);
  const [promptSubmissionReminderDays, setPromptSubmissionReminderDays] = useState<number>(3);
  const [standardWorkingHours, setStandardWorkingHours] = useState<number>(8);
  const [overtimePayMultiplier, setOvertimePayMultiplier] = useState<number>(1);
  const [nightShiftHoursFrom, setNightShiftHoursFrom] = useState("");
  const [nightShiftHoursTo, setNightShiftHoursTo] = useState("");
  const [nightShiftPayMultiplier, setNightShiftPayMultiplier] = useState<number>(1);
  const [holidayPayMultiplier, setHolidayPayMultiplier] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [setting, setSetting] = useState<Setting | null>(null);


  // fetch setting data
  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      clearNotification();
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_setting`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "");
          setAddress(data.address || "");
          setPhoneNumber(data.phone_number || "");
          setEmail(data.email || "");
          setCurrency(data.currency || CURRENCY[1].value);
          setClosingDate(data.closing_date || CLOSING_DATE[30].value);
          setPayrollRoundingInterval(data.payroll_rounding_interval || PAYROLL_ROUNDING_INTERVAL[1].value);
          setPromptSubmissionReminderDays(data.prompt_submission_reminder_days || PROMPT_SUBMISSION_REMINDER_DAYS[3].value);
          setStandardWorkingHours(data.standard_working_hours || 8);
          setOvertimePayMultiplier(data.overtime_pay_multiplier || 1);
          setNightShiftHoursFrom(data.night_shift_hours_from || "");
          setNightShiftHoursTo(data.night_shift_hours_to || "");
          setNightShiftPayMultiplier(data.night_shift_pay_multiplier || 1);
          setHolidayPayMultiplier(data.holiday_pay_multiplier || 1);
        } else {
          showNotification("Failed to retrieve the setting data.", 'error');
        }
      } catch (err) {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();

    const validationError = validateSettingModification({
      name,
      address,
      phoneNumber,
      email,
      currency,
      closingDate,
      payrollRoundingInterval,
      promptSubmissionReminderDays,
      standardWorkingHours,
      overtimePayMultiplier,
      nightShiftHoursFrom,
      nightShiftHoursTo,
      nightShiftPayMultiplier,
      holidayPayMultiplier,
    });

    if (validationError) {
      showNotification(validationError, 'warning');
      setLoading(false);
      return;
    }

    try {
      let url = "";
      let method = "";
      let body: any = {
        name,
        address,
        phone_number: phoneNumber,
        email,
        currency,
        closing_date: closingDate,
        payroll_rounding_interval: payrollRoundingInterval,
        prompt_submission_reminder_days: promptSubmissionReminderDays,
        standard_working_hours: standardWorkingHours,
        overtime_pay_multiplier: overtimePayMultiplier,
        night_shift_hours_from: nightShiftHoursFrom === "" ? null : nightShiftHoursFrom,
        night_shift_hours_to: nightShiftHoursTo === "" ? null : nightShiftHoursTo,
        night_shift_pay_multiplier: nightShiftPayMultiplier,
        holiday_pay_multiplier: holidayPayMultiplier,
      };

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}api/update_setting`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showNotification("Setting updated successfully!", 'success');
      } else {
        const data = await res.json();
        const errorMessages = Object.values(data.errors)
          .flat()
          .join("\n");
        showNotification(errorMessages || "An error occurred while processing your request.", 'error');
      }
    } catch (err) {
      showNotification("An error occurred while processing your request.", 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!hasRole(4)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />

      <Section>
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            mx: "auto",
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            {/* 基本情報セクション */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Company Information
            </Typography>
            
            <TextField
              label="Company Name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2 }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              sx={{ mb: 2 }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            
            <TextField
              label="Email"
              type="email"
              fullWidth
              sx={{ mb: 3 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* 給与設定セクション */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: "bold" }}>
              Payroll Settings
            </Typography>
            
            <TextField
              label="Currency"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={currency}
              onChange={(e) => setCurrency(Number(e.target.value))}
              required
            >
              {CURRENCY.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            {/* Closing Date */}
            <TextField
              label="Closing Date"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={closingDate}
              required
              onChange={(e) => setClosingDate(Number(e.target.value))}
            >
              {CLOSING_DATE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            {/* Payroll Rounding Interval */}
            <TextField
              label="Payroll Rounding Interval"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={payrollRoundingInterval}
              onChange={(e) => setPayrollRoundingInterval(Number(e.target.value))}
              required
            >
              {PAYROLL_ROUNDING_INTERVAL.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            {/* Submission Reminder Days */}
            <TextField
              label="Submission Reminder Days"
              select
              fullWidth
              sx={{ mb: 3 }}
              value={promptSubmissionReminderDays}
              onChange={(e) => setPromptSubmissionReminderDays(Number(e.target.value))}
              required
            >
              {PROMPT_SUBMISSION_REMINDER_DAYS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            {/* Standard Working Hours */}
            <TextField
              label="Standard Working Hours (per day)"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={standardWorkingHours}
              onChange={(e) => setStandardWorkingHours(Number(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              required
            />

            {/* 給与倍率設定セクション */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: "bold" }}>
              Pay Multipliers
            </Typography>
            
            <TextField
              label="Overtime Pay Multiplier"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={overtimePayMultiplier}
              onChange={(e) => setOvertimePayMultiplier(Number(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="e.g., 1.25 for 125%"
            />
            
            <TextField
              label="Holiday Pay Multiplier"
              type="number"
              fullWidth
              sx={{ mb: 3 }}
              value={holidayPayMultiplier}
              onChange={(e) => setHolidayPayMultiplier(Number(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="e.g., 1.5 for 150%"
            />

            {/* 夜勤設定セクション */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: "bold" }}>
              Night Shift Settings
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Night Shift From (hour)"
                type="number"
                fullWidth
                value={nightShiftHoursFrom}
                onChange={(e) => setNightShiftHoursFrom(e.target.value === "" ? "" : (e.target.value))}
                inputProps={{ min: 0, max: 23, step: 1 }}
                placeholder="e.g., 22"
              />
              
              <TextField
                label="Night Shift To (hour)"
                type="number"
                fullWidth
                value={nightShiftHoursTo}
                onChange={(e) => setNightShiftHoursTo(e.target.value === "" ? "" : (e.target.value))}
                inputProps={{ min: 0, max: 23, step: 1 }}
                placeholder="e.g., 6"
              />
            </Box>
            
            <TextField
              label="Night Shift Pay Multiplier"
              type="number"
              fullWidth
              sx={{ mb: 3 }}
              value={nightShiftPayMultiplier}
              onChange={(e) => setNightShiftPayMultiplier(Number(e.target.value))}
              inputProps={{ min: 0, step: 0.1 }}
              placeholder="e.g., 1.25 for 125%"
            />

            {/* 送信ボタン */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              UPDATE
            </Button>
          </form>
        </Paper>
      </Section>
    </Box>
  );
};

export default SettingManagement;
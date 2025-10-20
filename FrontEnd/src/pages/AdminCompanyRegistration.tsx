import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NotificationAlert from "../components/NotificationAlert";
import NavigationButton from '../components/NavigationButton';
import { useNotification } from "../hooks/useNotification";
import { useNavigate, useSearchParams } from "react-router-dom";
import { genders } from "../constants/genders";
import { CLOSING_DATE } from "../constants/closingDate";
import { PAYROLL_ROUNDING_INTERVAL } from "../constants/payrollRoundingInterval";
import { PROMPT_SUBMISSION_REMINDER_DAYS } from "../constants/promptSubmissionReminderDays";
import { validateCompanyRegistration } from "../utils/companyRegistrationValidation";

const AdminCompanyRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("company_id");
  const pageTitle = companyId ? "Company Modification" : "Company Registration";
  const { notification, showNotification, clearNotification } = useNotification();
  
  // Company information state
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState(1);
  const [closingDate, setClosingDate] = useState(30);
  const [payrollRoundingInterval, setPayrollRoundingInterval] = useState(1);
  const [promptSubmissionReminderDays, setPromptSubmissionReminderDays] = useState(3);
  const [standardWorkingHours, setStandardWorkingHours] = useState(8);
  const [overtimePayMultiplier, setOvertimePayMultiplier] = useState(1.25);
  const [nightShiftHoursFrom, setNightShiftHoursFrom] = useState("22:00");
  const [nightShiftHoursTo, setNightShiftHoursTo] = useState("06:00");
  const [nightShiftPayMultiplier, setNightShiftPayMultiplier] = useState(1.35);
  const [holidayPayMultiplier, setHolidayPayMultiplier] = useState(1.5);

  // Initial user information state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userHireDate, setUserHireDate] = useState(new Date().toISOString().split('T')[0]);
  const [userRetireDate, setUserRetireDate] = useState("");

  const [loading, setLoading] = useState(true);

  // 会社情報取得（modify時）
  useEffect(() => {
    if (companyId) {
      const fetchCompany = async () => {
        setLoading(true);
        clearNotification();
        try {
          // CSRFトークンを取得
          await fetch(`${process.env.REACT_APP_BASE_URL}sanctum/csrf-cookie`, {
            credentials: "include",
          });

          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}api/get_company/${companyId}`,
            {
              credentials: "include",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            }
          );
          
          if (res.ok) {
            const data = await res.json();
            setCompanyName(data.name);
            setAddress(data.address);
            setPhoneNumber(data.phone_number);
            setEmail(data.email);
            setCurrency(data.currency);
            setClosingDate(data.closing_date);
            setPayrollRoundingInterval(data.payroll_rounding_interval);
            setPromptSubmissionReminderDays(data.prompt_submission_reminder_days);
            setStandardWorkingHours(data.standard_working_hours);
            setOvertimePayMultiplier(data.overtime_pay_multiplier);
            setNightShiftHoursFrom(data.night_shift_hours_from || "22:00");
            setNightShiftHoursTo(data.night_shift_hours_to || "06:00");
            setNightShiftPayMultiplier(data.night_shift_pay_multiplier);
            setHolidayPayMultiplier(data.holiday_pay_multiplier);
          } else {
            showNotification("Failed to retrieve the company information.", 'error');
          }
        } catch (err) {
          showNotification("Something went wrong while fetching the company data. Please try again later.", 'error');
        } finally {
          setLoading(false);
        }
      };

      fetchCompany();
    } else {
      setLoading(false);
    }
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();

    // Debug log for validation
    console.log("Validation inputs:", {
      companyName,
      address,
      phoneNumber,
      email,
      userEmail,
      userPassword: userPassword ? "[HIDDEN]" : "EMPTY",
      userPasswordConfirmation: userPasswordConfirmation ? "[HIDDEN]" : "EMPTY",
      userFirstName,
      userLastName,
    });

    // バリデーション
    if (companyId) {
      // 編集時のバリデーション（会社情報のみ）
      if (!companyName || !address || !phoneNumber || !email) {
        showNotification("Please fill in all required company fields.", 'error');
        setLoading(false);
        return;
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid company email address.", 'error');
        setLoading(false);
        return;
      }
    } else {
      // 新規作成時のバリデーション
      const validation = validateCompanyRegistration({
        companyName,
        address,
        phoneNumber,
        email,
        userEmail,
        userPassword,
        userPasswordConfirmation,
        userFirstName,
        userLastName,
      });

      if (validation) {
        showNotification(validation, 'error');
        setLoading(false);
        return;
      }
    }

    try {
      if (companyId) {
        // UPDATE MODE - 会社情報のみ更新
        const companyData = {
          name: companyName,
          address,
          phone_number: phoneNumber,
          email,
          currency,
          closing_date: closingDate,
          payroll_rounding_interval: payrollRoundingInterval,
          prompt_submission_reminder_days: promptSubmissionReminderDays,
          standard_working_hours: standardWorkingHours,
          overtime_pay_multiplier: overtimePayMultiplier,
          night_shift_hours_from: nightShiftHoursFrom,
          night_shift_hours_to: nightShiftHoursTo,
          night_shift_pay_multiplier: nightShiftPayMultiplier,
          holiday_pay_multiplier: holidayPayMultiplier,
        };

        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/update_company/${companyId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(companyData),
          }
        );

        if (res.ok) {
          showNotification("Company updated successfully!", 'success');
        } else {
          const data = await res.json();
          const errorMessages = Object.values(data.errors || {})
            .flat()
            .join("\n");
          showNotification(errorMessages || "An error occurred while updating the company.", 'error');
        }
      } else {
        // CREATE MODE - 会社と初期ユーザーを作成
        const companyData = {
          name: companyName,
          address,
          phone_number: phoneNumber,
          email,
          currency,
          closing_date: closingDate,
          payroll_rounding_interval: payrollRoundingInterval,
          prompt_submission_reminder_days: promptSubmissionReminderDays,
          standard_working_hours: standardWorkingHours,
          overtime_pay_multiplier: overtimePayMultiplier,
          night_shift_hours_from: nightShiftHoursFrom,
          night_shift_hours_to: nightShiftHoursTo,
          night_shift_pay_multiplier: nightShiftPayMultiplier,
          holiday_pay_multiplier: holidayPayMultiplier,
          user_email: userEmail,
          user_password: userPassword,
          user_password_confirmation: userPasswordConfirmation,
          user_first_name: userFirstName,
          user_last_name: userLastName,
          user_phone: userPhone,
          user_gender: userGender,
          user_birth_date: userBirthDate,
          user_address: userAddress,
          user_hire_date: userHireDate,
          user_retire_date: userRetireDate,
        };

        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/register_company`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(companyData),
          }
        );

        if (res.ok) {
          showNotification("Company and initial user registered successfully!", 'success');
        } else {
          const data = await res.json();
          const errorMessages = Object.values(data.errors || {})
            .flat()
            .join("\n");
          showNotification(errorMessages || "An error occurred while processing your request.", 'error');
        }
      }
    } catch (err) {
      showNotification("An error occurred while processing your request.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Title */}
      <PageTitle title={pageTitle} />

      {/* Notification Alert */}
      <NotificationAlert notification={notification} />

      {/* Loading spinner when loading */}
      <LoadingSpinner loading={loading} />

      <Section>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/admin/company_management"
            sx={{ minWidth: 180 }}
          >
            COMPANY MANAGEMENT
          </NavigationButton>
        </Box>
      </Section>

      <Section>
        <Paper
          sx={{
            p: 4,
            maxWidth: 800,
            mx: "auto",
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Company Basic Information */}
              <Grid item xs={12}>
                <h3>Company Basic Information</h3>
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                fullWidth
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                  label="Email Address"
                  type="email"
                fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              </Grid>
            
              <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
                  required
            />
              </Grid>
            
              <Grid item xs={12} sm={6}>
            <TextField
                  label="Phone Number"
              fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                value={currency}
                onChange={(e) => setCurrency(Number(e.target.value))}
                    label="Currency"
                  >
                    <MenuItem value={1}>JPY</MenuItem>
                    <MenuItem value={2}>USD</MenuItem>
                    <MenuItem value={3}>EUR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Payroll Settings */}
              <Grid item xs={12}>
                <h3>Payroll Settings</h3>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Closing Date"
                  select
                  fullWidth
                  value={closingDate}
                  onChange={(e) => setClosingDate(Number(e.target.value))}
                  required
                >
                  {CLOSING_DATE.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Payroll Rounding Interval"
                  select
                  fullWidth
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
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prompt Submission Reminder Days"
                  select
                  fullWidth
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
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                label="Standard Working Hours"
                type="number"
                fullWidth
                value={standardWorkingHours}
                onChange={(e) => setStandardWorkingHours(Number(e.target.value))}
                  inputProps={{ min: 1 }}
                  required
              />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                label="Overtime Pay Multiplier"
                type="number"
                fullWidth
                value={overtimePayMultiplier}
                onChange={(e) => setOvertimePayMultiplier(Number(e.target.value))}
                  inputProps={{ min: 0, step: 0.01 }}
              />
              </Grid>

              <Grid item xs={12} sm={6}>
              <TextField
                  label="Night Shift Start Time"
                type="time"
                fullWidth
                value={nightShiftHoursFrom}
                onChange={(e) => setNightShiftHoursFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                  label="Night Shift End Time"
                type="time"
                fullWidth
                value={nightShiftHoursTo}
                onChange={(e) => setNightShiftHoursTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              </Grid>

              <Grid item xs={12} sm={6}>
              <TextField
                label="Night Shift Pay Multiplier"
                type="number"
                fullWidth
                value={nightShiftPayMultiplier}
                onChange={(e) => setNightShiftPayMultiplier(Number(e.target.value))}
                  inputProps={{ min: 0, step: 0.01 }}
              />
              </Grid>
              
              <Grid item xs={12} sm={6}>
              <TextField
                label="Holiday Pay Multiplier"
                type="number"
                fullWidth
                value={holidayPayMultiplier}
                onChange={(e) => setHolidayPayMultiplier(Number(e.target.value))}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>


              {/* Initial User Information - 新規作成時のみ表示 */}
              {!companyId && (
                <>
                  <Grid item xs={12}>
                    <h3>Initial User Information</h3>
                  </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={userFirstName}
                  onChange={(e) => setUserFirstName(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                  required
                />
              </Grid>
                            
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  select
                  fullWidth
                  value={userGender}
                  onChange={(e) => setUserGender(e.target.value)}
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Birth Date"
                  type="date"
                  fullWidth
                  value={userBirthDate}
                  onChange={(e) => setUserBirthDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  fullWidth
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hire Date"
                  type="date"
                  fullWidth
                  value={userHireDate}
                  onChange={(e) => setUserHireDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Retire Date"
                  type="date"
                  fullWidth
                  value={userRetireDate}
                  onChange={(e) => setUserRetireDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={userPasswordConfirmation}
                  onChange={(e) => setUserPasswordConfirmation(e.target.value)}
                  required
                />
              </Grid>
                </>
              )}

              <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
                  sx={{ py: 1.5, mt: 2 }}
            >
                  {loading 
                    ? (companyId ? "Updating..." : "Registering...") 
                    : (companyId ? "Update" : "Register")
                  }
            </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Section>
    </Box>
  );
};

export default AdminCompanyRegistration;
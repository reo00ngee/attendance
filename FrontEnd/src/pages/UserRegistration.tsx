import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NotificationAlert from "../components/NotificationAlert";
import NavigationButton from '../components/NavigationButton';
import { useNotification } from "../hooks/useNotification";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSearchParams, Navigate } from "react-router-dom";
import { genders } from "../constants/genders";
import { ROLES } from "../constants/roles";
import { HourlyWageGroup } from "../types/HourlyWageGroup";
import { validateUserRegistration } from "../utils/userValidation";
import { hasRole } from '../utils/auth';

const UserRegistration = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const pageTitle = userId ? "User Modification" : "User Registration";
  const { notification, showNotification, clearNotification } = useNotification();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [retireDate, setRetireDate] = useState("");
  const [wageGroup, setWageGroup] = useState<number | "">("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wageGroups, setWageGroups] = useState<HourlyWageGroup[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // 労働時間帯取得
  useEffect(() => {
    const fetchWageGroups = async () => {
      setLoading(true);
      clearNotification();
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_hourly_wage_groups_by_company_id`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setWageGroups(data);
        } else {
          showNotification("Failed to retrieve the hourly wage group list.", 'error');
        }
      } catch (err) {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchWageGroups();
  }, []);

  // ユーザー情報取得（modify時）
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        clearNotification();
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}api/get_user?user_id=${userId}`,
            {
              method: "GET",
              mode: "cors",
              credentials: "include",
            }
          );
          if (res.ok) {
            const data = await res.json();
            setFirstName(data.first_name || "");
            setLastName(data.last_name || "");
            setEmail(data.email || "");
            setPhone(data.phone || "");
            setGender(data.gender || "");
            setBirthDate(data.birth_date ? data.birth_date.split("T")[0] : "");
            setAddress(data.address || "");
            setHireDate(data.hire_date ? data.hire_date.split("T")[0] : "");
            setRetireDate(data.retire_date ? data.retire_date.split("T")[0] : "");
            setWageGroup(data.hourly_wage_group_id || "");
            setSelectedRoles(data.roles || []);
          } else {
            showNotification("Failed to fetch user info. Please try again later.", 'error');
          }
        } catch {
          showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();

    // パスワード一致チェック（パスワードが入力されている場合のみ）
    if ((password || confirm) && password !== confirm) {
      showNotification("Passwords do not match.", 'warning');
      setLoading(false);
      return;
    }

    const validationError = validateUserRegistration({
      firstName,
      lastName,
      email,
      password,
      confirm,
      wageGroup,
      selectedRoles,
      gender,
      phone,
      address,
      hireDate,
      retireDate,
      userId,
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
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        gender,
        birth_date: birthDate,
        address,
        hire_date: hireDate,
        retire_date: retireDate,
        hourly_wage_group_id: wageGroup,
        roles: selectedRoles,
      };

      if (userId) {
        // MODIFY
        url = `${process.env.REACT_APP_BASE_URL}api/update_user`;
        method = "POST";
        body.user_id = userId;
        if (password) {
          body.password = password;
        }
      } else {
        // REGISTER
        url = `${process.env.REACT_APP_BASE_URL}api/store_user`;
        method = "POST";
        body.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showNotification(
          userId ? "User updated successfully!" : "User created successfully!", 'success'
        );
        if (!userId) {
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setGender("");
          setBirthDate("");
          setAddress("");
          setHireDate("");
          setWageGroup("");
          setPassword("");
          setConfirm("");
          setSelectedRoles([]);
        }
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

  if (!hasRole(3)) {
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/user_management"
            sx={{ minWidth: 180 }}
          >
            USER MANAGEMENT
          </NavigationButton>
        </Box>
      </Section>

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
            <TextField
              label="First Name"
              fullWidth
              sx={{ mb: 2 }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              fullWidth
              sx={{ mb: 2 }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              sx={{ mb: 2 }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              label="Gender"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Birth Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Address"
              fullWidth
              sx={{ mb: 2 }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="Hire Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Retire Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              value={retireDate}
              onChange={(e) => setRetireDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hourly Wage Group"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={wageGroup}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected wage group:", value);
                setWageGroup(value === "" ? "" : Number(value));
              }}
              required
            >
              {wageGroups.map((option) => (
                <MenuItem
                  key={option.hourly_wage_group_id}
                  value={option.hourly_wage_group_id}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Roles"
              select
              SelectProps={{
                multiple: true,
                value: selectedRoles,
                onChange: (e) => {
                  const value = e.target.value;
                  setSelectedRoles(Array.isArray(value) ? value : [value]);
                },
              }}
              fullWidth
              sx={{ mb: 2 }}
              required
            >
              {ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={userId ? "New Password (optional)" : "Password"}
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!userId}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder={
                userId ? "Leave blank to keep current password" : ""
              }
            />
            <TextField
              label={userId ? "Confirm New Password" : "Confirm Password"}
              type={showConfirm ? "text" : "password"}
              fullWidth
              sx={{ mb: 2 }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required={!userId}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirm((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder={
                userId ? "Leave blank to keep current password" : ""
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {userId ? "Update" : "Register"}
            </Button>
          </form>
        </Paper>
      </Section>
    </Box>
  );
};

export default UserRegistration;
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
import { useSearchParams, useNavigate } from "react-router-dom";
import { genders } from "../constants/genders";
import { ROLES } from "../constants/roles";
import { HourlyWageGroup } from "../types/HourlyWageGroup";
import { validateUserRegistration } from "../utils/userValidation";

const AdminUserRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
          `${process.env.REACT_APP_BASE_URL}api/hourly_wage_groups`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setWageGroups(data);
        } else {
          showNotification("Failed to retrieve the hourly wage group list.", 'error');
        }
      } catch {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchWageGroups();
  }, []);

  // 編集時は既存データを取得
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        setLoading(true);
        clearNotification();
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}api/get_user_for_management/${userId}`,
            { credentials: "include" }
          );
          if (res.ok) {
            const data = await res.json();
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPhone(data.phone);
            setGender(data.gender);
            setBirthDate(data.birth_date);
            setAddress(data.address);
            setHireDate(data.hire_date);
            setRetireDate(data.retire_date);
            setWageGroup(data.wage_group_id);
            setSelectedRoles(data.roles);
          } else {
            showNotification("Failed to retrieve the user information.", 'error');
          }
        } catch {
          showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    const validation = validateUserRegistration({
      firstName,
      lastName,
      email,
      phone,
      gender,
      address,
      hireDate,
      retireDate,
      wageGroup,
      password,
      confirm,
      selectedRoles,
    });

    if (validation) {
      showNotification(validation, 'error');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        gender,
        birth_date: birthDate,
        address,
        hire_date: hireDate,
        retire_date: retireDate,
        wage_group_id: wageGroup,
        password,
        password_confirmation: confirm,
        roles: selectedRoles,
      };

      if (userId) {
        // 編集
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/update_user/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
          }
        );

        if (res.ok) {
          showNotification("User updated successfully!", 'success');
          navigate("/admin/user_management");
        } else {
          const data = await res.json();
          const errorMessages = Object.values(data.errors)
            .flat()
            .join("\n");
          showNotification(errorMessages || "An error occurred while processing your request.", 'error');
        }
      } else {
        // 新規作成
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/register_user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(userData),
          }
        );

        if (res.ok) {
          showNotification("User registered successfully!", 'success');
          navigate("/admin/user_management");
        } else {
          const data = await res.json();
          const errorMessages = Object.values(data.errors)
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
            to="/admin/user_management"
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
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Retire Date"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              value={retireDate}
              onChange={(e) => setRetireDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Wage Group"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={wageGroup}
              onChange={(e) => setWageGroup(Number(e.target.value))}
            >
              {wageGroups.map((group) => (
                <MenuItem key={group.hourly_wage_group_id} value={group.hourly_wage_group_id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Roles"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(Array.isArray(e.target.value) ? e.target.value : [])}
              SelectProps={{
                multiple: true,
              }}
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
            />
            <TextField
              label={userId ? "Confirm New Password" : "Confirm Password"}
              type={showConfirm ? "text" : "password"}
              fullWidth
              sx={{ mb: 3 }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required={!userId}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password confirmation visibility"
                      onClick={() => setShowConfirm((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? (userId ? "Updating..." : "Registering...") : (userId ? "Update User" : "Register User")}
            </Button>
          </form>
        </Paper>
      </Section>
    </Box>
  );
};

export default AdminUserRegistration;

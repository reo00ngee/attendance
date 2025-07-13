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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSearchParams } from "react-router-dom";
import { genders } from "../constants/genders";
import { roles } from "../constants/roles";
import { HourlyWageGroup } from "../types/HourlyWageGroup";
import { SelectChangeEvent } from "@mui/material";
import { log } from "console";
import { validateUserRegistration } from "../utils/userValidation";

const UserRegistration = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const pageTitle = userId ? "User Modification" : "User Registration";

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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wageGroups, setWageGroups] = useState<HourlyWageGroup[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // 労働時間帯取得
  useEffect(() => {
    const fetchWageGroups = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_hourly_wage_group_by_company_id`,
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setWageGroups(data);
        }
      } catch (err) {
        setError("Failed to fetch wage groups.");
      }
    };
    fetchWageGroups();
  }, []);

  // ユーザー情報取得（modify時）
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
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
            setBirthDate(data.birth_date || "");
            setAddress(data.address || "");
            setHireDate(data.hire_date || "");
            setWageGroup(data.hourly_wage_group_id || "");
            setSelectedRoles(data.roles || []);
            setMessage(null);
            // setError(null);
          } else {
            setError("Failed to fetch user info. Please try again later.");
          }
        } catch {
          setError("Failed to fetch user info. Please try again later.");
        }
      };
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

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
    });

    if (validationError) {
      setError(validationError);
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
          if (password !== confirm) {
            setError("Passwords do not match.");
            return;
          }
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
        setMessage(
          userId ? "User updated successfully!" : "Registration successful!"
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
  setError(errorMessages || "An error occurred while processing your request.");
      }
    } catch (err) {
      console.error("Error during user operation:", err);
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>
          {pageTitle}
        </Typography>
      </Section>
      <Section>
        <Paper sx={{ p: 4, maxWidth: 500, mx: "auto" }}>

          <form onSubmit={handleSubmit} noValidate>
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              required={!userId}
              placeholder={
                userId ? "Leave blank to keep current password" : ""
              }
            />
            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              fullWidth
              sx={{ mb: 2 }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
              required={!userId}
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
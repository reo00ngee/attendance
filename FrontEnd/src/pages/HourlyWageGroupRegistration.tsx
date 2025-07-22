import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Section from "../components/Section";
import { Navigate, useSearchParams } from "react-router-dom";
import { hasRole } from "../utils/auth";
import { validateHourlyWageGroupRegistration } from "../utils/hourlyWageGroupValidation";

const HourlyWageGroupRegistration = () => {
  const [searchParams] = useSearchParams();
  const hourlyWageGroupId = searchParams.get("hourly_wage_group_id");
  const pageTitle = hourlyWageGroupId ? "Hourly Wage Group Modification" : "Hourly Wage Group Registration";
  const [name, setName] = useState("");
  const [hourlyWage, setHourlyWage] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hourlyWageGroupId) {
      // 編集時は既存データを取得
      const fetchGroup = async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}api/get_hourly_wage_group?hourly_wage_group_id=${hourlyWageGroupId}`,
            { credentials: "include" }
          );
          if (res.ok) {
            const data = await res.json();
            setName(data.name ?? "");
            setHourlyWage(data.hourly_wage?.toString() ?? "");
            setComment(data.comment ?? "");
          } else {
            setError("Failed to fetch hourly wage group info. Please try again later.");
          }
        } catch {
          setError("Failed to fetch hourly wage group info. Please try again later.");
        }
      };
      fetchGroup();
    }
  }, [hourlyWageGroupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validateHourlyWageGroupRegistration({
      name,
      hourlyWage: hourlyWage === "" ? 0 : hourlyWage,
      comment,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let url = "";
      let method = "";
      let body: any = {
        name,
        hourly_wage: hourlyWage,
        comment,
      };

      if (hourlyWageGroupId) {
        url = `${process.env.REACT_APP_BASE_URL}api/update_hourly_wage_group`;
        method = "POST";
        body.hourly_wage_group_id = hourlyWageGroupId;
      } else {
        url = `${process.env.REACT_APP_BASE_URL}api/store_hourly_wage_group`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage(hourlyWageGroupId ? "Hourly Wage Group updated successfully!" : "Hourly Wage Group created successfully!");
        if (!hourlyWageGroupId) {
          setName("");
          setHourlyWage("");
          setComment("");
        }
      } else {
        const data = await res.json();
        const errorMessages = Object.values(data.errors)
          .flat()
          .join("\n");
        setError(errorMessages || "An error occurred while processing your request.");
      }
    } catch (err) {
      console.error("Error during hourly wage group operation:", err);
      setError("An error occurred while processing your request.");
    }
  };

  if (!hasRole(3)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>
          {pageTitle}
        </Typography>
      </Section>

      <Section>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            component="a"
            href="/hourly_wage_group_management"
            sx={{ minWidth: 180 }}
          >
            HOURLY WAGE GROUP MANAGEMENT
          </Button>
        </Box>
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
              label="Name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Hourly Wage"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
            <TextField
              label="Comment"
              fullWidth
              sx={{ mb: 2 }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {hourlyWageGroupId ? "Update" : "Register"}
            </Button>
          </form>
        </Paper>
      </Section>
    </Box>
  );
};

export default HourlyWageGroupRegistration;
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
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import { Navigate, useSearchParams } from "react-router-dom";
import { hasRole } from "../utils/auth";
import { validateHourlyWageGroupRegistration } from "../utils/hourlyWageGroupValidation";

const HourlyWageGroupRegistration = () => {
  const [searchParams] = useSearchParams();
  const hourlyWageGroupId = searchParams.get("hourly_wage_group_id");
  const pageTitle = hourlyWageGroupId ? "Hourly Wage Group Modification" : "Hourly Wage Group Registration";
  const { notification, showNotification, clearNotification } = useNotification();
  const [name, setName] = useState("");
  const [hourlyWage, setHourlyWage] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hourlyWageGroupId) {
      // 編集時は既存データを取得
      const fetchGroup = async () => {
        setLoading(true);
        clearNotification();
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
            showNotification("Failed to fetch hourly wage group info. Please try again later.", 'error');
          }
        } catch {
          showNotification("Failed to fetch hourly wage group info. Please try again later.", 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchGroup();
    }
    setLoading(false);
  }, [hourlyWageGroupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearNotification();

    const validationError = validateHourlyWageGroupRegistration({
      name,
      hourlyWage: hourlyWage === "" ? 0 : hourlyWage,
      comment,
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
        showNotification(hourlyWageGroupId ? "Hourly Wage Group updated successfully!" : "Hourly Wage Group created successfully!", 'success');
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
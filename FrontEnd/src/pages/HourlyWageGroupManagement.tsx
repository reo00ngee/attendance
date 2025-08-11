import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  TextField,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from "../components/NavigationButton";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import { HourlyWageGroup } from "@/types/HourlyWageGroup";
import { hasRole } from "../utils/auth";
import { Navigate } from "react-router-dom";


const HourlyWageGroupManagement = () => {
  const pageTitle = "Hourly Wage Group Management";
  const tableHeaders = [
    "Name",
    "Hourly Wage",
    "Comment",
    ""
  ];
  const { notification, showNotification, clearNotification } = useNotification();
  const [noHourlyWageGroups, setNoHourlyWageGroups] = useState(false);
  const [hourlyWageGroups, setHourlyWageGroups] = useState<HourlyWageGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // hourly_wageフィルター（最小値・最大値）
  const [minWage, setMinWage] = useState<string>("");
  const [maxWage, setMaxWage] = useState<string>("");

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      clearNotification();
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_hourly_wage_groups_by_company_id`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setHourlyWageGroups(data);
          setNoHourlyWageGroups(data.length === 0);
        } else {
          showNotification("Failed to retrieve the hourly wage group list.", 'error');
        }
      } catch {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // hourly_wageで範囲フィルター
  const filteredHourlyWageGroups = hourlyWageGroups.filter((group) => {
    const wage = Number(group.hourly_wage);
    const min = minWage === "" ? -Infinity : Number(minWage);
    const max = maxWage === "" ? Infinity : Number(maxWage);
    return wage >= min && wage <= max;
  });

  if (!hasRole(3)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {noHourlyWageGroups && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no hourly wage groups to display.
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />

      {/* hourly_wage範囲フィルター */}
      <Section>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Min Hourly Wage"
            type="number"
            value={minWage}
            onChange={(e) => setMinWage(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <TextField
            label="Max Hourly Wage"
            type="number"
            value={maxWage}
            onChange={(e) => setMaxWage(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/hourly_wage_group_registration"
            sx={{ minWidth: 180 }}
          >
            REGISTER
          </NavigationButton>
        </Box>
      </Section>

      {/* テーブル */}
      <Section>
        <TableContainer component={Paper} sx={{ opacity: loading ? 0.6 : 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell key={index} align="right">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHourlyWageGroups.map((group) => (
                <TableRow key={group.hourly_wage_group_id}>
                  <TableCell align="left">{group.name}</TableCell>
                  <TableCell align="right">{group.hourly_wage}</TableCell>
                  <TableCell align="right">{group.comment}</TableCell>
                  <TableCell align="right">
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/hourly_wage_group_registration?hourly_wage_group_id=${group.hourly_wage_group_id}`}
                      sx={{
                        minWidth: 120,
                        height: 40,
                        fontSize: "1rem",
                        px: 2,
                      }}
                    >
                      Modify
                    </NavigationButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Box>
  );
};

export default HourlyWageGroupManagement;
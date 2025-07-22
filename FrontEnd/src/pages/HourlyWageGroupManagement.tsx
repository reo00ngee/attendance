import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Button
} from "@mui/material";
import Section from "../components/Section";
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
  const [hourlyWageGroups, setHourlyWageGroups] = useState<HourlyWageGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // hourly_wageフィルター（最小値・最大値）
  const [minWage, setMinWage] = useState<string>("");
  const [maxWage, setMaxWage] = useState<string>("");

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_hourly_wage_groups_by_company_id`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setHourlyWageGroups(data);
        } else {
          setError("Failed to retrieve the hourly wage group list.");
        }
      } catch {
        setError("Something went wrong while fetching the data. Please try again later.");
      }
      setLoading(false);
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
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

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
          <Button
            variant="contained"
            component="a"
            href="/hourly_wage_group_registration"
            sx={{ minWidth: 180 }}
          >
            REGISTER
          </Button>
        </Box>
      </Section>

      <Section>
        <Paper sx={{ p: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer>
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
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            minWidth: 120,
                            height: 40,
                            fontSize: "1rem",
                            px: 2,
                          }}
                          component="a"
                          href={`/hourly_wage_group_registration?hourly_wage_group_id=${group.hourly_wage_group_id}`}
                        >
                          Modify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Section>
    </Box>
  );
};

export default HourlyWageGroupManagement;
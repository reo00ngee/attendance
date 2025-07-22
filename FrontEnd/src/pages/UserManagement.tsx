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
import { roles } from "../constants/roles";
import { User } from "../types/User";
import { hasRole } from "../utils/auth";
import { Navigate } from "react-router-dom";


const UserManagement = () => {
  const pageTitle = "User Management";
  const tableHeaders = [
    "Name",
    "Email",
    "Role",
    ""
  ];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィルター用state
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "">("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_users_for_management`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          setError("Failed to retrieve the user list.");
        }
      } catch {
        setError("Something went wrong while fetching the data. Please try again later.");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const getRoleLabels = (roleIds: number[]) =>
    roleIds
      .map((id) => roles.find((r) => r.value === id)?.label)
      .filter(Boolean)
      .join(", ");

  // フィルター処理
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.last_name} ${user.first_name}`.toLowerCase();
    const nameMatch = fullName.includes(nameFilter.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const roleMatch =
      roleFilter === ""
        ? true
        : user.roles.includes(Number(roleFilter));
    return nameMatch && emailMatch && roleMatch;
  });

  if (!hasRole(3)) {
    return <Navigate to="/attendance_registration_for_monthly" />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
      </Section>

      {/* フィルターUI */}
      <Section>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Search by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
          <TextField
            label="Search by Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
          <TextField
            label="Filter by Role"
            select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value === "" ? "" : Number(e.target.value))}
            size="small"
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            component="a"
            href="/user_registration"
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
            // テーブル
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header, index) => (
                      <TableCell
                        key={index}
                        align={header === "role" ? "left" : "right"}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell align="right">
                        {user.last_name} {user.first_name}
                      </TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="left">
                        {user.roles.map((roleId) => {
                          const role = roles.find((r) => r.value === roleId);
                          return (
                            <Chip
                              key={roleId}
                              label={role ? role.label : roleId}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          );
                        })}
                      </TableCell>
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
                          href={`/user_registration?user_id=${user.user_id}`}
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

export default UserManagement;
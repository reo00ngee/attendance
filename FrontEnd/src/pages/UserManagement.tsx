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
} from "@mui/material";
import Section from "../components/Section";
import { roles } from "../constants/roles";
import { User } from "../types/User";


const UserManagement = () => {
  const pageTitle = "User Management";
  const tableHeaders = [
    "name",
    "email",
    "role",
  ];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <Section>
        <Typography variant="h4" align="left" sx={{ mb: 0.5 }}>{pageTitle}</Typography>
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
                  {users.map((user) => (
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
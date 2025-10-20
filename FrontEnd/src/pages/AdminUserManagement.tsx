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
  Chip,
  Alert,
  TextField,
  MenuItem,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from "../components/NavigationButton";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";
import { ROLES } from "../constants/roles";
import { User } from "../types/User";

const AdminUserManagement = () => {
  const pageTitle = "User Management";
  const tableHeaders = [
    "Name",
    "Email",
    "Role",
    ""
  ];
  const { notification, showNotification, clearNotification } = useNotification();
  const [noUser, setNoUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // フィルター用state
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "">("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      clearNotification();
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_users_for_management`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
          setNoUser(data.length === 0);
        } else {
          showNotification("Failed to retrieve the user list.", 'error');
        }
      } catch {
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {noUser && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no users to display.
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />


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
            {ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/admin/user_registration"
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
                      const role = ROLES.find((r) => r.value === roleId);
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
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/admin/user_registration?user_id=${user.user_id}`}
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

export default AdminUserManagement;

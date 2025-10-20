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
  MenuItem,
} from "@mui/material";
import Section from "../components/Section";
import LoadingSpinner from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import NavigationButton from "../components/NavigationButton";
import NotificationAlert from "../components/NotificationAlert";
import { useNotification } from "../hooks/useNotification";

interface Company {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  currency: number;
  created_at: string;
  updated_at: string;
}

const AdminCompanyManagement = () => {
  const pageTitle = "Company Management";
  const tableHeaders = [
    "Company Name",
    "Address",
    "Phone",
    "Email",
    "Currency",
    "Actions"
  ];
  const { notification, showNotification, clearNotification } = useNotification();
  const [noCompany, setNoCompany] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // フィルター用state
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState<number | "">("");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      clearNotification();
      try {
        // CSRFトークンを取得
        await fetch(`${process.env.REACT_APP_BASE_URL}sanctum/csrf-cookie`, {
          credentials: "include",
        });

        const res = await fetch(
          `${process.env.REACT_APP_BASE_URL}api/get_companies_for_management`,
          { 
            credentials: "include",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
          setNoCompany(data.length === 0);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error('API Error:', res.status, errorData);
          showNotification(`Failed to retrieve the company list. Status: ${res.status}`, 'error');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showNotification("Something went wrong while fetching the data. Please try again later.", 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // フィルター処理
  const filteredCompanies = companies.filter((company) => {
    const nameMatch = company.name.toLowerCase().includes(nameFilter.toLowerCase());
    const emailMatch = company.email.toLowerCase().includes(emailFilter.toLowerCase());
    const currencyMatch =
      currencyFilter === ""
        ? true
        : company.currency === currencyFilter;
    return nameMatch && emailMatch && currencyMatch;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* タイトル */}
      <PageTitle title={pageTitle} />

      {/* 通知アラート */}
      <NotificationAlert notification={notification} />

      {noCompany && (
        <Section>
          <Alert severity="warning" sx={{ mb: 2 }}>
            There are no companies to display.
          </Alert>
        </Section>
      )}

      {/* loading時はローディング表示 */}
      <LoadingSpinner loading={loading} />

      {/* フィルターUI */}
      <Section>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Search by Company Name"
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
            label="Filter by Currency"
            select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value === "" ? "" : Number(e.target.value))}
            size="small"
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Currencies</MenuItem>
            <MenuItem value={1}>JPY</MenuItem>
            <MenuItem value={2}>USD</MenuItem>
            <MenuItem value={3}>EUR</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <NavigationButton
            variant="contained"
            to="/admin/company_registration"
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
                    align="right"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell align="right">{company.name}</TableCell>
                  <TableCell align="right">{company.address}</TableCell>
                  <TableCell align="right">{company.phone_number}</TableCell>
                  <TableCell align="right">{company.email}</TableCell>
                  <TableCell align="right">
                    {company.currency === 1 ? 'JPY' : 
                     company.currency === 2 ? 'USD' : 
                     company.currency === 3 ? 'EUR' : 'Unknown'}
                  </TableCell>
                  <TableCell align="right">
                    <NavigationButton
                      variant="contained"
                      size="small"
                      to={`/admin/company_registration?company_id=${company.id}`}
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

export default AdminCompanyManagement;





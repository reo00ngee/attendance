import ReactDOM from "react-dom";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import Grid from "@mui/material/Grid";

import Button from "@mui/material/Button";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useState } from "react";

const rows = [
  {
    id: 1,
    title: "勤務時間",
    startTime: "10:00",
    mark: "～",
    endTime: "18:00",
  },
  {
    id: 2,
    title: "休憩時間",
    startTime: "11:00",
    mark: "～",
    endTime: "11:30",
  },
  {
    id: 3,
    title: "休憩時間",
    startTime: "12:00",
    mark: "～",
    endTime: "13:00",
  },
];
// exportとconstの前に書くことでコンポーネントとして利用できる
export const App = () => {
  // useStateを書く
  const [startWork, setStartWork] = useState("");
  // onClickのボタンの処理を書く
  const onClickStartWork = () => {};
  // fetchでdataをとってくる
  // jsonに変換する
  // setDataで変換データをセットする

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box>2023/11/18 19:10</Box>
        </Grid>

        <Grid item xs={6}>
          <Box>UserName:YAMADA</Box>
        </Grid>

        <Grid item xs={3}>
          <Box>
            <Button variant="contained">log out</Button>
          </Box>
        </Grid>
      </Grid>

      <Grid sx={{ padding: "20px" }} container spacing={2}>
        <Grid item xs={3}>
          <Box>
            <Button variant="contained" onClick={onClickStartWork}>
              Start Work
            </Button>
          </Box>{" "}
          {/*onClickを付ける*/}
        </Grid>

        <Grid item xs={3}>
          <Box>
            <Button variant="contained">Start Break</Button>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Box>
            <Button variant="contained">End Break</Button>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Box>
            <Button size="large" variant="contained">
              Finish Work
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box>WorkingTime in Today</Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <FormControlLabel control={<Switch />} label="Modify" />

            <Button variant="contained" disabled>
              Save
            </Button>
          </Box>
        </Grid>

        <Grid item xs={3}></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>

        <Grid item xs={9}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>

                  <TableCell align="right">Start Time</TableCell>

                  <TableCell align="right"></TableCell>

                  <TableCell align="right">End Time</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>

                    <TableCell align="right">{row.startTime}</TableCell>

                    <TableCell align="right">~</TableCell>

                    <TableCell align="right">{row.endTime}</TableCell>
                  </TableRow>
                ))}
                  <TableRow>
                    <TableCell component="th" scope="row">
                    Total working hours
                    </TableCell>

                    <TableCell align="right">aaaa</TableCell>

                    <TableCell align="right">~</TableCell>

                    <TableCell align="right">bbb</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                    Total break time
                    </TableCell>

                    <TableCell align="right">aaaa</TableCell>

                    <TableCell align="right">~</TableCell>

                    <TableCell align="right">bbb</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </Box>
  );
};
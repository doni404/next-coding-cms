// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import reservation, { fetchData } from "src/store/apps/reservation";

// ** Custom Components Imports
import TableHeader from "src/views/reservation/list/TableHeader";

// ** Third Party Components
import moment from "moment";
import toast from "react-hot-toast";

import { useRouter } from "next/router";
import { ConsoleNetworkOutline } from "mdi-material-ui";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const useStyles = styled({
  table: {
    minWidth: 650,
  },
  sticky: {
    position: "sticky",
    left: 0,
    background: "white",
    boxShadow: "5px 2px 5px grey",
    borderRight: "2px solid black",
    color: "red",
  },
  stickyHeader: {
    position: "sticky",
    left: 0,
    background: "white",
    boxShadow: "5px 2px 5px grey",
    borderRight: "2px solid black",
    zIndex: "9999",
    color: "red",
  },
});

const TableCellStyled = styled(TableCell)(() => ({
  border: "1px solid #ddd",
  textAlign: "center",
  height: "70px"
}));

const TableCellHeadStyled = styled(TableCell)(() => ({
  position: "relative",
  border: "1px solid #ddd",
  textAlign: "center",
  "::after": {
    content: "''",
    borderRight: "1px solid #ddd",
    position: "absolute",
    right: "-1px",
    height: "100%",
    top: "0",
  },
}));

export const GetTableCell = (reservations) => {
  const result = reservations.reservations.find((item) => {
    // console.log("time moment : ", moment(item.reservation_date).format("HH"))
    // console.log("list time : ", time.value)
    return (
      moment(item.reservation_date).format("HH") === reservations.time.value
    );
  });

  // const [res, setRes] = useState();

  if (result !== undefined) {
    if (result.situation !== "opened") {
      console.log(result.student.name_en);
    }
  }
  // console.log("result : ", res);

  if (result !== undefined) {
    if (result.situation === "opened") {
      return <TableCellStyled align="right" sx={{fontWeight: "700!important", fontSize: "13px"}}>OPEN</TableCellStyled>;
    } else {
      return (
        <TableCellStyled
          align="right"
          sx={{ textAlign: "left", padding: "8px!important" }}
        >
          <img
            width={20}
            style={{ verticalAlign: "middle" }}
            src="/images/skype.png"
            alt="swiper 26"
          />
          ({result.student.id})
          <span style={{ fontSize: "13px", display: "block", lineHeight: "normal" }}>
            {result.student.name}
          </span>
        </TableCellStyled>
      );
    }
  } else {
    return (
      <TableCellStyled align="right" sx={{ textAlign: "left", padding: "8px!important" }}></TableCellStyled>
    );
  }
};

const UserList = () => {
  // ** State
  const format = "MMMM Do YYYY, h:mm:ss a";
  const [value, setValue] = useState(moment(new Date(), format));
  const [date, setDate] = useState(new Date());
  const [list, setList] = useState([]);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.reservation);
  console.log("store : ", store);

  const listTime = [
    { clock: "00:00", value: "00" },
    { clock: "01:00", value: "01" },
    { clock: "02:00", value: "02" },
    { clock: "03:00", value: "03" },
    { clock: "04:00", value: "04" },
    { clock: "05:00", value: "05" },
    { clock: "06:00", value: "06" },
    { clock: "07:00", value: "07" },
    { clock: "08:00", value: "08" },
    { clock: "09:00", value: "09" },
    { clock: "10:00", value: "10" },
    { clock: "11:00", value: "11" },
    { clock: "12:00", value: "12" },
    { clock: "13:00", value: "13" },
    { clock: "14:00", value: "14" },
    { clock: "15:00", value: "15" },
    { clock: "16:00", value: "16" },
    { clock: "17:00", value: "17" },
    { clock: "18:00", value: "18" },
    { clock: "19:00", value: "19" },
    { clock: "20:00", value: "20" },
    { clock: "21:00", value: "21" },
    { clock: "22:00", value: "22" },
    { clock: "23:00", value: "23" },
  ];

  const router = useRouter();
  useEffect(() => {
    console.log("date : ", moment(value).format("YYYY-MM-DD"));
    dispatch(fetchData(moment(value).format("YYYY-MM-DD")))
      .unwrap()
      .then((originalPromiseResult) => {
        // handle result here
        setList(originalPromiseResult.data);
        console.log("promise result : ", list);
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected : ", rejected.toString())
      });
  }, [dispatch, value]);

  const handleFilter = useCallback((val) => {
    setValue(moment(val, format));
    // setDate(moment(val).format("YYYY-MM-DD"));
  }, []);

  const add = useCallback((val) => {
    setValue(moment(val, format).add(1, "days"));
  }, []);

  const substract = useCallback((val) => {
    setValue(moment(val, format).subtract(1, "days"));
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">予約管理一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            add={add}
            substract={substract}
            sx={{ border: "1px solid #ddd" }}
          />
          <TableContainer style={{ margin: "1.25rem", width: "auto" }}>
            <Table
              stickyHeader
              sx={{ minWidth: 1256 }}
              aria-label="simple table"
              style={{
                tableLayout: "fixed",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
            >
              <TableHead
                sx={{
                  border: "1px solid #ddd",
                  borderBottom: "1.5px solid #A9A9A9",
                }}
              >
                <TableRow>
                  <TableCellHeadStyled
                    sx={{
                      width: 115,
                      position: "sticky",
                      left: 0,
                      zIndex: "99",
                      fontWeight: "700!important",
                      height: "56px",
                      padding: "8px 16px",
                      fontSize: "14px!important",
                    }}
                  >
                    先生名
                  </TableCellHeadStyled>
                  {listTime.map((rowHeader, rowHeaderIndex) => (
                    <TableCellStyled
                      sx={{
                        width: 120,
                        fontWeight: "700!important",
                        height: "56px",
                        padding: "8px 16px",
                        fontSize: "14px!important",
                      }}
                      key={rowHeaderIndex}
                      align="right"
                    >
                      {rowHeader.clock}
                    </TableCellStyled>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCellHeadStyled
                      sx={{
                        position: "sticky",
                        left: 0,
                        background: "white",
                        zIndex: "98",
                        fontWeight: "700!important",
                        padding: "8px!important",
                      }}
                      component="th"
                      scope="row"
                    >
                      {row.name}
                    </TableCellHeadStyled>
                    {listTime.map((time, index) => (
                      <GetTableCell
                        reservations={row.reservations}
                        time={time}
                      />
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserList;

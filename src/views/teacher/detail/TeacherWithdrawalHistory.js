// ** React Imports
import { useState, useEffect } from "react";
import React from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";

import axios from "axios";

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

const seperatorYen = (yen) => {
  return (new Intl.NumberFormat('ja-JP').format(yen));
}

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const ImgAbsolute = styled("img")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const columns = [
  {
    flex: 0.05,
    minWidth: 60,
    field: "id",
    headerName: "id",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" alignCenter>
          {row.id}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "bank_name",
    minWidth: 150,
    headerName: "銀行名",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.bank_name}</Typography>;
    },
  },
  {
    flex: 0.15,
    field: "account_number",
    minWidth: 150,
    headerName: "口座番号",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.account_number}</Typography>;
    },
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: "amount",
    headerName: "金額",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          ¥{seperatorYen(row.amount)}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "account_name",
    minWidth: 150,
    headerName: "口座名",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.account_name}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "situation",
    headerName: "状態",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.situation === "complete" ? "完了" : row.situation === "pending" ? "保留中" : row.situation === "failed" ? "失敗" : "キャンセルされた"}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 200,
    headerName: "登録日",
    field: "created_at",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TeacherWithdrawalHistoryList = ({ data }) => {

  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const token = window.sessionStorage.getItem("token");
  const [store, setStore] = useState();

  useEffect(() => {
  var axios = require("axios");
  var config = {
    method: "get",
    url: BASE_URL_API + "v1/cms/teacher-withdrawals/teachers/" + dataResponse.id,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  // console.log("config url", config.url);

  axios(config)
    .then(function (response) {
      setStore(response.data.data)
      // setLength(response.data.data.length);
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  console.log("withdrawal History List : ", store);
  if (store) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">月別支払一覧</Typography>
            </Box>
            <DataGrid
              localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
              className="tableWithImage"
              rowHeight={90}
              autoHeight
              rows={store}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 50, 100]}
              sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              alignCenter
            />
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">レッスン履歴一覧</Typography>
            </Box>
            <Box sx={{ p: 5, pb: 1, mb: 20 }}>
              <Typography variant="body1">
                レッスン履歴の登録はありません
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  }
};

export default TeacherWithdrawalHistoryList;

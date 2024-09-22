// ** React Imports
import { useState, useEffect } from "react";
import React from "react";

// ** Next Import
import Link from "next/link";

// **import helpers */
import { useRowSelection } from 'src/helper/useRowSelection';

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

const separatorComa = (number) => {
  return new Intl.NumberFormat('ja-JP').format(number);
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
    flex: 0.2,
    minWidth: 250,
    field: "zoom_url",
    headerName: "ZoomのURL",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.zoom_url}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 190,
    headerName: "予約日時",
    field: "reservation_date",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.reservation_date}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "point",
    maxWidth: 110,
    headerName: "ポイント",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{separatorComa(row.point)}</Typography>;
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
      const today = new Date();
      // console.log("today : ", today);
      return <Typography variant="body2" sx={{ 
        color: new Date(row?.reservation_date) < today && row?.situation === "reserved" ? "black" : new Date(row?.reservation_date) > today && row?.situation === "reserved" ? "blue" : row?.situation === "cancelled_student" ? "red" : "red" 
      }}> { row?.situation } </Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 190,
    headerName: "登録日",
    field: "created_at",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.created_at}
        </Typography>
      );
    },
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const StudentVideosList = ({ data }) => {
  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const token = window.sessionStorage.getItem("token");
  const [store, setStore] = useState();
  const { selectedRows, handleRowClick } = useRowSelection();

  useEffect(() => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: BASE_URL_API + "v1/cms/reservations/students/" + dataResponse.id + "?situation=reserved,student_request_approved,course_finished",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    console.log("config url", config.url);

    axios(config)
      .then(function (response) {
        setStore(response.data.data)
        setLength(response.data.data.length);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  console.log("store exe : ", store);

  if (store) {
    const rows = store.map((row) => {
      const today = new Date();
      return {
        ...row,
        situation: (row?.situation === "teacher_opened" ? "講師が開" :
        row?.situation === "student_requested" ? "生徒からのリクエスト" :
        row?.situation === "student_request_approved" ? "生徒のリクエスト承認" :
        row?.situation === "student_request_rejected" ? "生徒のリクエスト拒否" :
        (row?.situation === "reserved" && new Date(row?.reservation_date)  < today) ? "レッスン消化" : 
        (row?.situation === "reserved" && new Date(row?.reservation_date)  > today) ? "レッスン_履行待ち" : 
        row?.situation === "cancelled_student" ? "生徒キャンセル" :
        row?.situation === "cancelled_teacher" ? "講師によるキャンセル" :
        row?.situation === "cancelled_admin" ? "管理者によるキャンセル" :
        row?.situation === "course_started" ? "コース開始" :
        row?.situation === "course_finished" ? "コース終了" : "管理キャンセル")
      }
    });
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">レッスン履歴一覧</Typography>
            </Box>
            <DataGrid
              localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
              className="tableWithImage"
              rowHeight={90}
              autoHeight
              rows={rows}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 50, 100]}
              sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 }, userSelect: 'none'  }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              alignCenter
              checkboxSelection={false}
              selectionModel={selectedRows}
              onRowClick={(params, event) => handleRowClick(params, event, rows)}
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

export default StudentVideosList;

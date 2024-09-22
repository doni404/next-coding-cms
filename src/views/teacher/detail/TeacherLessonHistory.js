// ** React Imports
import { useState, useEffect } from "react";
import React from "react";

// ** Actions Imports
import { fetchData } from "src/store/apps/teacher_lesson_history";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Next Import
import { useRouter } from "next/router";

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
          {dateFormater(row.reservation_date)}{" "}
          {timeFormater(row.reservation_date)}
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
      return <Typography variant="body2"> {
        row?.situation
      } </Typography>;
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
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TeacherLessonHistoryList = ({ data }) => {
  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  console.log("data response : ", dataResponse)
  // const token = window.sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state) => state.teacher_lesson);
  const { selectedRows, handleRowClick } = useRowSelection();

  useEffect(() => {
    dispatch(fetchData(dataResponse.id))
      .unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        if (rejected.toString().includes('403') || rejected.toString().includes('401')) {
          router.replace("/401");
        }
      }); 
  }, [dispatch]);
  console.log("store exe : ", store);

  if (store) {
    const rows = store.data.map((row) => {
      return {
        ...row,
        situation: (row?.situation === "teacher_opened" ? "予約可" :
        row?.situation === "student_requested" ? "生徒リクエスト" :
        row?.situation === "student_request_approved" ? "生徒承認済" :
        row?.situation === "student_request_rejected" ? "生徒却下済" :
        row?.situation === "reserved" ? "レッスン履行待ち" :
        row?.situation === "cancelled_student" ? "生徒キャンセル" :
        row?.situation === "cancelled_teacher" ? "講師キャンセル" :
        row?.situation === "cancelled_admin" ? "管理キャンセル" :
        row?.situation === "course_started" ? "レッスン中" :
        row?.situation === "course_finished" ? "レッスン消化 " :
        row?.situation)
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

export default TeacherLessonHistoryList;

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

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
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
    minWidth: 120,
    field: "ip_address",
    headerName: "IPアドレス",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.ip_address}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "platform",
    minWidth: 120,
    headerName: "プラットホーム",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.platform}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "browser",
    headerName: "ブラウザ",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.browser}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "country",
    headerName: "国",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.country}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 200,
    headerName: "登録日時",
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

const TeacherLoginLogs = ({data}) => {
  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const token = window.sessionStorage.getItem("token");
  const [store, setStore] = useState();

useEffect(() => {
  const endpoint = BASE_URL_API + "v1/cms/teacher-login-logs/teachers/" + dataResponse.id + "?sort_by=created_at.desc";
  axiosInstance.get(endpoint, data)
    .then(function (response) {
      setStore(response.data.data)
      // setLength(response.data.data.length);
    })
    .catch(function (error) {
      console.log(error);
    });
}, []);
    
console.log("store : ", store)

// if (store) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1, mb: 5 }}>
            <Typography variant="h5">ログイン履歴一覧</Typography>
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
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 }, overflowX: 'scroll'}}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>
    </Grid>
  );
// } else {
//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={12}>
//         <Card>
//           <Box sx={{ p: 5, pb: 1, mb: 5 }}>
//             <Typography variant="h5">生徒ログインログ一覧</Typography>
//           </Box>
//           <Box sx={{ p: 5, pb: 1, mb: 20 }}>
//             <Typography variant="body1">
//               生徒ログインログの登録はありません
//             </Typography>
//           </Box>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// } 
};

export default TeacherLoginLogs;

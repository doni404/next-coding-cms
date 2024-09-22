// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

// ** Icons Imports
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import ContentCopy from "mdi-material-ui/ContentCopy";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import toast from "react-hot-toast";

import { useRouter } from "next/router";

export const ImgStyled = styled("img")(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ButtonStyled = styled(Button)(({ theme }) => ({
  marginBottom: "20px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const columns = [
  {
    flex: 0.05,
    field: "id",
    minWidth: 90,
    headerName: "ID",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <Typography variant="body2">{row.id}</Typography>,
  },
  {
    flex: 0.3,
    field: "ip_address",
    minWidth: 120,
    headerName: "IPアドレス",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.ip_address}</Typography>
    ),
  },
  {
    flex: 0.3,
    field: "platform",
    minWidth: 120,
    headerName: "プラットホーム",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {row.platform === "pc" ? "Pc" : "Mobile"}
      </Typography>
    ),
  },
  {
    flex: 0.3,
    field: "browser",
    minWidth: 120,
    headerName: "ブラウザ",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.browser}</Typography>
    ),
  },
  {
    flex: 0.3,
    field: "os",
    minWidth: 120,
    headerName: "OS",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <Typography variant="body2">{row.os}</Typography>,
  },
  {
    flex: 0.3,
    field: "country",
    minWidth: 120,
    headerName: "国",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.country}</Typography>
    ),
  },
  {
    flex: 0.15,
    field: "created_at",
    minWidth: 250,
    headerName: "作成日",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography variant="body2">
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
];

const AdminLoginLogs = ({ data }) => {
  // ** State
  const [dataLogs, setDataLogs] = useState("");
  const [pageSize, setPageSize] = useState(10);
  // console.log("data : ", data.data.id)
  const dispatch = useDispatch();
  const router = useRouter();
  const apiUrl =
    BASE_URL_API + "v1/cms/admin-login-logs/admins/" + data.data.id;
  console.log("api url : ", apiUrl);
  const token = window.sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("res :", response);
        setDataLogs(response.data.data);
      })
      .catch((error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          router.replace('/401')
        }
      });
  }, [data.data.id]);

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="ログインログ一覧"
          sx={{ "& .MuiCardHeader-action": { m: 0 } }}
          titleTypographyProps={{
            variant: "h6",
            sx: {
              lineHeight: "32px !important",
              letterSpacing: "0.15px !important",
            },
          }}
        />
        <DataGrid
          localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
          className="tableWithImage"
          rowHeight={90}
          autoHeight
          rows={dataLogs}
          columns={columns}
          pageSize={pageSize}
          disableSelectionOnClick
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 }, overflowX: 'scroll'  }}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          aligncenter
          components={{
            NoRowsOverlay: () => (
              <Typography
                sx={{
                  display: "flex!important",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
                variant="body2"
              >
                ログインログはありません
              </Typography>
            ),
          }}
        />
      </Card>
    </Grid>
  );
};

export default AdminLoginLogs;

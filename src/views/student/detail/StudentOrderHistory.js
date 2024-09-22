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
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";

import axios from 'axios'

export function textToFullWidth(str) {
  return str.split('').map(char => {
      const code = char.charCodeAt(0)
      return (code >= 33 && code <= 126) ? String.fromCharCode(code + 65248) : char
  }).join('')
}

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

const RowOptions = ({ id }) => {
  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={`/product-orders/detail/${id}`} passHref>
        <Tooltip title="詳細">
          <IconButton size="small">
            <EyeOutline/>
          </IconButton>
        </Tooltip>
      </Link>
    </Box>
    </>
  );
};

const columns = [
  {
    flex: 0.15,
    minWidth: 80,
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
    field: "date",
    minWidth: 200,
    headerName: "登録日時",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography variant="body2">
           {row.date}
        </Typography>
      );
    },
  },
  {
    flex: 0.18,
    minWidth: 120,
    field: "student_id",
    headerName: "会員番号",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.student_id}
        </Typography>
      );
    },
  },
  {
    flex: 0.18,
    minWidth: 200,
    field: "student_name",
    headerName: "生徒名",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {textToFullWidth(row.student_name)}
        </Typography>
      );
    },
  },
  {
    flex: 0.18,
    minWidth: 200,
    field: "registered_plan",
    headerName: "現在の登録プラン",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.registered_plan}
        </Typography>
      );
    },
  },
  {
    flex: 0.18,
    minWidth: 150,
    field: "type",
    headerName: "購入種別",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.type}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "product_title",
    headerName: "商品名",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" sx={{textAlign: "center"}}>
          {row.product_title}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "total_price",
    minWidth: 150,
    headerName: "金額",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{seperatorYen(row.total_price)}円</Typography>;
    },
  },
  {
    flex: 0.18,
    minWidth: 250,
    field: "student_email",
    headerName: "生徒メール",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.student_email}
        </Typography>
      );
    },
  },
  {
    flex: 0.18,
    minWidth: 250,
    field: "stripe_customer_id",
    headerName: "生徒Stripe ID",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.stripe_customer_id}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "situation",
    headerName: "入金状態",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{
        row.situation 
      }</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "payment_method",
    headerName: "支払方法",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{
        row.payment_method
      }</Typography>;
    },
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "order_number",
    headerName: "注文番号",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.order_number}
        </Typography>
      );
    },
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const StudentVideosList = ({data}) => {
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
      url: BASE_URL_API + "v1/cms/product-orders/students/" + dataResponse.id + "?situation=incomplete,incomplete_expired,incomplete_canceled,success,failed,canceled,scheduled_cancel",
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
  console.log("store : ", store)

  if (store) {
    const rows = store.map((row) => ({
      ...row,
      date: (row.situation === "success" ? row.paid_at : row.situation === "canceled" ? row.canceled_at : row.created_at),
      student_id: (row.student ? row.student?.id : row.student_id),
      student_name: (row.student?.last_name || '') +"　"+ (row.student?.first_name || ''),
      registered_plan: (row.current_subscription_title ? row.current_subscription_title : '-'),
      type: (row.product_code.startsWith('PA') ? '追加ポイント' : row.product_code.startsWith('PS') ? '月額プラン' : '-'),
      total_price: (row.total_price+row.total_tax),
      situation: ((row.situation === "incomplete" && row.payment_attempt > 1) ? "新規失敗" :
      row.situation === "incomplete" ? "未完了" :
      row.situation === "incomplete_expired" ? "申込期限切れ" :
      row.situation === "incomplete_canceled" ? "申込キャンセル" :
      (row.situation === "success" && row.payment_type === "initial") ? "新規成功" :
      (row.situation === "success" && row.payment_type === "recurring" || row.situation === "success" && row.payment_type === "one_time") ? "継続成功" :
      row.situation === "failed" ? "継続失敗" :
      row.situation === "canceled" ? "定期キャンセル" :
      row.situation === "scheduled_cancel" ? "定期キャンセル" :
      row.situation),
      payment_method: (row.payment_method === "cc" ? "クレジット購入" : row.payment_method === "bank" ? "銀行購入" : row.payment_method),
      stripe_customer_id: (row.student?.stripe_customer_id)
    }));
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">領収書一覧</Typography>
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
              onRowClick={(params, event) => handleRowClick(params, event, store)}
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
              <Typography variant="h5">生徒お支払い一覧</Typography>
            </Box>
            <Box sx={{ p: 5, pb: 1, mb: 20 }}>
              <Typography variant="body1">
                領収書の登録はありません
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  } 
};

export default StudentVideosList;

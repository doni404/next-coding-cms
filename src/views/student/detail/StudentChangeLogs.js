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
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

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

const RowOptions = ({ id, change }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [changeItems, setChangeItems] = useState([]);
  const jsonArray = []

  useEffect(() => {}, []);

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ** Var

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    const changes = JSON.parse(change);

    jsonArray = Object.keys(changes).map(key => {
      return {
        key: key,
        old: changes[key].old,
        new: changes[key].new
      };
    });

    setChangeItems(jsonArray)
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    console.log("id ", id);
    setOpenEdit(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="詳細">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <EyeOutline />
          </IconButton>
        </Tooltip>
      </Box>
      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="user-view-edit"
        sx={{
          "& .MuiPaper-root": { width: "100%", maxWidth: 900, p: [2, 5] },
        }}
        aria-describedby="user-view-edit-description"
      >
        <DialogTitle sx={{ textAlign: "center", fontSize: "1.2rem !important", p: 0 }} >
          変更詳細
        </DialogTitle>
        <DialogContent sx={{}}>
          <Grid
            container
            spacing={6}
            sx={{ marginTop: ".5em", alignContent: "" }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>項目</TableCell>
                    <TableCell align="right">変更前</TableCell>
                    <TableCell align="right">変更後</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {changeItems.map((row) => (
                    <TableRow key={row.key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell component="th" scope="row">
                        {
                        row?.key === "school_status" ? "学校状態" :
                        row?.key === "special_access" ? "休退会後も特別ログイン・予約可" :
                        row?.key === "registration_purpose" ? "ご登録の目的" :
                        row?.key === "name" ? "氏名（漢字）" :
                        row?.key === "name_en" ? "氏名（ローマ字）" :
                        row?.key === "email" ? "Eメール" :
                        row?.key === "email_other" ? "生徒サブメール (任意)" :
                        row?.key === "email_other_notif" ? "生徒サブメール通知" :
                        row?.key === "phone" ? "電話番号" :
                        row?.key === "zip_code" ? "郵便番号" :
                        row?.key === "address" ? "住所（日本語名）" :
                        row?.key === "address_en" ? "住所（英名）" :
                        row?.key === "gender" ? "性別" :
                        row?.key === "birthdate" ? "生年月日" :
                        row?.key === "skype_display_name" ? "スカイプ表示名":
                        row?.key === "skype_name" ? "スカイプ名" :
                        row?.key === "french_level" ? "フランス語レベル" :
                        row?.key === "french_goal" ? "フランス語を勉強する目的" :
                        row?.key === "reference" ? "当スクールをどこでお知りになりましたか" :
                        row?.key === "student_reference_code" ? "紹介者会員番号" :
                        row?.key === "student_reference_name" ? "紹介者氏名" :
                        row?.key === "unlimited_reservation" ? "予約数無制限" :
                        row?.key === "timezone_id" ? "タイムゾーン" :
                        row?.key === "situation" ? "状態" :
                        row?.key === "note" ? "備考" :
                        row?.key === "password" ? "パスワード" :
                        row?.key === "admin_updated_id" ? "管理者更新ID" :
                        row?.key 
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                        (row?.key === "unlimited_reservation" &&  row?.old === "yes" ) ? "無制限" :
                        (row?.key === "unlimited_reservation" && row?.old === "no" ) ? "制限あり" :
                        row?.old === "on" ? "希望する" :
                        row?.old === "off" ? "希望しない" :
                        row?.old === "yes" ? "はい" :
                        row?.old === "no" ? "いいえ" :
                        row?.old === "male" ? "男性" :
                        row?.old === "female" ? "女性" :
                        row?.old === "active" ? "アクティブ" :
                        row?.old === "inactive" ? "非アクティブ" :
                        row?.old === "show" ? "表示" :
                        row?.old === "inactive" ? "いいえ" :
                        row?.old === "skype" ? "Skypeオンラインレッスン受講":
                        row?.old === "video" ? "ビデオ講座視聴":
                        row?.old === "all" ? "両方":
                        row?.old === "temp_register_school" ? "（仮登録）" :
                        row?.old === "register_school" ? "本登録" :
                        row?.old === "done_trial_school" ? "体験受講【済】" :
                        row?.old === "not_use_trial_school" ? "（未受講）":
                        row?.old === "not_enter_school" ? "（未入会）" :
                        row?.old === "enter_school" ? "▼受講中" :
                        row?.old === "recess_school" ? "【休会】" :
                        row?.old === "withdrawal_school" ? "【退会】" :
                        row?.old === "google_ads" ? "Google広告":
                        row?.old === "google_search" ? "Google検索" :
                        row?.old === "yahoo_ads" ? "Yahoo広告" :
                        row?.old === "yahoo_search" ? "Yahoo検索" :
                        row?.old === "friend" ? "友人・知人の紹介" :
                        row?.old === "facebook" ? "Facebook" :
                        row?.old === "twitter" ? "Twitter" :
                        row?.old === "youtube" ? "Youtube" :
                        row?.old === "wp_alacafet" ? "A la Cafet' またはFRANCE 365" :
                        row?.old === "deow" ? "DEOW留学センター" :
                        row?.old === "support_center" ? "国際交流サポートセンター" :
                        row?.old === "other" ? "その他" :
                        row?.old === "beginner" ? "入門・フランス語はまったくの初心者である" :
                        row?.old === "beginner1" ? "初級１（仏検５級）挨拶や自己紹介など知っている表現のみ話せる" :
                        row?.old === "beginner2" ? "初級２（仏検４級）avoirやetreなど必要最低限の動詞は活用して話せる" :
                        row?.old === "beginner3" ? "初級３（仏検３級、DELF A1）身の回りの具体的なことは理解できる・話せる" :
                        row?.old === "intermediate1" ? "中級１（仏検準２級、DELF A2）日常生活において過去形・現在形を用いて表現できる" :
                        row?.old === "intermediate2" ? "中級２（仏検２級、DELF B1）興味がある分野について自分の意見を述べることができる" :
                        row?.old === "intermediate3" ? "中級３（仏検準１級、DELFB2）一般的な話題で議論ができ、抽象的な表現も理解できる" :
                        row?.old === "advance1" ? "上級１（仏検１級、DALFC1)社会生活において広く対応でき、複雑な文章や情報を理解できる" :
                        row?.old === "advance2" ? "上級２（仏検１級、DALFC2)複雑な文章や情報を細かいニュアンスまで理解・表現できる" :
                        row?.key === "password" ? "*****" : 
                        row?.old
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                        (row?.key === "unlimited_reservation" &&  row?.new === "yes" ) ? "無制限" :
                        (row?.key === "unlimited_reservation" && row?.new === "no" ) ? "制限あり" :
                        row?.new === "on" ? "希望する" :
                        row?.new === "off" ? "希望しない" :
                        row?.new === "yes" ? "はい" :
                        row?.new === "no" ? "いいえ" :
                        row?.new === "male" ? "男性" :
                        row?.new === "female" ? "女性" :
                        row?.new === "active" ? "アクティブ" :
                        row?.new === "inactive" ? "非アクティブ" :
                        row?.new === "show" ? "表示" :
                        row?.new === "inactive" ? "いいえ" :
                        row?.new === "skype" ? "Skypeオンラインレッスン受講" :
                        row?.new === "video" ? "ビデオ講座視聴" :
                        row?.new === "all" ? "両方" :
                        row?.new === "temp_register_school" ? "（仮登録）" :
                        row?.new === "register_school" ? "本登録" :
                        row?.new === "done_trial_school" ? "体験受講【済】" :
                        row?.new === "not_use_trial_school" ? "（未受講）":
                        row?.new === "not_enter_school" ? "（未入会）" :
                        row?.new === "enter_school" ? "▼受講中" :
                        row?.new === "recess_school" ? "【休会】" :
                        row?.new === "withdrawal_school" ? "【退会】" :
                        row?.new === "google_ads" ? "Google広告":
                        row?.new === "google_search" ? "Google検索" :
                        row?.new === "yahoo_ads" ? "Yahoo広告" :
                        row?.new === "yahoo_search" ? "Yahoo検索" :
                        row?.new === "friend" ? "友人・知人の紹介" :
                        row?.new === "facebook" ? "Facebook" :
                        row?.new === "twitter" ? "Twitter" :
                        row?.new === "youtube" ? "Youtube" :
                        row?.new === "wp_alacafet" ? "A la Cafet' またはFRANCE 365" :
                        row?.new === "deow" ? "DEOW留学センター" :
                        row?.new === "support_center" ? "国際交流サポートセンター" :
                        row?.new === "other" ? "その他" :
                        row?.new === "beginner" ? "入門・フランス語はまったくの初心者である" :
                        row?.new === "beginner1" ? "初級１（仏検５級）挨拶や自己紹介など知っている表現のみ話せる" :
                        row?.new === "beginner2" ? "初級２（仏検４級）avoirやetreなど必要最低限の動詞は活用して話せる" :
                        row?.new === "beginner3" ? "初級３（仏検３級、DELF A1）身の回りの具体的なことは理解できる・話せる" :
                        row?.new === "intermediate1" ? "中級１（仏検準２級、DELF A2）日常生活において過去形・現在形を用いて表現できる" :
                        row?.new === "intermediate2" ? "中級２（仏検２級、DELF B1）興味がある分野について自分の意見を述べることができる" :
                        row?.new === "intermediate3" ? "中級３（仏検準１級、DELFB2）一般的な話題で議論ができ、抽象的な表現も理解できる" :
                        row?.new === "advance1" ? "上級１（仏検１級、DALFC1)社会生活において広く対応でき、複雑な文章や情報を理解できる" :
                        row?.new === "advance2" ? "上級２（仏検１級、DALFC2)複雑な文章や情報を細かいニュアンスまで理解・表現できる" :
                        row?.key === "password" ? "*****" : 
                        row?.new
                        }
                      </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid container sx={{ mt: 3, justifyContent: "center" }}>
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              sx={{ m: 3 }}
            >
              閉じる
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
    flex: 0.05,
    maxWidth: 120,
    sortable: false,
    field: "actions",
    headerName: "変更箇所",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} change={row.changes}/>,
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "admin_id",
    headerName: "管理ID",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.admin_id}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "changed_by",
    headerName: "変更担当者",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.changed_by === "admin" ? "管理者" : "生徒"}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "登録日時",
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

const StudentLoginLogs = ({data}) => {

  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const [store, setStore] = useState();

useEffect(() => {
  const endpoint = BASE_URL_API + "v1/cms/student-change-logs/students/" + dataResponse.id +"?sort_by=created_at.desc";
  console.log("endpoint", endpoint);
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

if (store) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1, mb: 5 }}>
            <Typography variant="h5">変更履歴一覧</Typography>
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
} else {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1, mb: 5 }}>
            <Typography variant="h5">変更履歴一覧</Typography>
          </Box>
          <Box sx={{ p: 5, pb: 1, mb: 20 }}>
            <Typography variant="body1">
              生徒ログインログの登録はありません
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
} 
};

export default StudentLoginLogs;

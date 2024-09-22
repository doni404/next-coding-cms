// ** React Imports
import { useState, useEffect } from "react";
import React from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
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

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

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

const RowOptions = ({ id, teacher, change, sit, nm }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [changeItems, setChangeItems] = useState([]);
  const [situation, setSituation] = useState(sit)
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
    console.log("id ", id, " | change : ", changes, " | teacher : ", teacher);

    jsonArray = Object.keys(changes).map(key => {
      return {
        key: key,
        old: changes[key].old,
        new: changes[key].new
      };
    });

    setSituation(sit)
    setChangeItems(jsonArray)
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    console.log("id ", id);
    setOpenEdit(false);
  };

  const handleEditSubmit = (value) => {
    console.log('Submit button value:', value);
    const request = {
      id: id,
      situation: value,
    };

    console.log("Req : ", request);

    dispatch(updateTeacherChangeRequest(request)).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("講師変更要求が編集されました。");
      } else {
        console.log("success", response);
        toast.success("講師変更要求が編集されませんでした。");
      }
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="講師変更要求を編集">
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
          <Link href={`/teacher/detail/${teacher}`} passHref>
            <MenuItemLink sx={{ justifyContent: "center" }}>
              <Typography variant='h4' sx={{ fontWeight: 700 }}>
                {nm}先生 ({teacher})
              </Typography>
            </MenuItemLink>
          </Link>
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
                        row?.key === "name" ? "講師名" :
                        row?.key === "show_public" ? "表示" :
                        row?.key === "situation" ? "状態" :  
                        row?.key === "email" ? "Eメール" :
                        row?.key === "password" ? "パスワード" :  
                        row?.key === "skype_display_name" ? "スカイプ表示名" : 
                        row?.key === "skype_name" ? "スカイプ名" : 
                        row?.key === "profile_image" ? "講師画像" : 
                        row?.key === "supported_language" ? "対応可能言語" :
                        row?.key === "features" ? "特徴" :
                        row?.key === "introduction" ? "自己紹介" :
                        row?.key === "lesson_style" ? "レッスンスタイル" :
                        row?.key === "reservation_available_time" ? "予約可能時間" :
                        row?.key === "cancelation_available_time" ? "キャンセル可能時間" :
                        row?.key === "trial_availability" ? "無料体験対応" :
                        row?.key === "experienced_attendance" ? "受講制限" :
                        row?.key === "available_courses" ? "対応可能コース" :
                        row?.key === "credit_zero_reservation" ? "クレジット0予約可否" : 
                        row?.key === "is_reservation_limit " ? "予約制限" :
                        row?.key === "personal_career" ? "経歴" :
                        row?.key === "personal_education" ? "学歴" :
                        row?.key === "personal_language" ? "言語" :
                        row?.key === "personal_speciality" ? "得意分野" :
                        row?.key === "personal_hobby" ? "趣味" :
                        row?.key === "personal_holiday" ? "好きな休日の過ごし方" :
                        row?.key === "personal_fav_food" ? "好きな食べ物" :
                        row?.key === "personal_fav_drink" ? "好きな飲み物" :
                        row?.key === "note" ? "講師備考" :
                        row?.key === "admin_updated_id" ? "更新担当者" :
                        row?.key === "row?.key" 
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                        (row?.key === "show_public" && row?.old === "yes") ? "表示" :
                        (row?.key === "show_public" && row?.old === "no") ? "非表示" :
                        row?.old === "yes" ? "はい" :
                        row?.old === "no" ? "いいえ" :
                        row?.old === "active" ? "アクティブ" :
                        row?.old === "inactive" ? "非アクティブ" :
                        (row?.old === "trial_availability" && row?.old === "yes") ? "対応可" :
                        (row?.old === "trial_availability" && row?.old === "no") ? "対応不可" :
                        (row?.old === "is_reservation_limit" && row?.old === "yes") ? "無" :
                        (row?.old === "is_reservation_limit" && row?.old === "no") ? "有" :
                        row?.old === "possible" ? "可" :
                        row?.old === "impossible" ? "不可" :
                        row?.key === "password" ? "*****" : 
                        row?.old
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                        (row?.key === "show_public" && row?.new === "yes") ? "表示" :
                        (row?.key === "show_public" && row?.new === "no") ? "非表示" :
                        row?.new === "yes" ? "はい" :
                        row?.new === "no" ? "いいえ" :
                        row?.new === "active" ? "アクティブ" :
                        row?.new === "inactive" ? "非アクティブ" :
                        (row?.new === "trial_availability" && row?.new === "yes") ? "対応可" :
                        (row?.new === "trial_availability" && row?.new === "no") ? "対応不可" :
                        (row?.new === "is_reservation_limit" && row?.new === "yes") ? "無" :
                        (row?.new === "is_reservation_limit" && row?.new === "no") ? "有" :
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
            {situation === "waiting" ? 
            <>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={() =>handleEditSubmit('accepted')}
              sx={{ m: 3 }}
            >
              承認する
            </Button>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={() =>handleEditSubmit('rejected')}
              sx={{ m: 3 }}
            >
              拒否する
            </Button> 
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              sx={{ m: 3 }}
            >
              閉じる
            </Button> </> : 
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              sx={{ m: 3 }}
            >
              閉じる
            </Button> }
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
    maxWidth: 60,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} teacher={row.teacher_id} change={row.changes} sit={row.situation} nm={row.name}/>,
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
      return <Typography variant="body2">{row.changed_by  === "admin" ? "管理者" : "講師"}</Typography>;
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
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TeacherChangeLogs = ({data}) => {
  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const [store, setStore] = useState();

useEffect(() => {
  const endpoint = BASE_URL_API + "v1/cms/teacher-change-logs/teachers/" + dataResponse.id + "?sort_by=created_at.desc";
  axiosInstance.get(endpoint, data)
    .then(function (response) {
      const finalData = response.data.data.map((item) => {
        return {
          id: item.id,
          admin_id: item.admin_id,
          changed_by: item.changed_by,
          changes: item.changes,
          created_at: item.created_at,
          teacher_id: item.teacher_id,
          name: dataResponse.name,
        };
      });
      setStore(finalData)
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

export default TeacherChangeLogs;

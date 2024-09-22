// ** React Imports
import { useState, useEffect } from "react";
import React from "react";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// **import helpers */
import { useRowSelection } from 'src/helper/useRowSelection';

import {
  fetchData,
  updateStudentPointHistory,
} from "src/store/apps/student_point_history";
import SidebarAddStudentPointHistory from "src/views/student/list/AddStudentPointHistory";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TextField } from "@mui/material";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";
import Download from 'mdi-material-ui/Download'

import axios from "axios";

// ** Third party Imports
import toast from "react-hot-toast";
import { useForm, useController } from "react-hook-form";

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

const separatorComa = (coma) => {
  return new Intl.NumberFormat('ja-JP').format(coma);
}

const teacherNameAndDate = (row) => {
  if (row.reservation_id !== null) {
    const teacherName = row.reservation.teacher?.last_name + ' ' + row.reservation.teacher?.first_name;
    const reservationDate = row.reservation.reservation_date;
    return teacherName + '\n' + reservationDate;
  } else {
    return '-';
  }
}

const checkPointType = (type) => {
  if (
    [
      "purchase_additional",
      "purchase_subscription",
      "gift_gain",
      "lesson_cancel_student",
      "lesson_cancel_admin",
      "lesson_cancel_teacher",
      "lesson_cancel_student_gift",
      "lesson_cancel_admin_gift",
      "lesson_cancel_teacher_gift",
    ].includes(type)
  ) {
    return "+";
  } else {
    return "-";
  }
}

const checkTransactionType = (row) => {
  const type = row.transaction_type;
  const today = new Date();
  if (
    [
      "lesson_cancel_student",
      "lesson_cancel_admin",
      "lesson_cancel_teacher",
    ].includes(type)
  ) {
    return "red";
  } else if (
    [
      "purchase_subscription",
      "purchase_additional" 
    ].includes(type)
  ) {
    return "green";
  } else if(
    [
      "lesson_taken",
      "lesson_taken_cancel",
    ].includes(type)
  ){
    const color = (row.transaction_type === "lesson_taken" && row?.reservation_id !== null && new Date(row.reservation.reservation_date) >= today) ? "blue" : row.transaction_type === "lesson_taken_cancel" ? "blue" : "";
    return color;
  } else {  
    return "";
  }
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

const RowOptions = ({ id, no, stId}) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [studentId, setStudentId] = useState(stId);

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ** Var

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      note: no || '', // Set defaultName or an empty string if not provided
    },
  });

  const noteController = useController({
    name: 'note',
    control,
  });

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    console.log("id ", id);
    console.log("student id : ", stId)
    setStudentId(stId);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    console.log("id ", id);
    reset();
    setOpenEdit(false);
  };

  const onSubmit = (data) => {
    const request = {
      id: id,
      note: data.note,
      student_id: studentId
    };
    console.log("Req : ", request)
    dispatch(updateStudentPointHistory(request)).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("備考が編集されませんでした。");
      } else {
        console.log("success", response);
        toast.success("備考が編集されました");
      }
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="備考を編集">
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
          "& .MuiPaper-root": { width: "100%", maxWidth: 500, p: [2, 5] },
        }}
        aria-describedby="user-view-edit-description"
      >
        <DialogTitle
          sx={{ textAlign: "center", fontSize: "1.2rem !important", p: 0 }}
        >
          戦績
        </DialogTitle>
        <DialogContent sx={{}}>
          <Grid
            container
            spacing={6}
            sx={{ marginTop: ".5em", alignContent: "" }}
          >
            <Grid item xs={12} sm={12}>
              <Typography variant="body1" sx={{ textAlign: "center", pb: 3 }}>
                ID : {id}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              placeholder="備考"
              label="備考"
              value={noteController.field.value}
              onChange={noteController.field.onChange}
            />
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, justifyContent: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{ m: 3 }}
            >
              編集
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              sx={{ m: 3 }}
            >
              キャンセル
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
    minWidth: 120,
    headerName: "登録日時",
    field: "created_at",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      const [date, time] = row.created_at.split(' ');
      return (
          <Typography noWrap variant="body2">
            <span>{date}</span><br/><span>{time}</span>
          </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "point_current",
    headerName: "残ポイント",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" sx={{textAlign: "center"}}>
          <span>{separatorComa(row.point_current)}</span>
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 170,
    field: "plan_name",
    headerName: "登録プラン名",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.plan_name}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "point",
    headerName: "増減数",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">
        <span style={{color: checkPointType(row.transaction_type) === "+" ? "green" : "red"}}>{row.point}</span>
      </Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "teacher_name",
    headerName: "講師名/レッスン日時",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.teacher_name}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "transac_type",
    headerName: "取引の種類",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">
        <span style={{color: checkTransactionType(row)}}>{
        row.transac_type
      }</span></Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "note",
    headerName: "備考",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.note}</Typography>;
    },
  },
  {
    flex: 0.1,
    minWidth: 80,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <RowOptions
        id={row.id}
        no={row.note}
        stId={row.student?.id}
      />
    ),
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const StudentPointHistoryList = ({data, setRefreshKey}) => {
  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const dispatch = useDispatch();
  const store = useSelector((state) => state.student_point_history);
  const [addStudentPointHistoryOpen, setAddStudentPointHistoryOpen] = useState(false);
  const { selectedRows, handleRowClick } = useRowSelection();

  useEffect(() => {
    dispatch(fetchData(dataResponse.id))
      .unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        if (rejected.toString().includes("401")) {
          router.replace("/401");
        }
      });
  }, [dispatch]);

  const toggleAddStudentPointHistory = () => setAddStudentPointHistoryOpen(!addStudentPointHistoryOpen);

  console.log("store exe : ", store);

  if (store) {
    const rows = store.data.map((row) => {
      const today = new Date();
      const pointType = checkPointType(row.transaction_type);
      const formattedPoint = separatorComa(row.point);
      return{
      ...row,
      plan_name: (row.student?.subscription?.product_title),
      point: formattedPoint + " ("+ pointType +")",
      teacher_name: teacherNameAndDate(row),
      transac_type: (row.transaction_type === "purchase_subscription" ? "月額プラン支払い" :
        row.transaction_type === "purchase_additional" ? "追加ポイント購入" :
        row.transaction_type === "expired" ? "Ｐ有効期限切れ" :
        row.transaction_type === "expired_withdrawal" ? "退会利益" :
        row.transaction_type === "gift_gain" ? "特別進呈P" :
        row.transaction_type === "gift_taken" ? "特別進呈P 消化" :
        row.transaction_type === "expired_gift" ? "特別進呈P 失効" :
        row.transaction_type === "lesson_taken_cancel" ? "レッスン履行待ち" :
        (row.transaction_type === "lesson_taken" && row?.reservation_id !== null && new Date(row.reservation.reservation_date) < today) ? "レッスン消化" :
        (row.transaction_type === "lesson_taken" && row?.reservation_id !== null && new Date(row.reservation.reservation_date) >= today) ? "レッスン履行待ち" :
        ["lesson_cancel_student", "lesson_cancel_student_gift"].includes(row.transaction_type) ? "生徒キャンセル" :
        ["lesson_cancel_admin", "lesson_cancel_admin_gift"].includes(row.transaction_type) ? "管理キャンセル" :
        ["lesson_cancel_teacher", "lesson_cancel_teacher_gift"].includes(row.transaction_type) ? "講師によるレッスンキャンセル" :
        ["lesson_tip", "gift_tip"].includes(row.transaction_type) ? "レッスンチップ" :
        row.transaction_type),
    }
  });

  const downloadExcel = async () => {
    const token = window.sessionStorage.getItem('token')
    // Get the current form data
  
    const endpoint = "v1/cms/student-point-transactions/students/"+dataResponse.id+"/report-excel" 
  
    try {
      const response = await axios.get(`${BASE_URL_API}` + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob', // Important
      });
      
      // console.log('response', response)
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      let studentName = (dataResponse.last_name || '') + (dataResponse.first_name || '');
      let filename = `${dataResponse.id}_${studentName}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const downloadPDF = async() => {
    const token = window.sessionStorage.getItem('token')

    await axios({
      method: 'get',
      url: BASE_URL_API + 'v1/cms/student-point-transactions/students/'+dataResponse.id+'/report-pdf',
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/pdf',
        });
        const pdfUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pdfUrl;
        let studentName = (dataResponse.last_name || '') + (dataResponse.first_name || '');
        let filename = `${dataResponse.id}_${studentName}.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(pdfUrl);
      })
      .catch((error) => {
        console.error('File download failed:', error);
      })
  };

    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
          <Box sx={{ p: 5, pb: 1, mb: 5, 
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,}}>
              <Typography variant="h5">個別推移表一覧</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* <Button sx={{ mb: 2 }}  onClick={toggleAddStudentPointHistory} variant="contained">
                  追加する
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: 2, mb: 2 }}
                  onClick={downloadExcel} // replace with your function
                >
                  <Download fontSize='small' sx={{ mr: 2 }} />
                  Excelでダウンロード
                </Button>
                <Button sx={{ ml: 2, mb: 2 }} onClick={downloadPDF} variant="contained">
                  <Download fontSize='small' sx={{ mr: 2 }} />
                  PDFでダウンロード
                </Button> */}
              </Box>
            </Box>
            <Box sx={{padding : "0 1.25rem 1.75rem", '& .MuiTypography-root': { lineHeight: '1.7' }}}>
                <Grid fullWidth container item xs={12} sm={8} >
                  <Grid item xs={12} sm={4}>
                    <Typography >生徒ID </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography >{dataResponse.id}</Typography>
                  </Grid>
                </Grid>
                <Grid fullWidth container item xs={12} sm={8}>
                  <Grid item xs={12} sm={4}>
                    <Typography >氏名 </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography >{dataResponse.last_name}{dataResponse.first_name}</Typography>
                  </Grid>
                </Grid>
                <Grid fullWidth container item xs={12} sm={8}>
                  <Grid item xs={12} sm={4}>
                    <Typography >生徒メールアドレス </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography >{dataResponse.email}</Typography>
                  </Grid>
                </Grid>
                <Grid fullWidth container item xs={12} sm={8}>
                  <Grid item xs={12} sm={4}>
                    <Typography >取得済の総進呈P数 </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography >{separatorComa(dataResponse.total_point_gifted)}</Typography>
                  </Grid>
                </Grid>
                <Grid fullWidth container item xs={12} sm={8}>
                  <Grid item xs={12} sm={4}>
                    <Typography >残存する進呈P数 </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography >{separatorComa(dataResponse.total_point_gifted_remaining)}</Typography>
                  </Grid>
                </Grid>
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
        <SidebarAddStudentPointHistory data={dataResponse} open={addStudentPointHistoryOpen} toggle={toggleAddStudentPointHistory} setRefreshKey={setRefreshKey}/>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">ポイント履歴一覧</Typography>
            </Box>
            <Box sx={{ p: 5, pb: 1, mb: 20 }}>
              <Typography variant="body1">
                個別推移表の登録はありません
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  } 
};

export default StudentPointHistoryList;

// ** React Imports
import { useState, useEffect, useCallback } from "react";
import React from "react";

// ** Actions Imports
import {
  fetchData,
  deleteTeacherTournament,
  updateTeacherTournament,
} from "src/store/apps/teacher_tournament";
import SidebarAddTeacherTournament from "src/views/teacher/list/AddTeacherTournament";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Next Import
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TextField } from "@mui/material";


// ** Icons Imports
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";


// ** Third party Imports
import toast from "react-hot-toast";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

const schema = yup.object().shape({
  name: yup.string().required("大会名の役割は入力必須項目です"),
  year: yup.string().required("年の役割は入力必須項目です"),
});

const defaultValues = {
  name: "",
  year: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const RowOptions = ({ id, na, yr, teaId}) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [teacherId, setTeacherId] = useState(teaId);
  const adminId = window.sessionStorage.getItem("id");

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
    resolver: yupResolver(schema),
    defaultValues: {
      name: na || '', // Set defaultName or an empty string if not provided
      year: yr || '', // Set defaultYear or an empty string if not provided
    },
  });

  const nameController = useController({
    name: 'name',
    control,
  });

  const yearController = useController({
    name: 'year',
    control,
  });

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    console.log("id ", id);
    setTeacherId(teaId);
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
      teacher_id: teacherId,
      name: data.name,
      year: data.year,
    };
    console.log("Req : ", request)
    dispatch(updateTeacherTournament(request)).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("戦績が編集されませんでした。");
      } else {
        console.log("success", response);
        toast.success("戦績が編集されました");
      }
    });
  };

  const handleDelete = () => {
    console.log("id ", id);

    var data = {
      teacher_id: teacherId,
      id: id,
    };

    dispatch(deleteTeacherTournament(data)).then((response) => {
      setDeleteDialog(false);
      handleRowOptionsClose();
      if (response.error) {
        console.log("error", response.error);
        toast.error("戦績が削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("戦績が削除されました。");
      }
    });
  };

  // delete guide
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };


  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="キャプションを編集">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <PencilOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="戦績削除">
          <IconButton size="small" onClick={handleDeleteClickOpen}>
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={deleteDialog}
        onClose={handleDeleteClose}
        aria-labelledby="user-view-edit"
        sx={{
          "& .MuiPaper-root": { width: "100%", maxWidth: 500, p: [2, 5] },
        }}
        aria-describedby="user-view-edit-description"
      >
        <DialogTitle
          id="user-view-edit"
          sx={{ textAlign: "center", fontSize: "1.5rem !important" }}
        >
          戦績を削除します
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            戦績を削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" sx={{ mr: 1 }} onClick={handleDelete}>
            削除する
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteClose}
          >
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>

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
              required
              fullWidth
              placeholder="大会名"
              label="大会名"
              value={nameController.field.value}
              onChange={nameController.field.onChange}
              onBlur={nameController.field.onBlur}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            </Grid>
            <Grid item xs={12} sm={12}>
            <TextField
              required
              fullWidth
              placeholder="年"
              label="年"
              value={yearController.field.value}
              onChange={yearController.field.onChange}
              onBlur={yearController.field.onBlur}
              error={Boolean(errors.year)}
              helperText={errors.year?.message}
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
    field: "name",
    headerName: "大会名",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "year",
    minWidth: 120,
    headerName: "年",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography variant="body2">
          {row.year}
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
      return (
        <Typography noWrap variant="body2">
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
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
        na={row.name}
        yr={row.year}
        teaId={row.teacher_id}
      />
    ),
  },
];

const TeacherTournament = ({data}) => {

  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();
  const dataResponse = data.data;
  console.log("data response : ", dataResponse)
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state) => state.teacher_tournament);
  const [addTeacherTournamentOpen, setAddTeacherTournamentOpen] = useState(false);

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
  console.log("store exe : ", store);

  const toggleAddTeacherTournament = () => setAddTeacherTournamentOpen(!addTeacherTournamentOpen);

  // if (store) {
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
            <Typography sx={{ mr: 6, mb: 2 }} variant="h5">戦績一覧</Typography>
            <Button sx={{ mb: 2 }}  onClick={toggleAddTeacherTournament} variant="contained">
              追加する
            </Button>
          </Box>
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            className="tableWithImage"
            rowHeight={90}
            autoHeight
            rows={store.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 50, 100]}
            sx={{
              "& .MuiDataGrid-columnHeaders": { borderRadius: 0 },
              overflowX: "scroll",
            }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>
      <SidebarAddTeacherTournament data={dataResponse} open={addTeacherTournamentOpen} toggle={toggleAddTeacherTournament} />
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

export default TeacherTournament;

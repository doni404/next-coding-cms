// ** React Imports
import { useState, useEffect, useCallback } from "react";
import React from "react";

// ** Actions Imports
import { fetchData, deleteCoursesChild, updateCoursesChild } from "src/store/apps/course_child";
import SidebarAddCourseChild from "src/views/course/list/AddCourseChild";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Next Import
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
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

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

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
  name_ja: yup.string().required("コース名入力必須項目です"),
});

const defaultValues = {
  name_en: "",
  name_ja: "",
};

const RowOptions = ({ course, en, ja  }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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
      name_en: en || '',
      name_ja: ja || '',
    },
  });

  const enController = useController({
    name: 'name_en',
    control,
  });

  const jaController = useController({
    name: 'name_ja',
    control,
  });

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    reset();
    setOpenEdit(false);
  };

  const onSubmit = (data) => {
    const request = {
      id: course.id,
      course_id: course.category.id,
      name_en: data.name_en,
      name_ja: data.name_ja,
    };
    console.log("Req : ", request)
    dispatch(updateCoursesChild(request)).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("子コースが編集されませんでした。");
      } else {
        console.log("success", response);
        toast.success("子コースが編集されました。");
      }
    });
  };

  const handleDelete = () => {
    var data = {
      id: course.id,
      course_id: course.category.id
    };

    dispatch(deleteCoursesChild(data)).then((response) => {
      setDeleteDialog(false);
      handleRowOptionsClose();
      if (response.error) {
        console.log("error", response.error);
        toast.error("子コース削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("子コース削除されました。");
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
        <Tooltip title="子コース一覧編集">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <PencilOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="子コース一覧削除">
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
          子コースを削除します
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            子コースを削除してもよろしいですか？
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
          子コース詳細
        </DialogTitle>
        <DialogContent sx={{}}>
          <Grid
            container
            spacing={6}
            sx={{ marginTop: ".5em", alignContent: "" }}
          >
            <Grid item xs={12} sm={12}>
              <Typography variant="body1" sx={{ textAlign: "center", pb: 3 }}>
                ID : {course.id}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={12}>
            <TextField
              required
              fullWidth
              placeholder="コース名（日本語）"
              label="コース名（日本語）"
              value={jaController.field.value}
              onChange={jaController.field.onChange}
              onBlur={jaController.field.onBlur}
              error={Boolean(errors.name_ja)}
              helperText={errors.name_ja?.message}
            />
            </Grid>
            <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              placeholder="コース名（英語）"
              label="コース名（英語）"
              value={enController.field.value}
              onChange={enController.field.onChange}
              onBlur={enController.field.onBlur}
              error={Boolean(errors.name_en)}
              helperText={errors.name_en?.message}
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
              保存
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
    field: "name_ja",
    headerName: "コース名（日本語）",
    headerAlign: "center",
    valueGetter: (params) => params.row.name_ja ? params.row.name_ja : "",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name_ja ? row.name_ja : ""}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: "total_teacher",
    headerName: "インストラクター合計",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.total_teacher}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: "created_at",
    headerName: "登録日",
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
        course={row}
        en={row.name_en}
        ja={row.name_ja}
      />
    ),
  },
];

const CourseTeacher = ({data}) => {

  // ** State
  const [pageSize, setPageSize] = useState(10);
  // const [length, setLength] = useState();
  const dataResponse = data.data;
  console.log("data response : ", dataResponse)
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state) => state.courses_child);
  const [AddCourseChildOpen, setAddCourseChildOpen] = useState(false);

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
  
  const toggleAddCourseChild = () => setAddCourseChildOpen(!AddCourseChildOpen);

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
            <Typography sx={{ mr: 6, mb: 2 }} variant="h5">子コース一覧</Typography>
            <Button sx={{ mb: 2 }}  onClick={toggleAddCourseChild} variant="contained">
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
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              "& .MuiDataGrid-columnHeaders": { borderRadius: 0 },
              overflowX: "scroll",
            }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>
      <SidebarAddCourseChild data={dataResponse} open={AddCourseChildOpen} toggle={toggleAddCourseChild} />
    </Grid>
  );
};

export default CourseTeacher;

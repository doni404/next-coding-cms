// ** React Imports
import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";

// ** Third Party Components
import toast from "react-hot-toast";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import {fetchData, updateTeacherVideo, deleteTeacherVideo } from "src/store/apps/teacher_video";
// import { dispatch } from "react-hot-toast/dist/core/store";
import SidebarAddTeacherVideo from "src/views/teacher/list/AddTeacherVideo";
import SingleFileUpload from "src/components/SingleFileUpload";
import { use } from "i18next";
import { set } from "nprogress";

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

const schema = yup.object().shape({
  title: yup.string().required("動画名が必要です。"),
  type: yup.string().required("タイプが必要です。").oneOf(["youtube", "own"], "無効な状況選択"),
  url: yup.string().test('is-youtube', '無効なYouTubeのURL', function (value) {
    const { type } = this.parent;
    if (type === 'youtube') {
      if (!value) {
        return this.createError({ message: "URLが必要です。" });
      }
      return /^((?:https?:)?\/\/)?((?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|(?:youtu\.be)\/([a-zA-Z0-9_-]{11}))(\?[\w=&]+)?$/.test(value);
    }
    return true;
  }),
  videoFiles: yup.mixed().test('file', 'ファイルを選択する必要があります。', function (value) {
    const { type } = this.parent;
    if (type === 'own') {
      return value && value.length > 0;
    }
    return true;
  }),
});

const defaultValues = {
  title: "",
  type: "",
  url: "",
};

const RowOptions = ({ id, title, typ, url, teacher_id}) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const adminId = window.sessionStorage.getItem("id");
  const [isLoading, setIsLoading] = useState(false);
  const [urlUpload, setUrlUpload] = useState("");
  
  //Handle file uploads from child component
  const [videoFiles, setVideoFiles] = useState([]);

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ** Var

  const {
    reset,
    watch,
    control,
    register,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  const type = watch('type');

  useEffect(() => {
    register('videoFiles'); // manually register the videoFiles input
  }, [register]);

  useEffect(() => {
    // console.log("useEffect : ", type, url);
    if (typ === 'own') {
      console.log("type : ", type);
      setUrlUpload(url);
      setValue('url', ''); // Clear the url field in the form
    } else if (typ === 'youtube') {
      console.log("type : ", type);
      setUrlUpload('');
    }
  }, [type, url, openEdit]);

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    console.log("id ", id);
    setValue("title", title, { shouldValidate: true });
    setValue("type", typ, { shouldValidate: true });
    setValue("url", url, { shouldValidate: true });
    setUrlUpload(typ === 'own' ? url : '');
    setIsLoading(false);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    console.log("id ", id);
    reset();
    setVideoFiles([]);
    setOpenEdit(false);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log("type:", data.type);

    const formData = new FormData();
    if (data.type === "youtube") {
      formData.append("url", data.url);
    }
    if (data.type === "own") {
      console.log("videoFiles:", videoFiles);
      for (const file of videoFiles) {
        if (file.url) {
          // console.log("file:", file);
          const response = await fetch(file.url);
          const blob = await response.blob();
          formData.append("file", blob, file.name);
        } else {
          formData.append("file", file);
        }
      }
    }
    formData.append("teacher_id", teacher_id);
    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("situation", "show");

    console.log(Object.fromEntries(formData.entries()));

    dispatch(updateTeacherVideo({id, formData})).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("動画が編集されませんでした。");
        setIsLoading(false);
      } else {
        console.log("success", response);
        toast.success("動画が編集されました");
        setVideoFiles([]);
        setIsLoading(false);
      }
    });
  };

  const handleDelete = () => {
    console.log("id ", id);

    var data = {
      teacher_id: teacher_id,
      id: id,
    };

    dispatch(deleteTeacherVideo({...data})).then((response) => {
      setDeleteDialog(false);
      handleRowOptionsClose();
      if (response.error) {
        console.log("error", response.error);
        toast.error("動画が削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("動画が削除されました。");
      }
    });
  };

  // delete user
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
    handleRowOptionsClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="動画を編集">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <PencilOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="動画を削除">
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
          動画を削除します
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            動画を削除してもよろしいですか？
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
          動画を編集
        </DialogTitle>
        <DialogContent sx={{}}>
          <Grid fullWidth spacing={6} sx={{ marginTop: ".5em" }}>
            <Grid item xs={12} sm={12}>
              <Typography variant="body1" sx={{ textAlign: "center", pb: 3 }}>
                ID : {id}
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs={12} sm={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={title}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      required
                      value={value}
                      label="動画名"
                      onChange={onChange}
                      placeholder="動画名"
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid> 
            <Grid container>
              <Grid item xs={12} sm={2} sx={{ pt: 2, pb: 2 }}>
                <FormLabel required component="legend">
                  タイプ
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup 
                    {...field} row>
                      <FormControlLabel
                        value="youtube"
                        label="YouTube"
                        sx={null}
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="own"
                        label="ファイル"
                        sx={null}
                        control={<Radio />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.type && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            {type === "youtube" && (
              <Grid container>
                <Grid item xs={12} sm={12} sx={{ pt: 2, pb: 2 }}>
                  <FormLabel required component="legend">
                    YouTube URL
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        className="handle-url"
                        rows={3}
                        multiline
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="ここにYouTubeのURLを入力してください"
                        error={Boolean(errors.url)}
                      />
                    )}
                  />
                  {errors.url && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.url.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            )}

            {type === "own" && (
              <Grid container>
                <Grid item xs={12} sm={12} sx={{ pt: 2, pb: 2 }}>
                  <FormLabel required component="legend">
                    ファイル
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <SingleFileUpload
                    setVideoFiles={setVideoFiles}
                    videoUrl={urlUpload ? `${BASE_URL_API}v1/public/resources/teacher-videos/${urlUpload}` : null}
                    setValue={setValue}
                    trigger={trigger}
                    error={Boolean(errors.videoFiles)}
                  />
                  {errors.videoFiles && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.videoFiles.message}
                    </FormHelperText>
                  )}
                  {/* {console.log('Video URL:', urlUpload ? `${urlUpload}` : null)} */}
                </Grid>
                <Typography sx={{ mt: 4 }} component="p" variant="caption">
                  動画はMP4形式で、300MB以内
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid container sx={{ mt: 3, justifyContent: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              sx={{ m: 3 }}
            >
              編集
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              disabled={isLoading}
              sx={{ m: 3 }}
            >
              キャンセル
            </Button>
          </Grid>
          <Box className="wrapper-value-modal" style={{ padding: "10px" }}>
            <Box className="wrapper-text-modal">
              <Typography className="text-modal">
                {isLoading && (
                  <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
                    アップロード中…
                  </p>
                )}
              </Typography>
            </Box>
          </Box>
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
    minWidth: 250,
    field: "title",
    headerName: "タイトル",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.title}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "url",
    minWidth: 150,
    headerName: "url",
    headerAlign: "center",
    renderCell: ({ row }) => {
      const video = row.type === "youtube" ? row.url : BASE_URL_API + "v1/public/resources/teacher-videos/"+row.url;
      return (
        <a target="_blank" href={video} passHref rel="noopener noreferrer">
          <Typography variant="body2">{row.url}</Typography>
        </a>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "type",
    headerName: "タイプ",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">
        {
        row?.type === "youtube" ? "YouTube" :
        row?.type === "own" ? "動画" :
        row?.type
        }
      </Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 155,
    headerName: "登録日",
    field: "created_at",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" sx={{textAlign: "center"}}>
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} title={row.title} typ={row.type} url={row.url} teacher_id={row.teacher_id}  data={row}/>,
  },
];

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TeacherVideosList = ({ data }) => {
  
  // ** State
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const dispatch = useDispatch();
  const store = useSelector((state) => state.teacher_video);
  const [addTeacherVideoOpen, setAddTeacherVideoOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchData(dataResponse.id)
    );
  }, [dispatch]);

  const toggleAddTeacherVideo = () => setAddTeacherVideoOpen(!addTeacherVideoOpen);

  if (store) {
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
              <Typography sx={{ mr: 6, mb: 2 }} variant="h5">動画一覧</Typography>
              <Button sx={{ mb: 2 }}  onClick={toggleAddTeacherVideo} variant="contained">
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
              sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              alignCenter
            />
          </Card>
        </Grid>
        <SidebarAddTeacherVideo data={dataResponse} open={addTeacherVideoOpen} toggle={toggleAddTeacherVideo} />
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">動画一覧</Typography>
            </Box>
            <Box sx={{ p: 5, pb: 1, mb: 20 }}>
              <Typography variant="body1">動画の登録はありません</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  }
};

export default TeacherVideosList;

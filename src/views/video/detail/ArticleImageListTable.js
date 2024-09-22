// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
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
import ContentCopy from  "mdi-material-ui/ContentCopy";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";
// ** Actions Imports
import { deleteInvoice } from "src/store/apps/invoice";

import { useRouter } from 'next/router'

import {
  fetchData,
  deleteArticleImage,
  updateArticleImage,
} from "src/store/apps/article_image";

import axios from "axios";
import toast from "react-hot-toast";

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

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const RowOptions = ({ id, article_id, imgSrc }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [updateImgSrc, setUpdateImgSrc] = useState("");
  const [articleImageId, setArticleImageId] = useState(null);
  const [caption, setCaption] = useState(null);
  const [adminCreatedId, setAdminCreatedId] = useState(null);
  const adminId = window.sessionStorage.getItem("id");
  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    console.log("id ", id);
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(
      BASE_URL_API + "v1/articles_image/" + id,
      header
    );
    setArticleImageId(response.data.data.id);
    imageWithAuth(response.data.data.image);
    setCaption(response.data.data.caption);
    setAdminCreatedId(response.data.data.admin_created_id);
    setOpenEdit(true);
  };
   const handleEditClose = () => {
     console.log("id ", id);

     const request = {
       id: id,
       article_id: article_id,
       image: updateImgSrc,
       caption: caption,
       admin_created_id: adminCreatedId,
       admin_updated_id: parseInt(adminId),
     };
     dispatch(updateArticleImage(request));
     setOpenEdit(false);
   };
  const handleEditSubmit = () => {
    console.log("id ", id);

    const request = {
      id: id,
      article_id: article_id,
      image: updateImgSrc,
      caption: caption,
      admin_created_id: adminCreatedId,
      admin_updated_id: parseInt(adminId),
    };
    dispatch(updateArticleImage(request)).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("画像が編集されました。");
      } else {
        console.log("success", response);
        toast.success("画像が編集されませんでした。");
      }
    });
  };

  const onChangeUpdateImage = (file) => {
    console.log("onchangeupdate ", file);
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setUpdateImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };
  const imageWithAuth = async (image) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };
    const response = await axios.get(
      BASE_URL_API + "v1/resources?type=article_images&filename=" +
        image,
      header
    );
    const fileReader = new FileReader();
    fileReader.readAsDataURL(response.data);
    fileReader.onloadend = function () {
      setUpdateImgSrc(fileReader.result);
    };
  };
  // ** Var
  const open = Boolean(anchorEl);

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const onChangeCaption = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setCaption(e.target.value);
    console.log(e.target.value);
  };

  const handleDelete = () => {
    var data = {
      article_id: article_id,
      id: id,
    };
    console.log(data);
    dispatch(deleteArticleImage(data)).then((response) => {
      setDeleteDialog(false);
      handleRowOptionsClose();
      if (response.error) {
        console.log("error", response.error);
        toast.error("画像が削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("画像が削除されました。");
      }
    });
  };

  // delete article
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="コピー">
          <IconButton size="small" onClick={() => {navigator.clipboard.writeText(BASE_URL_API + 'v1/public/resources?type=article_images&filename='+imgSrc); toast.success("リンクがコーピしました。");}}>
            <ContentCopy />
          </IconButton>
        </Tooltip>
        <Tooltip title="キャプションを編集">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <PencilOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="キャプションを編集">
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
          画像を削除します
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            画像を削除してもよろしいですか？
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
          "& .MuiPaper-root": { width: "100%", maxWidth: 650, p: [2, 5] },
        }}
        aria-describedby="user-view-edit-description"
      >
        <DialogTitle
          sx={{ textAlign: "center", fontSize: "1.2rem !important", p: 0 }}
        >
          画像キャプション
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ textAlign: "center", pb: 3 }}>
            ID : {articleImageId}
          </Typography>
          <Box>
            <ImgStyled
              src={updateImgSrc}
              alt="News Pic"
              sx={{ maxWidth: "100%" }}
            />
          </Box>
          <ButtonStyled component="label" variant="outlined">
            画像を選択
            <input
              hidden
              type="file"
              onChange={onChangeUpdateImage}
              accept="image/png, image/jpeg"
            />
          </ButtonStyled>
          <TextField
            fullWidth
            placeholder="キャプション"
            value={caption}
            onChange={onChangeCaption}
          />
          <Grid container sx={{ mt: 3, justifyContent: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={handleEditSubmit}
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
    field: "id",
    minWidth: 90,
    headerName: "ID",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <Typography variant="body2">{row.id}</Typography>,
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: "image",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      const [rowImgSrc, setRowImgSrc] = useState("");

      useEffect(() => {
        imageWithAuth(row.image);
      }, [row]);

      const imageWithAuth = async (image) => {
        const token = window.sessionStorage.getItem("token");
        const header = {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        };
        const response = await axios.get(
          BASE_URL_API + "v1/resources?type=article_images&filename=" +
            image,
          header
        );
        const fileReader = new FileReader();
        fileReader.readAsDataURL(response.data);
        fileReader.onloadend = function () {
          setRowImgSrc(fileReader.result);
        };
      };
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img height={70} src={rowImgSrc} />
        </Box>
      );
    },
  },
  {
    flex: 0.3,
    field: "caption",
    minWidth: 180,
    headerName: "キャプション",
    headerAlign: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.caption}</Typography>
    ),
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
      <RowOptions id={row.id} article_id={row.article.id} imgSrc={row.image} />
    ),
  },
];

const ArticleImageListTable = ({ article_id }) => {
  // ** State
  const [pageSize, setPageSize] = useState(7);

  const dispatch = useDispatch();
  const router = useRouter()
  const store = useSelector((state) => state.article_image);
  console.log("store ", store);
  useEffect(() => {
    dispatch(fetchData(article_id)).unwrap()
    .then((originalPromiseResult) => {
      // handle result here
    })
    .catch((rejectedValueOrSerializedError) => {
      const rejected = rejectedValueOrSerializedError.message
      console.log("rejected : ", rejected.toString())
    });
  }, []);

  return (
    <Card>
      <CardHeader
        title="画像一覧"
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
        className="tableWithImage"
        rowHeight={90}
        autoHeight
        columns={columns}
        rows={store.data}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
        components={{
          NoRowsOverlay: () => <Typography sx={{display: "flex!important", justifyContent: "center", alignItems: "center", height: "100%"}} variant="body2">登録はありません</Typography>,
        }}
      />
    </Card>
  );
};

export default ArticleImageListTable;

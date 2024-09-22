// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";
import Head from "next/head"

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
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

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchData, deleteArticle } from "src/store/apps/article";

// ** Custom Components Imports
import TableHeader from "src/views/video/list/TableHeader";
import SidebarAddArticle from "src/views/video/list/AddArticle";
import axios from "axios";
import toast from "react-hot-toast";

import { useRouter } from 'next/router'

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
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

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteArticle(id))
      .then((response) => {
        setDeleteDialog(false);
        handleRowOptionsClose();
        if (response.error) {
          console.log("error", response.error);
          toast.error("記事が削除されませんでした。");
        } else {
          console.log("success", response);
          toast.success("記事が削除されました。");
        }
      })
  };

  // delete article
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
    handleRowOptionsClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem sx={{ p: 0 }}>
          <Link href={`/article/general/detail/${id}`} passHref>
            <MenuItemLink>
              <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              詳細
            </MenuItemLink>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleDeleteClickOpen}>
          <DeleteOutline fontSize="small" sx={{ mr: 2 }} />
          削除
        </MenuItem>
      </Menu>

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
          記事を削除します
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            記事を削除してもよろしいですか？
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
    </>
  );
};

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
    minWidth: 180,
    field: "image",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      const [imgSrc, setImgSrc] = useState();

      useEffect(() => {
        imageWithAuth(row.image);
      }, []);

      const imageWithAuth = async (image) => {
        const token = window.sessionStorage.getItem("token");
        const header = {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        };
        const response = await axios.get(
          BASE_URL_API + "v1/resources?type=articles&filename=" +
          image,
          header
        );
        const fileReader = new FileReader();
        fileReader.readAsDataURL(response.data);
        fileReader.onloadend = function () {
          setImgSrc(fileReader.result);
        };
      };

      return (
        <Box
          sx={{
            pb: "70px",
            width: "133.7px",
            height: 0,
            position: "relative",
          }}
        >
          <ImgAbsolute
            src={
              imgSrc
                ? imgSrc
                : (BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')
            }
            alt="Article image"
            onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
          />
        </Box>
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
    field: "date",
    minWidth: 150,
    headerName: "作成日",
    headerAlign: "center",
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
    minWidth: 90,
    field: "public",
    headerName: "状態",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.public_access == "yes" ? "公開" : "非公開"}
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
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
];

const ArticleList = (props) => {
  const meta = props.meta
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [addArticleOpen, setAddArticleOpen] = useState(false);

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter()
  const store = useSelector((state) => state.article.article);
  store = store.data.filter(
    (filter) =>
      filter.title.toLowerCase().includes(value.toLowerCase())
  );
  useEffect(() => {
    dispatch(
      fetchData()
    ).unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected : ", rejected.toString())
      });
  }, [dispatch, value]);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);


  const toggleAddArticle = () => setAddArticleOpen(!addArticleOpen);

  return (
    <Grid container spacing={6}>
      <>
        <Head>
          {/* <!-- Primary Meta Tags --> */}
          <title>{meta.title}</title>
          <meta name="title" content={meta.title} key="title" />
          <meta name="description" content={meta.description} key="description" />

          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content={meta.type} key="og:type" />
          <meta property="og:url" content={meta.url} key="og:url" />
          <meta property="og:title" content={meta.title} key="og:title" />
          <meta property="og:description" content={meta.description} key="og:description" />
          <meta property="og:image" content={meta.image} key="og:image" />
          <meta property="og:keywords" content={meta.keywords} key="og:keywords" />

          {/* <!-- Twitter --> */}
          <meta property="twitter:card" content={meta.card} key="twitter:card" />
          <meta property="twitter:url" content={meta.url} key="twitter:url" />
          <meta property="twitter:title" content={meta.title} key="twitter:url" />
          <meta property="twitter:description" content={meta.description} key="twitter:description" />
          <meta property="twitter:image" content={meta.image} key="twitter:image" />
          <meta property="twitter:keywords" content={meta.keywords} key="twitter:keywords" />
        </Head>
      </>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">動画一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddArticle}
          />
          <DataGrid
            className="tableWithImage"
            rowHeight={90}
            autoHeight
            rows={store}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>

      <SidebarAddArticle open={addArticleOpen} toggle={toggleAddArticle} />
    </Grid>
  );
};

export default ArticleList;

export const getServerSideProps = async () => {
  let photo = null;
  await fetch('https://jsonplaceholder.typicode.com/photos/2')
    .then((response) => response.json())
    .then((json) => {
      photo = json
    })

  const meta = {
    "title": "動画一覧 | ",
    "url": "",
    "card": "summary_large_image",
    "description": "",
    "keywords": "",
    "image": "",
    "type": "website"
  }

  return {
    props: {
      meta,
    },
  };
};
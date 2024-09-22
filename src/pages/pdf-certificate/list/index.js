// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";

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
import { fetchData, deleteCollection } from "src/store/apps/collection";

// ** Custom Components Imports
import TableHeader from "src/views/pdf-certificate/list/TableHeader";

// ** Third Party Components
import toast from 'react-hot-toast'

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
    dispatch(deleteCollection(id))
    .then((response) => {
        setDeleteDialog(false);
        handleRowOptionsClose();
        if (response.error) {
          console.log("error", response.error);
          toast.error("コレクションが削除されませんでした。");
        } else {
          console.log("success", response);
          toast.success("コレクションが削除されました。");
        }
      })
  };

  // delete collection
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
          <Link href={`/collection/detail/${id}`} passHref>
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
          コレクション削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            このコレクションを削除してもよろしいですか？
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
    headerName: "名前",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    field: "items",
    minWidth: 150,
    headerName: "作品数",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.total_assets}</Typography>;
    },
  },
  {
    flex: 0.1,
    field: "owner",
    minWidth: 150,
    headerName: "所有者",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.owner.username}</Typography>;
    },
  },
  {
    flex: 0.06,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
];

const CollectionList = () => {
  // ** State
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [addUserOpen, setAddUserOpen] = useState(false);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.collection);
  const router = useRouter()
  // for filtering search
  store = store.data.filter(
    (filter) =>
      filter.name.toLowerCase().includes(value.toLowerCase()) ||
      filter.description.toLowerCase().includes(value.toLowerCase())
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

  const handleRoleChange = useCallback((e) => {
    console.log("select role");
    const selectedRole = e.target.value;
    if (selectedRole == "all") {
      setRole();
    } else {
      setRole(selectedRole);
    }
  }, []);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">証明書発行一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
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
    </Grid>
  );
};

export default CollectionList;

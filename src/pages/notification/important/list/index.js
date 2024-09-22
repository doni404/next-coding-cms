// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";
import { useRouter } from 'next/router'

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
import { fetchData, deleteMailSend } from "src/store/apps/mail_send";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";

// ** Custom Components Imports
import TableHeader from "src/views/notification/important/list/TableHeader";
import SidebarAddMessage from "src/views/notification/important/list/AddMessage";

import axios from 'axios'
import toast from "react-hot-toast";

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const colors = {
  read: "secondary",
  unread: "warning",
};

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + '年' + date[1] + '月' + date[2] + '日'
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

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

  // delete mail send
  const handleDelete = () => {
    console.log("id ", id);
    dispatch(deleteMailSend(id))
    .then((response) => {
        setDeleteDialog(false);
        handleRowOptionsClose();
        if (response.error) {
          console.log("error", response.error);
          toast.error("Delete was error");
        } else {
          console.log("success", response);
          toast.success("ニュースが削除されました。");
        }
      })
  };

  // delete mail send
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false)
    handleRowOptionsClose();
  }

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
          <Link href={`/notification/important/detail/${id}`} passHref>
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
          重要メール削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            選択の重要メールを削除してもよろしいですか？
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
    field: "subject",
    headerName: "件名",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.subject}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 80,
    field: "total_send",
    headerName: "受信機数",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.total_send}
        </Typography>
      );
    },
  },
  {
    flex: 0.08,
    field: "recipient",
    minWidth: 200,
    headerName: "受信者",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">
        {row.target === "individual" ? "個別" : row.target === "seller" ? "一括 (売り手)" : row.target === "buyer" ? "一括 (買い手)" : row.target === "all" ?  "一括 (全て)" : "-"}
        </Typography>;
    },
  },
  {
    flex: 0.1,
    field: "date",
    minWidth: 250,
    headerName: "作成日",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{dateFormater(row.create_at)} {timeFormater(row.create_at)}</Typography>;
    },
  },
  {
    flex: 0.08,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
];

const MailSendsList = () => {
  // ** State
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [addMailSendOpen, setAddMailSendOpen] = useState(false);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.mail_send);
  const router = useRouter()
  store = store.data.filter(
    (filter) =>
      filter.subject.toLowerCase().includes(value.toLowerCase())
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
  }, [dispatch,value])

  const handleFilter = useCallback((val) => {
    // console.log('val ',val)
    setValue(val);
  }, []);

  const toggleMailSend = () => setAddMailSendOpen(!addMailSendOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">重要メール一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleMailSend}
          />
          <DataGrid
            autoHeight
            rows={store}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onSelectionModelChange={(rows) => setSelectedRows(rows)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>

      <SidebarAddMessage open={addMailSendOpen} toggle={toggleMailSend} />
    </Grid>
  );
};

export default MailSendsList;

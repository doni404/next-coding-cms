// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
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
import Box from "@mui/material/Box";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchMessage, deleteMessage } from "src/store/apps/notification";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";

// ** Custom Components Imports
import TableHeader from "src/views/notification/message/list/TableHeader";
import SidebarAddMessage from "src/views/notification/message/list/AddMessage";

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
  broadcast: "primary",
  paid: "success",
  sold: "warning",
};

const labelType = {
  broadcast: "broadcast",
  paid: "支払済",
  sold: "sold",
};

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
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

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  // delete article
  const [deleteDialog, setDeleteDialog] = useState(false);
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
    handleRowOptionsClose();
  };
  const handleDelete = () => {
    dispatch(deleteMessage(id));
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
          <Link href={`/notification/message/detail/${id}`} passHref>
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
          メッセージ削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            選択のメッセージを削除してもよろしいですか？
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
    flex: 0.12,
    field: "date",
    minWidth: 150,
    headerName: "送信日",
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
    flex: 0.08,
    field: "type",
    minWidth: 110,
    headerName: "種類",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <CustomChip
          size="small"
          skin="light"
          color={colors[row.type]}
          label={labelType[row.type]}
          sx={{
            "& .MuiChip-label": { textTransform: "capitalize" },
            "&:not(:last-of-type)": { mr: 3 },
          }}
        />
      );
      // <Typography variant="body2">{row.type}</Typography>;
    },
  },
  {
    flex: 0.08,
    field: "sent",
    minWidth: 110,
    headerName: "送信数",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.total_recipient}</Typography>;
    },
  },
  {
    flex: 0.08,
    field: "read",
    minWidth: 110,
    headerName: "既読数",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.total_read}</Typography>;
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

const MessageList = () => {
  // ** State
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [addUserOpen, setAddUserOpen] = useState(false);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.notification);
  store = store.data.filter(
    (filter) => filter.subject.includes(value)
  )
  useEffect(() => {
    dispatch(
      fetchMessage()
    );
  }, [dispatch, value]);
  console.log("message data is ", store);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">メッセージ一覧</Typography>
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
            onSelectionModelChange={(rows) => setSelectedRows(rows)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>

      <SidebarAddMessage open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default MessageList;

// ** React Imports
import { useState, useCallback, useEffect } from "react";

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
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import Laptop from "mdi-material-ui/Laptop";
import ChartDonut from "mdi-material-ui/ChartDonut";
import CogOutline from "mdi-material-ui/CogOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import { fetchData,deleteAdmin } from "src/store/apps/admin";

// ** Custom Components Imports
import TableHeader from "src/views/admin/list/TableHeader";
import AddAdminDrawer from "src/views/admin/list/AddAdminDrawer";

import axios from "axios";
import toast from "react-hot-toast";

import { useRouter } from 'next/router'

// ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(3),
}));

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  marginRight: theme.spacing(3),
}));

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
  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={`/admin/detail/${id}`} passHref>
        <Tooltip title="詳細">
          <IconButton size="small">
            <EyeOutline/>
          </IconButton>
        </Tooltip>
      </Link>
    </Box>
    </>
  );
};

const columns = [
  {
    flex: 0.05,
    minWidth: 80,
    field: "id",
    headerName: "id",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.id}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    maxWidth: 60,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: "name",
    headerName: "名前",
    renderCell: ({ row }) => {
      const { id, name } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Link href={`/admin/detail/${id}`} passHref>
              <Typography
                noWrap
                component="a"
                variant="subtitle2"
                sx={{ color: "text.primary", textDecoration: "none" }}
              >
                {name} 
              </Typography>
            </Link>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: "admin_role",
    headerName: "管理者の役割",
    valueGetter: (params) => params.row?.admin_role?.name_ja,
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.admin_role?.name_ja}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: "email",
    headerName: "Eメール",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.email}
        </Typography>
      );
    },
  },
];

const UserList = () => {
  // ** State
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [dataResponse, setDataResponse] = useState();

  const router = useRouter()

  const handleFilter = useCallback((val) => {
    setValue(val)
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

  const dispatch = useDispatch()
  const store = useSelector(state => state.admin)
  store = store.data.filter(
    (filter) =>
      filter.name.toLowerCase().includes(value.toLowerCase()) ||
      filter.email.toLowerCase().includes(value.toLowerCase())
  );
  useEffect(() => {
   dispatch(fetchData()).unwrap()
   .then((originalPromiseResult) => {
     // handle result here
   })
   .catch((rejectedValueOrSerializedError) => {
     const rejected = rejectedValueOrSerializedError.message
     console.log("rejected : ",rejected.toString())
   });
  }, [dispatch,value])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">管理者一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            rows={store}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 50, 100]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddAdminDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default UserList;

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
import Button from "@mui/material/Button";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchData } from "src/store/apps/order";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import TableHeader from "src/views/order-history/list/TableHeader";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

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
  auction: "info",
  normal: "primary",
};

const CurrencyIcon = styled("img")(({ theme }) => ({
  width: "auto",
  height: "13px",
  marginRight: "7px",
}));

function ParseFloat(str, val) {
  str = String(str);
  str = str.slice(0, str.indexOf(".") + val + 1);
  return Number(str);
}

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length);
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
          <Link href={`/order/detail/${id}`} passHref>
            <MenuItemLink>
              <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              詳細
            </MenuItemLink>
          </Link>
        </MenuItem>
      </Menu>
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
    flex: 0.05,
    minWidth: 80,
    field: "method",
    headerName: "方式",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <CustomAvatar
          skin="light"
          color={colors[row.sales_type]}
          variant="rounded"
          sx={{
            mr: 1.5,
            width: 65,
            height: 24,
            fontSize: "0.75rem",
            borderRadius: "6px",
            color: "text.primary",
          }}
        >
          {row.sales_type == "normal" ? "通常" : "競売"}
        </CustomAvatar>
      );
    },
  },
  {
    flex: 0.15,
    field: "date",
    minWidth: 220,
    headerName: "注文日",
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
    flex: 0.15,
    minWidth: 150,
    field: "order",
    headerName: "注文者",
    headerAlign: "center",
    renderCell: ({ row }) => {
      if (row.sales_type == "normal") {
        return (
          <Typography noWrap variant="body2">
            {`${row.to.username} (${row.to.metamask_address})`}
          </Typography>
        );
      } else {
        return (
          <Typography noWrap variant="body2">
            {`${row.winner.username} (${row.winner.metamask_address})`}
          </Typography>
        );
      }
    },
  },
  {
    flex: 0.15,
    minWidth: 200,
    field: "sold",
    headerName: "販売者",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {`${row.from.username} (${row.from.metamask_address})`}
        </Typography>
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 120,
    field: "quantity",
    headerName: "数量",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.quantity}
        </Typography>
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 120,
    field: "price",
    headerName: "総額",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography
          noWrap
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CurrencyIcon src="/images/eth.png" alt="icon" />
          {row.total_price}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
];

const OrderList = () => {
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.order);
  store = store.data.filter(
    (filter) =>
      filter.transaction_hash.toLowerCase().includes(value.toLowerCase()) ||
      filter.total_price.toString().includes(value.toString())
  );
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch, value]);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  console.log("store", store);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">売上管理一覧</Typography>
          </Box>
          <TableHeader value={value} handleFilter={handleFilter} />
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

export default OrderList;

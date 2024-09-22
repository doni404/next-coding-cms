// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchData } from "src/store/apps/timezones";

// ** Custom Components Imports
import TableHeader from "src/views/settings/timezones/list/TableHeader";
import toast from "react-hot-toast";
import { max, min } from "date-fns";


export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const RowOptions = ({ id }) => {
  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={`/student/detail/${id}`} passHref>
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
    minWidth: 60,
    field: "id",
    headerName: "ID",
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
  // {
  //   flex: 0.1,
  //   maxWidth: 60,
  //   sortable: false,
  //   field: "actions",
  //   headerName: "",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => <RowOptions id={row.code} />,
  // },
  {
    flex: 0.1,
    minWidth: 100,
    field: "gmt_code",
    headerName: "GMTコード",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.gmt_code}
        </Typography>
      );
    },
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: "name",
    headerName: "タイムゾーン名",
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
    flex: 0.2,
    minWidth: 150,
    field: "name_en",
    headerName: "タイムゾーン名（英語）",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name_en}
        </Typography>
      );
    },
  },
];

const TimezoneList = () => {
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [data, setData] = useState(data);

  // search account data by email, username, bio, metamask address
  const dispatch = useDispatch();
  const store = useSelector((state) => state.timezones);

  data = store.data.filter(
    (filter) =>
      (filter.gmt_code.toLowerCase().includes(value.toLowerCase()) ||
      filter.name.toLowerCase().includes(value.toLowerCase()) ||
      filter.name_en.toLowerCase().includes(value.toLowerCase()))
  );

  useEffect(() => {
    dispatch(fetchData()).unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected", rejected);
      });
  }, [dispatch]);

  const rows = data.map((row) => {
    return {
      ...row,
    };
  });

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">タイムゾーン一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
          />
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 50, 100]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 }, overflowX: 'scroll'}}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default TimezoneList;

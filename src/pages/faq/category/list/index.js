// ** React Imports
import { useState, useEffect, useCallback } from "react";

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
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchData, deleteFaqsCategory } from "src/store/apps/faq_category";

// ** Custom Components Imports
import TableHeader from "src/views/faq/category/list/TableHeader";
import SidebarAddFaqsCategory from "src/views/faq/category/list/AddFaqsCategory";

import axios from 'axios'
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
  date = date[0] + '年' + date[1] + '月' + date[2] + '日'
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

const RowOptions = ({ id,faqsId }) => {
  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={`/faq/category/detail/${id}`} passHref>
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
    flex: 0.1,
    maxWidth: 60,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} faqsId={row.faqs_id} />,
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
          {row.title}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: "total_faq",
    headerName: "FAQ合計",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.total_faq}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "created_at",
    minWidth: 150,
    headerName: "作成日",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography variant="body2">
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
];

const FaqsListCategory = () => {
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [addFaqsOpenCategory, setAddFaqsOpenCategory] = useState(false);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.faq_category);
  const router = useRouter()
  
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
      if (rejected.toString().includes('403') || rejected.toString().includes('401')) {
        router.replace("/401");
      }
    });
  }, [dispatch,value])

  const handleFilter = useCallback((val) => {
    // console.log('val ',val)
    setValue(val);
  }, []);

  const toggleAddFaqsCategory = () => setAddFaqsOpenCategory(!addFaqsOpenCategory);


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">FAQカテゴリー一覧</Typography>
          </Box>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddFaqsCategory}
          />
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            className="tableWithImage"
            rowHeight={90}
            autoHeight
            rows={store}
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
      <SidebarAddFaqsCategory open={addFaqsOpenCategory} toggle={toggleAddFaqsCategory} />
    </Grid>
  );
};

export default FaqsListCategory;

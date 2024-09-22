// ** React Imports
import { useState, useEffect, useCallback, useRef } from "react";

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
import { useRowSelection } from 'src/helper/useRowSelection';

// ** Actions Imports
import { fetchData, deleteCourses } from "src/store/apps/course";

// ** Custom Components Imports
import TableHeader from "src/views/course/list/TableHeader";
import SidebarAddCourse from "src/views/course/list/AddCourse";

import toast from "react-hot-toast";
import { courseTypeList } from "src/components/course-static-data";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const RowOptions = ({ id }) => {
  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={`/course/detail/${id}`} passHref>
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
        <Typography noWrap variant="body2" aligncenter="true">
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
    minWidth: 250,
    field: "course_category",
    headerName: "カテゴリー",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.course_category?.name_ja}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: "name_ja",
    headerName: "コース名",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name_ja}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: "type",
    headerName: "タイプ",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.type}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: "name_fr",
    headerName: "コース名（仏語）",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name_fr}
        </Typography>
      );
    },
  },
  // {
  //   flex: 0.2,
  //   minWidth: 120,
  //   field: "code",
  //   headerName: "識別コード",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap variant="body2">
  //         {row.code}
  //       </Typography>
  //     );
  //   },
  // },
  {
    flex: 0.2,
    minWidth: 120,
    field: "lesson_time",
    headerName: "レッスン時間",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.lesson_time}分
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: "credit",
    headerName: "クレジット数",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.credit}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: "price_unit",
    headerName: "レッスン単価",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.price_unit}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: "price",
    headerName: "月謝",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.price}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 120,
    field: "paypal_fee",
    headerName: "ペイパル手数料",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.paypal_fee}
        </Typography>
      );
    },
  },
];

const CourseList = () => {
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [addCoursesOpen, setAddCoursesOpen] = useState(false);
  const { selectedRows, handleRowClick } = useRowSelection();

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(
      fetchData(value)
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

  const rows = store.data.map((row) => ({
    ...row,
    type: courseTypeList[row.type] || "-",
  }));

  const handleFormSubmit = (formData) => {
    // Prepare filter data
    let dataFilter = {}

    // Filter parameter which have a value
    const activeParams = Object.keys(formData).filter(key => formData[key])
    activeParams.map(param => dataFilter[param] = formData[param])
    setValue(dataFilter);
    toast.success("コースを見つけました。");
  };

  const toggleAddCourses = () => setAddCoursesOpen(!addCoursesOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">コース一覧</Typography>
          </Box>
          <TableHeader
            onSubmit={handleFormSubmit}
            toggle={toggleAddCourses}
          />
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            className="tableWithImage"
            rowHeight={90}
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 50, 100]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 }, userSelect: 'none'  }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            aligncenter
            checkboxSelection={false}
            selectionModel={selectedRows}
            onRowClick={(params, event) => handleRowClick(params, event, store)}
          />
        </Card>
      </Grid>
      <SidebarAddCourse open={addCoursesOpen} toggle={toggleAddCourses} />
    </Grid>
  );
};

export default CourseList;

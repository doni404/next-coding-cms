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
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchData } from "src/store/apps/student";

import { useRouter } from "next/router";

// ** Custom Components Imports
import TableHeader from "src/views/student/list/TableHeader";
import AddStudentDrawer from "src/views/student/list/AddStudentDrawer";
import {schoolStatusList, schoolStatusColorList} from "src/components/student-static-data";
import toast from "react-hot-toast";

export function textToFullWidth(str) {
  return str.split('').map(char => {
      const code = char.charCodeAt(0)
      return (code >= 33 && code <= 126) ? String.fromCharCode(code + 65248) : char
  }).join('')
}

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
    minWidth: 80,
    field: "id",
    headerName: "会員番号",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" alignCenter>
          {row.code}
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
    renderCell: ({ row }) => <RowOptions id={row.code} />,
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: "student_name",
    headerName: "氏名（漢字)",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
              <Typography
                noWrap
                component="a"
                variant="subtitle2"
                sx={{ color: "text.primary", textDecoration: "none" }}
              >
                {textToFullWidth(row.student_name)}
              </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "phone",
    headerName: "電話番号",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.phone}
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
  {
    flex: 0.2,
    minWidth: 150,
    field: "school_status",
    headerName: "学校の状態",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" style={{ color: schoolStatusColorList[row.school_status]}}>
          {row.school_status_jp}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "skype_name",
    headerName: "スカイプ名",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.skype_name}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    headerName: "残クレジット",
    field: "total_credit",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.total_credit}
        </Typography>
      );
    },
  },
];

const StudentList = () => {
  // ** State
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  // search account data by email, username, bio, metamask address
  const dispatch = useDispatch();
  const store = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchData(value))
      .unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected", rejected);
      });
  }, [dispatch, value]);

  const rows = store.data.map((row) => {
    return {
      ...row,
      student_name: (row.name || ""),
      school_status_jp: schoolStatusList[row.school_status] || "-",
      skype_name: (row.skype_name || "-"),

    };
  });

  const handleFormSubmit = (formData) => {
    // Prepare filter data
    let dataFilter = {}

    // Filter parameter which have a value
    const activeParams = Object.keys(formData).filter(key => formData[key])
    activeParams.map(param => dataFilter[param] = formData[param])
    setValue(dataFilter);
    toast.success("生徒を見つけました。");
  };

  const toggleAddStudentDrawer = () => setAddStudentOpen(!addStudentOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">生徒一覧</Typography>
          </Box>
          <TableHeader
            onSubmit={handleFormSubmit}
            toggle={toggleAddStudentDrawer}
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

      <AddStudentDrawer open={addStudentOpen} toggle={toggleAddStudentDrawer} />
    </Grid>
  );
};

export default StudentList;

// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Import
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Imports
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
import { fetchData } from "src/store/apps/teacher";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import TableHeader from "src/views/teacher/list/TableHeader";
import AddTeacher from "src/views/teacher/list/AddTeacher";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

export function textToFullWidth(str) {
  return str.split('').map(char => {
      const code = char.charCodeAt(0)
      return (code >= 33 && code <= 126) ? String.fromCharCode(code + 65248) : char
  }).join('')
}

// ** renders client column
const renderClient = (row) => {
  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    imageWithAuth(row.profile_image);
  }, []);
  const imageWithAuth = async (profile_image) => {
    const header = {responseType: "blob"};
    const response = await axiosInstance.get(BASE_URL_API + "v1/public/resources/teachers/" + profile_image, header);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(response.data);
    fileReader.onloadend = function () {
      if (fileReader.result == null) {
        setImgSrc("/images/avatars/1.png");
      } else {
        setImgSrc(fileReader.result);
      }
    };
  };

  if (row.profile_image != "") {
    return (
        <CustomAvatar src={imgSrc} sx={{ mr: 3, width: 34, height: 34 }} />
    );
  } else {
    return (
        <CustomAvatar
          src="/images/avatars/1.png"
          sx={{ mr: 3, width: 34, height: 34 }}
        />
    );
  }
};

const RowOptions = ({ id }) => {
  return (
    <>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Link href={`/teacher/detail/${id}`} passHref>
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
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
  {
    flex: 0.15,
    minWidth: 210,
    field: "name",
    headerName: "講師名",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderClient(row)}
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
                {textToFullWidth(row.name)}
              </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 120,
    field: "skype_name",
    headerName: "スカイプ名",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.skype_name}
        </Typography>
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 250,
    field: "email",
    headerName: "Eメール",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.email}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    field: "situation",
    minWidth: 120,
    headerName: "状態",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.situation}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    field: "trial_availability",
    minWidth: 90,
    headerName: "無料体験対応",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.trial_availability}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    field: "show_public",
    minWidth: 90,
    headerName: "表示",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.show_public}
        </Typography>
      );
    },
  },
];

const TeacherList = () => {
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.teacher);

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

  const rows = store.data.map((row) => ({
    ...row,
    name: (row.name || ''),
    situation: (row.situation === 'active' ? 'ログイン可' : row.situation === 'inactive' ? 'ログイン不可' : '' ),
    trial_availability: (row.trial_availability === 'yes' ? '対応可' : row.trial_availability === 'no' ? '対応不可' : '' ),
    show_public: (row.show_public === 'yes' ? '表示' : row.show_public === 'no' ? '非表示' : '' ),
  }));

  const handleFormSubmit = (formData) => {
    // Prepare filter data
    let dataFilter = {}

    // Filter parameter which have a value
    const activeParams = Object.keys(formData).filter(key => formData[key])
    activeParams.map(param => dataFilter[param] = formData[param])
    console.log('dataFilter', dataFilter)
    setValue(dataFilter);
  };

  const toggleAddTeacher = () => setAddTeacherOpen(!addTeacherOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1 }}>
            <Typography variant="h5">講師一覧</Typography>
          </Box>
          <TableHeader
            onSubmit={handleFormSubmit}
            toggle={toggleAddTeacher}
          />
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 50, 100]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddTeacher open={addTeacherOpen} toggle={toggleAddTeacher} />
    </Grid>
  );
};

export default TeacherList;

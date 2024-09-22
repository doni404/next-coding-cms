// ** React Imports
import { useState, useEffect, useCallback } from "react";
import React from "react";

// ** Actions Imports
import {
  fetchData,
  deleteCoursesTeacher,
  updateCoursesTeacher,
} from "src/store/apps/course_teacher";
import SidebarAddCourseTeacher from "src/views/course/list/AddCourseTeacher";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Next Import
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";

// ** Icons Imports
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Third party Imports
import toast from "react-hot-toast";
import axios from "axios";
import { set } from "nprogress";

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

const seperatorYen = (yen) => {
  return new Intl.NumberFormat("ja-JP").format(yen);
};
// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const ImgAbsolute = styled("img")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const RowOptions = ({ id, cp, teacherRow, course, phd, pfd, ptwd, ptrd, pfrd, circuitId }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [courseTeacherId, setCourseTeacherId] = useState(null);
  const [crcuitId, setCrcuitId] = useState(null);
  const [crseId, setCrseId] = useState(course);
  const [chargePoint, setChargePoint] = useState(null);
  const [priceHalfDay, setPriceHalfDay] = useState(null);
  const [priceFullDay, setPriceFullDay] = useState(null);
  const [priceTwoDay, setPriceTwoDay] = useState(null);
  const [priceThreeDay, setPriceThreeDay] = useState(null);
  const [priceFourDay, setPriceFourDay] = useState(null);
  const [teacherData, setTeacherData] = useState([]);
  const [teacherId, setTeacherId] = useState(teacherRow);
  const [adminCreatedId, setAdminCreatedId] = useState(null);
  const adminId = window.sessionStorage.getItem("id");
  const [type, setType] = useState(course);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/cms/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("load teacher data: ", res);
        setTeacherData(res.data.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace("/401");
        }
      });
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ** Var

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    console.log("id ", id);

    setCourseTeacherId(id);
    setTeacherId(teacherRow.id);
    setChargePoint(cp);
    setCrcuitId(circuitId);
    setCrseId(course.id)
    setPriceHalfDay(phd);
    setPriceFullDay(pfd);
    setPriceTwoDay(ptwd);
    setPriceThreeDay(ptrd);
    setPriceFourDay(pfrd);
    setType(course.type);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    console.log("id ", id);

    setOpenEdit(false);
  };

  const handleEditSubmit = () => {
    const request = {
      id: id,
      course_id: course.id,
      teacher_id: teacherId,
      circuit_id: circuitId,
      charge_point: chargePoint,
      price_half_day: priceHalfDay,
      price_full_day: priceFullDay,
      price_two_day: priceTwoDay,
      price_three_day: priceThreeDay,
      price_four_day: priceFourDay,
    };
    console.log("Req : ", request)
    dispatch(updateCoursesTeacher(request)).then((response) => {
      setOpenEdit(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("インストラクターのコースが編集されました。");
      } else {
        console.log("success", response);
        toast.success("インストラクターが編集されませんでした。");
      }
    });
  };

  const handleDelete = () => {
    console.log("id ", id);

    var data = {
      course_id: course.id,
      id: id,
    };

    dispatch(deleteCoursesTeacher(data)).then((response) => {
      setDeleteDialog(false);
      handleRowOptionsClose();
      if (response.error) {
        console.log("error", response.error);
        toast.error("インストラクターが削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("インストラクターが削除されました。");
      }
    });
  };

  // delete guide
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleTeacherChange = useCallback((e) => {
    setTeacherId(e.target.value);
  }, []);

  const onChangeChargePoint = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setChargePoint(e.target.value);
    console.log(e.target.value);
  };

  const onChangePriceHalfDay = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setPriceHalfDay(e.target.value);
    console.log(e.target.value);
  };

  const onChangePriceFullDay = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setPriceFullDay(e.target.value);
    console.log(e.target.value);
  };

  const onChangePriceTwoDay = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setPriceTwoDay(e.target.value);
    console.log(e.target.value);
  };

  const onChangePriceThreeDay = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setPriceThreeDay(e.target.value);
    console.log(e.target.value);
  };

  const onChangePriceFourDay = (e) => {
    e.preventDefault();
    setOpenEdit(true);
    setPriceFourDay(e.target.value);
    console.log(e.target.value);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="キャプションを編集">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <PencilOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title="インストラクター削除">
          <IconButton size="small" onClick={handleDeleteClickOpen}>
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      </Box>

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
          インストラクターを削除します
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 5 }}
          >
            インストラクターを削除してもよろしいですか？
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

      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="user-view-edit"
        sx={{
          "& .MuiPaper-root": { width: "100%", maxWidth: 500, p: [2, 5] },
        }}
        aria-describedby="user-view-edit-description"
      >
        <DialogTitle
          sx={{ textAlign: "center", fontSize: "1.2rem !important", p: 0 }}
        >
          インストラクター
        </DialogTitle>
        <DialogContent sx={{}}>
          <Grid
            container
            spacing={6}
            sx={{ marginTop: ".5em", alignContent: "" }}
          >
            <Grid item xs={12} sm={12}>
              <Typography variant="body1" sx={{ textAlign: "center", pb: 3 }}>
                ID : {courseTeacherId}
              </Typography>
            </Grid>
            <Grid fullWidth item xs={12} sm={12}>
              <Select
                fullWidth
                placeholder="管理者の役割"
                value={teacherId}
                defaultValue={teacherId}
                labelId="teacher"
                onChange={handleTeacherChange}
              >
                {teacherData.map(({ last_name, first_name, id }, index) => (
                  <MenuItem value={id}>
                    {last_name} {first_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {type === "online" ?
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="チャージポイント"
                value={chargePoint}
                onChange={onChangeChargePoint}
              />
            </Grid> : null}

            {type === "offline" ?
            <>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="半日料金"
                label="半日料金"
                value={priceHalfDay}
                onChange={onChangePriceHalfDay}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="一日料金"
                label="一日料金"
                value={priceFullDay}
                onChange={onChangePriceFullDay}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="2日分の料金"
                label="2日分の料金"
                value={priceTwoDay}
                onChange={onChangePriceTwoDay}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="3日分の料金"
                label="3日分の料金"
                value={priceThreeDay}
                onChange={onChangePriceThreeDay}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                placeholder="4日分の料金"
                label="4日分の料金"
                value={priceFourDay}
                onChange={onChangePriceFourDay}
              />
            </Grid> </> : null }
          </Grid>
          <Grid container sx={{ mt: 3, justifyContent: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              onClick={handleEditSubmit}
              sx={{ m: 3 }}
            >
              編集
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              sx={{ m: 3 }}
            >
              キャンセル
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

const RowOptionsDetail = ({ id }) => {
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
    manWidth: 60,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptionsDetail id={row.teacher?.id} />,
  },
  {
    flex: 0.2,
    minWidth: 120,
    field: "teacher_name",
    headerName: "インストラクター名",
    headerAlign: "center",
    valueGetter: (params) => params.row.teacher?.last_name + " " + params.row.teacher?.first_name,
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.teacher ? row.teacher.last_name : ""} {row.teacher ? row.teacher.first_name : ""}
        </Typography>
      );
    },
  },
  {
    flex: 0.12,
    minWidth: 120,
    field: "email",
    headerName: "インストラクターメール",
    headerAlign: "center",
    valueGetter: (params) => params.row.teacher?.email,
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.teacher?.email}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "登録日時",
    field: "created_at",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {dateFormater(row.created_at)} {timeFormater(row.created_at)}
        </Typography>
      );
    },
  },
  // {
  //   flex: 0.15,
  //   field: "price_half_day",
  //   minWidth: 120,
  //   headerName: "半日料金",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return <Typography variant="body2">{seperatorYen(row.price_half_day)}円</Typography>;
  //   },
  // },
  // {
  //   flex: 0.15,
  //   field: "price_full_day",
  //   minWidth: 120,
  //   headerName: "一日料金",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return <Typography variant="body2">{seperatorYen(row.price_full_day)}円</Typography>;
  //   },
  // },
  // {
  //   flex: 0.15,
  //   field: "price_two_day",
  //   minWidth: 120,
  //   headerName: "2日分の料金",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return <Typography variant="body2">{seperatorYen(row.price_two_day)}円</Typography>;
  //   },
  // },
  // {
  //   flex: 0.15,
  //   field: "price_three_day",
  //   minWidth: 120,
  //   headerName: "3日分の料金",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return <Typography variant="body2">{seperatorYen(row.price_three_day)}円</Typography>;
  //   },
  // },
  // {
  //   flex: 0.15,
  //   field: "price_four_day",
  //   minWidth: 120,
  //   headerName: "4日分の料金",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return <Typography variant="body2">{seperatorYen(row.price_four_day)}円</Typography>;
  //   },
  // },
  // {
  //   flex: 0.15,
  //   minWidth: 120,
  //   headerName: "更新日時",
  //   field: "updated_at",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap variant="body2">
  //         {dateFormater(row.updated_at)} {timeFormater(row.updated_at)}
  //       </Typography>
  //     );
  //   },
  // },
  // {
  //   flex: 0.15,
  //   minWidth: 120,
  //   headerName: "登録日時",
  //   field: "created_at",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap variant="body2">
  //         {dateFormater(row.created_at)} {timeFormater(row.created_at)}
  //       </Typography>
  //     );
  //   },
  // },
  // {
  //   flex: 0.1,
  //   minWidth: 80,
  //   sortable: false,
  //   field: "actions",
  //   headerName: "",
  //   headerAlign: "center",
  //   align: "center",
  //   renderCell: ({ row }) => (
  //     <RowOptions
  //       id={row.id}
  //       cp={row.charge_point}
  //       teacherRow={row.teacher}
  //       course={row.course}
  //       phd={row.price_half_day}
  //       pfd={row.price_full_day}
  //       ptwd={row.price_two_day}
  //       ptrd={row.price_three_day}
  //       pfrd={row.price_four_day}
  //       circuitId={row.circuit_id}
  //     />
  //   ),
  // },
];

const CourseTeacher = ({data}) => {

  // ** State
  const [pageSize, setPageSize] = useState(10);
  // const [length, setLength] = useState();
  const dataResponse = data.data;
  console.log("data response : ", dataResponse)
  const dispatch = useDispatch();
  const router = useRouter();
  const store = useSelector((state) => state.courses_teacher);
  const [displayOnline, setDisplayOnline] = useState(null);
  const [displayOffline, setDisplayOffline] = useState(null);
  const [addCoursesTeacherOpen, setAddCoursesTeacherOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchData(dataResponse.id))
      .unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        if (rejected.toString().includes("401")) {
          router.replace("/401");
        }
      });
  }, [dispatch]);
  console.log("store exe : ", store);

  const toggleAddCoursesTeacher = () => setAddCoursesTeacherOpen(!addCoursesTeacherOpen);

  const isDisplay = (type) => {
    console.log("display type : ", type)
    if (type === "online"){setDisplayOnline(true);setDisplayOffline(false);}
    else {setDisplayOnline(false);setDisplayOffline(true);}
    
  };
  
  useEffect(() => {
    console.log("Type : ", dataResponse.type)
    isDisplay(dataResponse.type);
  }, [data]);
  

  // if (store) {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: 5, pb: 1, mb: 5, 
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,}}>
            <Typography sx={{ mr: 6, mb: 2 }} variant="h5">インストラクター一覧</Typography>
            {/* <Button sx={{ mb: 2 }}  onClick={toggleAddCoursesTeacher} variant="contained">
              追加する
            </Button> */}
          </Box>
          <DataGrid
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            className="tableWithImage"
            rowHeight={90}
            autoHeight
            rows={store.data}
            columns={columns}
            columnVisibilityModel ={{
              charge_point: displayOnline,
              price_half_day: displayOffline,
              price_full_day: displayOffline,
              price_two_day: displayOffline,
              price_three_day: displayOffline,
              price_four_day: displayOffline,
            }}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              "& .MuiDataGrid-columnHeaders": { borderRadius: 0 },
              overflowX: "scroll",
            }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </Card>
      </Grid>
      <SidebarAddCourseTeacher data={dataResponse} open={addCoursesTeacherOpen} toggle={toggleAddCoursesTeacher} />
    </Grid>
  );
  // } else {
  //   return (
  //     <Grid container spacing={6}>
  //       <Grid item xs={12}>
  //         <Card>
  //           <Box sx={{ p: 5, pb: 1, mb: 5 }}>
  //             <Typography variant="h5">生徒ログインログ一覧</Typography>
  //           </Box>
  //           <Box sx={{ p: 5, pb: 1, mb: 20 }}>
  //             <Typography variant="body1">
  //               生徒ログインログの登録はありません
  //             </Typography>
  //           </Box>
  //         </Card>
  //       </Grid>
  //     </Grid>
  //   );
  // }
};

export default CourseTeacher;

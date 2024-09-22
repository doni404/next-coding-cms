// ** React Imports
import { useState, useEffect, useCallback, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import React from "react";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

import { fetchData } from "src/store/apps/student_certificates";
import SidebarAddStudentCertificate from "src/views/student/list/AddStudentCertificate";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { DataGrid, jaJP } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormLabel from '@mui/material/FormLabel'

// ** Icons Imports
import Download from 'mdi-material-ui/Download'
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Third party Imports
import axiosInstance from "src/helper/axiosInstance";
import DatePicker from "react-datepicker";
import ja from "date-fns/locale/ja";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { set } from "nprogress";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const RowOptions = ({ id, isd }) => {
  const issued_date = moment(isd).format('YYYY-MM-DD');
  // ** pdf download
  const downloadPDF = async () => {
    const endPoint = BASE_URL_API+`v1/cms/student-certificates/${id}/pdf`;
    await axiosInstance.get(endPoint, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/pdf",
        });
        const pdfUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pdfUrl;
        let filename = `Certificate_${issued_date}_${id}.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(pdfUrl);
      })
      .catch((error) => {
        console.error("File download failed:", error);
      });
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button sx={{ ml: 2, mb: 2 }} onClick={downloadPDF} variant="contained">
          <Download fontSize="small" sx={{ mr: 2 }} />
          PDF
        </Button>
      </Box>
    </>
  );
};

const RowDetailOptions = ({ id, rw, isd}) => {
  const defaultValues = {
    note: "",
    certificate_number: "",
    start_date: "",
    end_date: "",
    name: "",
    title: "",
    genereted_by: "",
    issued_date: "",
  }

  const issue_date = moment(isd).format('YYYY-MM-DD');
  // ** pdf download
  const downloadPDF = async () => {
    const endPoint = BASE_URL_API+`v1/cms/student-certificates/${id}/pdf`;
    await axiosInstance.get(endPoint, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/pdf",
        });
        const pdfUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pdfUrl;
        let filename = `Certificate_${issue_date}_${id}.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(pdfUrl);
      })
      .catch((error) => {
        console.error("File download failed:", error);
      });
  };
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleRowDetalOptionsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ** Var

  const {
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    setValue("certificate_number", rw.certificate_number);
    setValue("start_date", rw.start_date);
    setValue("end_date", rw.end_date);
    setValue("name", rw.name);
    setValue("title", rw.title);
    setValue("genereted_by", rw.generated_by === "student" ? "生徒" : "管理者");
    setValue("issued_date", rw.issued_date);
    setValue("note", rw.note);
  }, [rw]);

  // Handle Edit dialog
  const handleEditClickOpen = async () => {
    console.log("id edit open : ", id);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    console.log("id edit close : ", id);
    // reset();
    setOpenEdit(false);
  };


  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="備考を編集">
          <IconButton size="small" onClick={handleEditClickOpen}>
            <EyeOutline />
          </IconButton>
        </Tooltip>
      </Box>

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
          証明書発行詳細
        </DialogTitle>
        <DialogContent sx={{}}>
          <Grid
            container
            spacing={6}
            sx={{ marginTop: ".5em", alignContent: "" }}
          >
            <Grid item xs={12} sm={12}>
              <Typography variant="body1" sx={{ textAlign: "center", pb: 3 }}>
                ID : {id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Controller
                  name="certificate_number"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="証明書番号" />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Grid container alignItems="center">
                  <Grid item xs={3}>
                    <FormLabel required>発行期間</FormLabel>
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name="start_date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePickerWrapper>
                          <DatePicker
                            id="start_date"
                            required
                            selected={value ? new Date(value) : null}
                            showYearDropdown
                            showMonthDropdown
                            dateFormat="yyyy-MM-dd"
                            onChange={(date) =>
                              onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            locale={ja}
                            customInput={
                              <CustomInput
                                value={value}
                                onChange={onChange}
                                error={Boolean(errors.start_date)}
                                aria-describedby="validation-basic-date"
                              />
                            }
                          />
                        </DatePickerWrapper>
                      )}
                    />
                  </Grid>
                  <Grid item xs={1} sx={{ textAlign: "center" }}>
                    <Box component="span">~</Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name="end_date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePickerWrapper>
                          <DatePicker
                            id="end_date"
                            required
                            selected={value ? new Date(value) : null}
                            showYearDropdown
                            showMonthDropdown
                            dateFormat="yyyy-MM-dd"
                            onChange={(date) =>
                              onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            locale={ja}
                            customInput={
                              <CustomInput
                                value={value}
                                onChange={onChange}
                                error={Boolean(errors.end_date)}
                                aria-describedby="validation-basic-date"
                              />
                            }
                          />
                        </DatePickerWrapper>
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="宛名" />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="受講者" />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Controller
                  name="genereted_by"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="発行者" />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Controller
                  name="issued_date"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id="issued_date"
                        required
                        selected={value ? new Date(value) : null}
                        showYearDropdown
                        showMonthDropdown
                        showTimeSelect
                        timeFormat="HH:mm:ss"
                        timeIntervals={15}
                        timeCaption="時刻"
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        onChange={(date) => {
                          if (date) {
                            onChange(
                              moment(date).format("YYYY-MM-DD HH:mm:ss")
                            );
                          } else {
                            onChange(null);
                          }
                        }}
                        placeholderText="YYYY-MM-DD"
                        locale={ja}
                        customInput={
                          <CustomInput
                            label="発行日"
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.issued_date)}
                            aria-describedby="validation-basic-date"
                          />
                        }
                      />
                    </DatePickerWrapper>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{}}>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="特記事項" />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3, justifyContent: "center" }}>
            <Button
              size="large"
              variant="outlined"
              onClick={handleEditClose}
              sx={{ m: 3 }}
            >
              閉じる
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={downloadPDF}
              sx={{ m: 3 }}
            >
              <Download fontSize="small" sx={{ mr: 2 }} />
              PDF
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
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
    flex: 0.5,
    minWidth: 60,
    sortable: false,
    field: "actionsDetail",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <RowDetailOptions
        id={row.id}
        rw={row}
        isd={row.issued_date}
      />
    ),
  },
  {
    flex: 0.2,
    minWidth: 150,
    field: "certificate_number",
    headerName: "証明書番号",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" sx={{textAlign: "center"}}>
          {row.certificate_number}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "発行期間",
    field: "date",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      const [startDate, startTime] = row.start_date.split(' ');
      const [endDate, endTime] = row.end_date.split(' ');
      return (
          <Typography noWrap variant="body2" style={{textAlign: "center"}}>
            <span>{startDate}</span><br/><span>~</span><br/><span>{endDate}</span>
          </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 170,
    field: "name",
    headerName: "宛名",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.name}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "title",
    headerName: "受講者",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">
        {row.title}
      </Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "generated_by",
    headerName: "発行者",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.generated_by === "student" ? "生徒" : "管理者"}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "発行日",
    field: "issued_date",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      const [date, time] = row.issued_date.split(' ');
      return (
          <Typography noWrap variant="body2">
            <span>{date}</span><br/><span>{time}</span>
          </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "note",
    headerName: "特記事項",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.note}</Typography>;
    },
  },
  {
    flex: 0.5,
    minWidth: 120,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <RowOptions
        id={row.id}
        isd={row.issued_date}
      />
    ),
  },
];

const StudentCertificateList = ({data}) => {
  // ** State
  const [value, setValue] = useState("");
  const [pageSize, setPageSize] = useState(100);
  // const [length, setLength] = useState();

  const dataResponse = data.data;
  const dispatch = useDispatch();
  const store = useSelector((state) => state.student_certificates);
  const [addStudentCertificateOpen, setAddStudentCertificateOpen] = useState(false);

  store = store.data.filter(
    (filter) =>
      filter.name.toLowerCase().includes(value.toLowerCase()) ||
      filter.title.toLowerCase().includes(value.toLowerCase()) ||
      filter.certificate_number.toLowerCase().includes(value.toLowerCase())
  );

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

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const toggleAddStudentCertificate = () => setAddStudentCertificateOpen(!addStudentCertificateOpen);

  if (store) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{p: 5, pb: 1}}>
              <Typography variant="h5">証明書発行一覧</Typography>
            </Box>
            <Box
              sx={{
                p: 5,
                pb: 3,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                pt: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <TextField
                  size="small"
                  value={value}
                  sx={{ mr: 6, mb: 2 }}
                  placeholder="宛名, 受講者, 証明書番号で検索"
                  onChange={(e) => handleFilter(e.target.value)}
                />
                <Button
                  sx={{ mb: 2 }}
                  onClick={toggleAddStudentCertificate}
                  variant="contained"
                >
                  証明書発行登録
                </Button>
              </Box>
            </Box>
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
              sx={{
                "& .MuiDataGrid-columnHeaders": { borderRadius: 0 },
                userSelect: "none",
              }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              alignCenter
            />
          </Card>
        </Grid>
        <SidebarAddStudentCertificate
          data={dataResponse}
          open={addStudentCertificateOpen}
          toggle={toggleAddStudentCertificate}
        />
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 1, mb: 5 }}>
              <Typography variant="h5">証明書発行一覧</Typography>
            </Box>
            <Box sx={{ p: 5, pb: 1, mb: 20 }}>
              <Typography variant="body1">
                証明書発行の登録はありません
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  } 
};

export default StudentCertificateList;

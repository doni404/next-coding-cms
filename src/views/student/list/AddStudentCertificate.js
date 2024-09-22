// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormLabel from '@mui/material/FormLabel'
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormHelperText from "@mui/material/FormHelperText";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import moment from "moment";
import ja from "date-fns/locale/ja";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Actions imports
import { useDispatch } from "react-redux";

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";

//* ** Store Imports
import { addStudentCertificates } from "src/store/apps/student_certificates";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  start_date: yup.string().required("発行期間は入力必須項目です"),
  end_date: yup.string().required("発行期間は入力必須項目です"),
  name: yup.string().required("宛名は入力必須項目です"),
  title: yup.string().required("受講者は入力必須項目です"),
  issued_date: yup.string().required("発行日は入力必須項目です"),
});

const defaultValues = {
  student_id: '', 
  start_date: '', // 発行期間
  end_date: '', // Default value for end_date
  name: '', // 宛名
  title: '', // 受講者
  issued_date: '', // 発行日
  stamp: 'on', // 印影
  note: '', // 特記事項
};

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddStudentPointHistory = ({...props}) => {
  console.log("props : ", props)
  const dataResponse = props.data;
  // ** Props
  const { open, toggle } = props;

  // ** Hooks
  const dispatch = useDispatch();

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    data = {...data, student_id: dataResponse.id}
    console.log("Data submit : ", data);

    dispatch(addStudentCertificates({ ...data }))
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("証明書発行が成功裏に作成されました。");
        } else {
          console.log(response.error);
          toast.error("証明書発行の作成に失敗しました。");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("証明書発行の作成に失敗しました。");
      });
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 500 } } }}
    >
      <Header>
        <Typography variant="h6">証明書発行登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
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
            <Grid container alignItems="center">
              <Grid item xs={3}></Grid>
              <Grid item xs={4}>
                {errors.start_date && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.start_date.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={1} sx={{ textAlign: "center" }}></Grid>
              <Grid item xs={4}>
                {errors.end_date && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.end_date.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="宛名"
                  onChange={onChange}
                  placeholder="John"
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="受講者"
                  onChange={onChange}
                  placeholder="Doe"
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.title.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
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
                        onChange(moment(date).format("YYYY-MM-DD HH:mm:ss"));
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
            {errors.issued_date && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.issued_date.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">印影</FormLabel>
            <Controller
              name="stamp"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="stamp" aria-label="public" {...field}>
                  <FormControlLabel
                    value="on"
                    label="有り"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="off"
                    label="無し"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="note"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="特記事項"
                  label="特記事項"
                />
              )}
            />
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
            >
              登録
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              キャンセル
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddStudentPointHistory;

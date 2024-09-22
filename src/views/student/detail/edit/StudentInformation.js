// ** React Imports
import { useState, useEffect, forwardRef } from "react";
import { Fragment } from "react";
// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import OutlinedInput from "@mui/material/OutlinedInput";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import moment from "moment";
import axiosInstance from "src/helper/axiosInstance"
import ja from "date-fns/locale/ja";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Actions Imports
import { updateStudent, deleteStudent } from "src/store/apps/student";

// ** Store Imports
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// ** import static data
import { schoolStatusList, frenchLevelList, frenchGoalList, referenceList } from "src/components/student-static-data";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  name: yup.string().required("氏名（漢字）は入力必須項目です。"),
  name_en: yup.string().required("氏名（ローマ字）は入力必須項目です。"),
  email: yup
    .string()
    .email("有効な電子メールを入力してください")
    .required("Eメールは入力必須項目です。"),
    phone: yup.string().matches(/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
      message: "無効な電話番号",
    })
    .required("電話番号は入力必須項目です。"),
  zip_code: yup.string().required("郵便番号は入力必須項目です。"),
  address: yup.string().required("住所（日本語名）は入力必須項目です。"),
  address_en: yup.string().required("住所（英名）は入力必須項目です。"),
  gender: yup.string().required("性別は入力必須項目です。"),
  birthdate: yup.string().required("生年月日は入力必須項目です。"),
  skype_display_name: yup.string().required("スカイプ表示名は入力必須項目です。"),
  skype_name: yup.string().required("スカイプ名は入力必須項目です。"),
  french_level: yup.string().required("フランス語レベルは入力必須項目です。"),
  french_goal: yup
    .string()
    .required("フランス語を勉強する目的は入力必須項目です。"),
  reference: yup
    .string()
    .required("当スクールをどこでお知りになりましたかは入力必須項目です。"),
  school_status: yup.string().required("学校状態は入力必須項目です。"),
  timezone_id: yup.string().required("タイムゾーンは入力必須項目です。"),
});

const defaultValues = {
  name: "",
  name_en: "",
  email: "",
  email_other: "",
  email_other_notif: "",
  phone: "",
  zip_code: "",
  address: "",
  address_en: "",
  birthdate: "",
  gender: "",
  skype_display_name: "",
  skype_name: "",
  french_level: "",
  french_goal: "",
  registration_purpose: "",
  reference: "",
  school_status: "",
  student_reference_code: "",
  student_reference_name: "",
  situation: "",
  unlimited_reservation: "",
  timezone_id: "",
  note: "",
  special_access: "",
}

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const AccountInformation = ({ data, setRefreshKey }) => {
  // ** State
  const dataRes = data.data;
  const [id, setId] = useState(dataRes.id);
  const [code, setCode] = useState(dataRes.code);
  const [timezoneOptions, setTimezoneOptions] = useState([]); // State for storing timezone options

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  

  useEffect(() => {
    console.log("dataResponse", dataRes);
    if (dataRes) {
      setId(dataRes.id);
      setCode(dataRes.code);
      setValue('name', dataRes.name, { shouldValidate: true });
      setValue('name_en', dataRes.name_en, { shouldValidate: true });
      setValue('email', dataRes.email, { shouldValidate: true });
      setValue('email_other', dataRes.email_other);
      setValue('email_other_notif', dataRes.email_other_notif);
      setValue('phone', dataRes.phone, { shouldValidate: true });
      setValue('zip_code', dataRes.zip_code, { shouldValidate: true });
      setValue('address', dataRes.address, { shouldValidate: true });
      setValue('address_en', dataRes.address_en, { shouldValidate: true });
      setValue('birthdate', moment(dataRes.birthdate).format('YYYY-MM-DD'), { shouldValidate: true });
      setValue('gender', dataRes.gender, { shouldValidate: true });
      setValue('skype_display_name', dataRes.skype_display_name, { shouldValidate: true });
      setValue('skype_name', dataRes.skype_name, { shouldValidate: true });
      setValue('french_level', dataRes.french_level, { shouldValidate: true });
      setValue('french_goal', dataRes.french_goal, { shouldValidate: true });
      setValue('registration_purpose', dataRes.registration_purpose, { shouldValidate: true });
      setValue('reference', dataRes.reference, { shouldValidate: true });
      setValue('school_status', dataRes.school_status, { shouldValidate: true });
      setValue('student_reference_code', dataRes.student_reference?.code);
      setValue('student_reference_name', dataRes.student_reference_name);
      setValue('situation', dataRes.situation);
      setValue('unlimited_reservation', dataRes.unlimited_reservation);
      setValue('timezone_id', dataRes.timezone_id);
      setValue('note', dataRes.note);
      setValue('special_access', dataRes.special_access);
      if (dataRes?.french_goal) {
        setValue("french_goal",  dataRes.french_goal, { shouldValidate: true });
        console.log("Split French Goal",  dataRes.french_goal);
      }
    }
  }, [dataRes, setValue]);

  useEffect(() => {
    loadTimezone()
  }, [])

  const loadTimezone = async () => {
    axiosInstance.get(BASE_URL_API + 'v1/cms/timezones')
      .then((res) => {
        console.log('res ', res.data.data)
        setTimezoneOptions(res.data.data)
      })
      .catch((error) => {
        console.log('error ', error)  
      })
  }

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (formData) => {
    // Convert specific fields to integers
    if (formData.timezone_id) {
      formData.timezone_id = parseInt(formData.timezone_id, 10);
    }
    console.log("on submit : ", formData);
    
    dispatch(updateStudent({id, formData})).unwrap()
      .then((originalPromiseResult) => {
        console.log("success", originalPromiseResult);
        setRefreshKey((prev) => prev + 1);
        toast.success("生徒が編集されませんでした。");
      })
      .catch((error) => {
        console.log("rejected", error);

        if (error.response) {
          const { status, data: { message },} = error.response;
          if (status === 409) {
            if (message.toLowerCase().includes("Email is already taken".toLowerCase())) {
              toast.error("メールアドレスは既に登録されています。");
            }
          } else {
            toast.error(message || "生徒が編集されませんでした。");
          }
        } else {
          // Fallback to a generic error message
          toast.error(error.message || "生徒が編集されませんでした。");
        }
      });
    };  

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    dispatch(deleteStudent(id)).then((response) => {
      setDeleteDialog(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("生徒が削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("生徒が削除されました。");
        router.push("/student/list");
      }
    });
  };

  // delete user
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  // Watch the french_goal field and split into an array if it's a string
  const selectedStatuses = watch("french_goal")?.split(", ").filter(Boolean) || [];

  const handleCheckboxChange = (key) => (event) => {
    const isChecked = event.target.checked;
    const newStatus = isChecked
        ? [...selectedStatuses, key]
        : selectedStatuses.filter((item) => item !== key);

    // Update the form value as a comma-separated string
    setValue("french_goal", newStatus.join(", "));
  };

  const handleMagicLink = (event) => {
    console.log("MagicLink Student ");

    const request = {
      student_id: id,
    };
    console.log("request", request);
    const endpoint = BASE_URL_API + "v1/cms/students/generate-magic-link";
    axiosInstance.post(endpoint, request)
      .then(function (response) {
        console.log(response);
        if (response.data.data.url) {
          window.open(response.data.data.url, "_blank");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("生徒が編集されませんでした。");
      });
  };

  return (
    <Fragment>
      <Card>
        <Box sx={{ p: 5, pb: 10 }}>
          <Grid fullWidth container sx={{ mb: 6, alignItems: "center" }}>
            <Typography variant="h5">生徒情報（詳細）</Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", marginLeft: "10px" }}
            >
              <Button
                size="large"
                type="submit"
                onClick={handleMagicLink}
                variant="contained"
                sx={{ mr: 3 }}
              >
                ログイン
              </Button>
            </Box>
          </Grid>
          <Grid xs={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid
                fullWidth
                container
                alignItems="center"
                sx={{ mb: { xs: 6, sm: 4 } }}
              >
                <Grid item xs={2} sm={4}>
                  <FormLabel>会員番号</FormLabel>
                  <FormLabel
                    sx={{ display: { xs: "inline", sm: "none" }, ml: 2 }}
                  >
                    :
                  </FormLabel>
                </Grid>
                <Grid item xs={10} sm={8}>
                  <FormLabel>{code}</FormLabel>
                </Grid>
              </Grid>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel>休退会後も特別ログイン・予約可</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="special_access"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row id="specialAccess" aria-label="public" {...field}>
                          <FormControlLabel
                            value="yes"
                            label="はい"
                            sx={null}
                            control={<Radio />}
                          />
                          <FormControlLabel
                            value="no"
                            label="いいえ"
                            sx={null}
                            control={<Radio />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 }}}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel required>性別</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row id="radioj" aria-label="public" {...field}>
                        <FormControlLabel
                          value="male"
                          label="男性"
                          sx={null}
                          control={<Radio />}
                        />
                        <FormControlLabel
                          value="female"
                          label="女性"
                          sx={null}
                          control={<Radio />}
                        />
                      </RadioGroup>
                    )}
                  />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel required>ご登録の目的</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="registration_purpose"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          aria-label="public"
                          {...field}
                        >
                          <FormControlLabel
                            value="skype"
                            label="Skypeオンラインレッスン受講"
                            sx={null}
                            control={<Radio />}
                          />
                          <FormControlLabel
                            value="video"
                            label="ビデオ講座視聴"
                            sx={null}
                            control={<Radio />}
                          />
                          <FormControlLabel
                            value="all"
                            label="両方"
                            sx={null}
                            control={<Radio />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>氏名（漢字）</FormLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          required
                          fullWidth
                          value={value}
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>氏名（ローマ字）</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="name_en"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          required
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="Doe"
                          error={Boolean(errors.name_en)}
                        />
                      )}
                    />
                    {errors.name_en && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.name_en.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>Eメール</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          required
                          fullWidth
                          type="email"
                          value={value}
                          onChange={onChange}
                          placeholder="johndoe@email.com"
                          error={Boolean(errors.email)}
                        />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.email.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>生徒サブメール (任意)</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="email_other"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          type="email"
                          onChange={onChange}
                          placeholder="johndoe1@email.com"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>生徒サブメール通知</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="email_other_notif"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="emailOtherNotif"
                          aria-label="public"
                          {...field}
                        >
                          <FormControlLabel
                            value="on"
                            label="希望する"
                            sx={null}
                            control={<Radio />}
                          />
                          <FormControlLabel
                            value="off"
                            label="希望しない"
                            sx={null}
                            control={<Radio />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel required>電話番号</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="080229232933"
                          error={Boolean(errors.phone)}
                        />
                      )}
                    />
                    {errors.phone && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.phone.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel required>郵便番号</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="zip_code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="1234567"
                          error={Boolean(errors.zip_code)}
                        />
                      )}
                    />
                    {errors.zip_code && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.zip_code.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel required>住所（日本語名）</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          rows={4}
                          multiline
                          placeholder="住所（日本語名）"
                          error={Boolean(errors.address)}
                        />
                      )}
                    />
                    {errors.address && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.address.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormLabel required>住所（英名）</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="address_en"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          rows={4}
                          multiline
                          placeholder="住所（英名）"
                          error={Boolean(errors.address_en)}
                        />
                      )}
                    />
                    {errors.address_en && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.address_en.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>生年月日</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="birthdate"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePickerWrapper>
                          <DatePicker
                            id="birthdate"
                            required
                            selected={value ? new Date(value) : null}
                            showYearDropdown
                            showMonthDropdown
                            dateFormat="yyyy-MM-dd"
                            onChange={(date) => onChange(moment(date).format('YYYY-MM-DD'))}
                            locale={ja}
                            customInput={
                              <CustomInput
                                label="生年月日"
                                value={value}
                                onChange={onChange}
                                error={Boolean(errors.birthdate)}
                                aria-describedby="validation-basic-date"
                              />
                            }
                          />
                        </DatePickerWrapper>
                      )}
                    />
                    {errors.birthdate && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.birthdate.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>スカイプ表示名</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="skype_display_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="JohnDoe"
                          error={Boolean(errors.skype_display_name)}
                        />
                      )}
                    />
                    {errors.skype_display_name && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.skype_display_name.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>スカイプ名</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="skype_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="JohnDoe"
                          error={Boolean(errors.skype_name)}
                        />
                      )}
                    />
                    {errors.skype_name && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.skype_name.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>フランス語レベル</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="french_level"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          id="frechLevel"
                          inputProps={{ placeholder: "Select frech Level" }}
                        >
                          {Object.entries(frenchLevelList).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.french_level && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.french_level.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>フランス語を勉強する目的</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <FormGroup sx={{ flexDirection: "row" }}>
                      {Object.keys(frenchGoalList).map((key) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Controller
                              name="french_goal"
                              control={control}
                              render={() => (
                                <Checkbox
                                  checked={selectedStatuses.includes(key)}
                                  onChange={handleCheckboxChange(key)}
                                />
                              )}
                            />
                          }
                          label={frenchGoalList[key]}
                        />
                      ))}
                    </FormGroup>
                    {errors.french_goal && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.french_goal.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>当スクールをどこでお知りになりましたか</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="reference"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          id="select-reference"
                          labelId="reference-select"
                          inputProps={{ placeholder: "Select reference" }}
                        >
                          {Object.entries(referenceList).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.reference && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.reference.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>学校状態</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="school_status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          id="select-school-status"
                          labelId="schoolStatus"
                          inputProps={{ placeholder: "Select school status" }}
                        >
                          {Object.entries(schoolStatusList).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.school_status && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.school_status.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>紹介者会員番号</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="student_reference_code"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="3231"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>紹介者氏名</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="student_reference_name"
                      control={control}
                      render={({ field: { value, onChange }}) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="john doe"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>予約数無制限</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="unlimited_reservation"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="unlimitedReservation"
                          aria-label="public"
                          {...field}
                        >
                          <FormControlLabel
                            value="yes"
                            label="無制限"
                            sx={null}
                            control={<Radio />}
                          />
                          <FormControlLabel
                            value="no"
                            label="制限あり"
                            sx={null}
                            control={<Radio />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container alignItems="center">
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>タイムゾーン</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="timezone_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          id="select-timezone"
                          value={field.value || ""} // Ensure value is correctly handled
                          onChange={(event) => {
                            field.onChange(event.target.value); // Update form value on change
                          }}
                          inputProps={{ placeholder: "Select timezone" }}
                        >
                          {/* Map over the timezoneOptions state */}
                          {timezoneOptions.map((timezone) => (
                            <MenuItem key={timezone.id} value={timezone.id}>
                              （{timezone.gmt_code}）{timezone.name} 
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  {errors.timezone_id && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.timezone_id.message}
                    </FormHelperText>
                  )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>備考</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="note"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          rows={4}
                          multiline
                          placeholder="備考"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <Grid fullWidth container>
                <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                  <FormLabel></FormLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ mr: 3 }}
                    >
                      保存
                    </Button>
                    <Button
                      size="large"
                      component="label"
                      variant="outlined"
                      onClick={handleDeleteClickOpen}
                    >
                      削除
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Dialog
                open={deleteDialog}
                onClose={handleDeleteClose}
                aria-labelledby="user-view-edit"
                sx={{
                  "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: 500,
                    p: [2, 5],
                  },
                }}
                aria-describedby="user-view-edit-description"
              >
                <DialogTitle
                  id="user-view-edit"
                  sx={{ textAlign: "center", fontSize: "1.5rem !important" }}
                >
                  生徒削除
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    variant="body2"
                    id="user-view-edit-description"
                    sx={{ textAlign: "center", mb: 5 }}
                  >
                    この生徒を削除してもよろしいですか？
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={handleDelete}
                  >
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
            </form>
          </Grid>
        </Box>
      </Card>
    </Fragment>
  );
};

export default AccountInformation;

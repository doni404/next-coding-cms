// ** React Imports
import { useEffect, forwardRef, useState } from "react";

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
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import moment from "moment";
import axiosInstance from "src/helper/axiosInstance";
import ja from "date-fns/locale/ja";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline, Router } from "mdi-material-ui";
import { addStudent } from "src/store/apps/student";
import toast from "react-hot-toast";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** import static data
import {
  schoolStatusList,
  frenchLevelList,
  frenchGoalList,
  referenceList,
} from "src/components/student-static-data";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} は入力必須項目です。`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${min}文字以上`;
  } else {
    return "";
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup.string().required("氏名（漢字）は入力必須項目です。"),
  name_en: yup.string().required("氏名（ローマ字）は入力必須項目です。"),
  email: yup
    .string()
    .email("有効な電子メールを入力してください")
    .required("Eメールは入力必須項目です。"),
  email_other: yup
    .string()
    .email("有効な電子メールを入力してください"),
  password: yup.string().min(8, "8文字以上").required(),
  "confirm-password": yup
    .string()
    .required("パスワード確認は入力必須項目です。")
    .oneOf(
      [yup.ref("password"), null],
      "パスワードが一致している必要があります。"
    ),
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
  email_notif: "on",
  email_other_notif: "off",
  password: "",
  "confirm-password": "",
  phone: "",
  zip_code: "",
  address: "",
  address_en: "",
  birthdate: "",
  gender: "male",
  skype_display_name: "",
  skype_name: "",
  french_level: "",
  french_goal: "",
  registration_purpose: "all",
  reference: "",
  school_status: "",
  student_reference_code: "",
  student_reference_name: "",
  situation: "active",
  unlimited_reservation: "no",
  timezone_id: "",
  note: "",
  special_access: "no",
};

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddStudent = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [timezoneOptions, setTimezoneOptions] = useState([]); // State for storing timezone options
  const [state, setState] = useState({
    password: "",
    password2: "",
    showPassword: false,
    showPassword2: false,
  });

  // ** Hooks
  const dispatch = useDispatch();

  // Handle Password
  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Handle Confirm Password
  const handleClickShowConfirmPassword = () => {
    setState({ ...state, showPassword2: !state.showPassword2 });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

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

  const onSubmit = (data) => {
    delete data['confirm-password'];
    console.log("data", data);
    dispatch(addStudent({ ...data }))
      .unwrap()
      .then((originalPromiseResult) => {
        toggle();
        reset();
        toast.success("生徒を登録しました。");
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
            toast.error(message || "生徒の登録ができませんでした。");
          }
        } else {
          // Fallback to a generic error message
          toast.error(error.message || "生徒の登録ができませんでした。");
        }
      });
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  // Watch the french_goal field
  const selectedStatuses = watch("french_goal").split(", ").filter(Boolean);

  const handleCheckboxChange = (key) => (event) => {
    const isChecked = event.target.checked;
    const newStatus = isChecked ? [...selectedStatuses, key] : selectedStatuses.filter((item) => item !== key);

    // Convert array to a comma-separated string
    const finalValue = newStatus.join(", ");

    // Set the value as a string
    setValue("french_goal", finalValue);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">生徒登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="schoolStatus" required>
              学校状態
            </InputLabel>
            <Controller
              name="school_status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  id="select-school-status"
                  label="学校状態"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">
              休退会後も特別ログイン・予約可
            </FormLabel>
            <Controller
              name="special_access"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  id="specialAccess"
                  aria-label="public"
                  {...field}
                >
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">性別</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">ご登録の目的</FormLabel>
            <Controller
              name="registration_purpose"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  row
                  label="ご登録の目的"
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
                  label="氏名（漢字）"
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
              name="name_en"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="氏名（ローマ字）"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  type="email"
                  value={value}
                  label="Eメール"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="email_other"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  type="email"
                  label="生徒サブメール (任意)"
                  onChange={onChange}
                  placeholder="johndoe1@email.com"
                  error={Boolean(errors.email_other)}
                />
              )}
            />
            {errors.email_other && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.email_other.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">生徒サブメール通知</FormLabel>
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
          </FormControl>
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel htmlFor="password">パスワード</InputLabel>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label="パスワード"
                  id="password"
                  onChange={onChange}
                  error={Boolean(errors.password)}
                  type={state.showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={handleMouseDownPassword}
                        onClick={handleClickShowPassword}
                      >
                        {state.showPassword ? (
                          <EyeOutline />
                        ) : (
                          <EyeOffOutline />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.password.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel htmlFor="confirm-password">パスワード確認</InputLabel>
            <Controller
              name="confirm-password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label="パスワード確認"
                  id="confirm-password"
                  onChange={onChange}
                  error={Boolean(errors["confirm-password"])}
                  type={state.showPassword2 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={handleMouseDownConfirmPassword}
                        onClick={handleClickShowConfirmPassword}
                      >
                        {state.showPassword2 ? (
                          <EyeOutline />
                        ) : (
                          <EyeOffOutline />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors["confirm-password"] && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors["confirm-password"].message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="電話番号"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="zip_code"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="郵便番号"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="住所（日本語名）"
                  label="住所（日本語名）"
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.address.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="address_en"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="住所（英名）"
                  label="住所（英名）"
                  error={Boolean(errors.address_en)}
                />
              )}
            />
            {errors.address_en && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.address_en.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="skype_display_name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="スカイプ表示名"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="skype_name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="スカイプ名"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="frechLevel" required>
              フランス語レベル
            </InputLabel>
            <Controller
              name="french_level"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  id="frechLevel"
                  label="フランス語レベル"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">フランス語を勉強する目的</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="ref-select" required>
              当スクールをどこでお知りになりましたか
            </InputLabel>
            <Controller
              name="reference"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  id="select-reference"
                  label="当スクールをどこでお知りになりましたか"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="student_reference_code"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="紹介者会員番号"
                  onChange={onChange}
                  placeholder="3231"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="student_reference_name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="紹介者氏名"
                  onChange={onChange}
                  placeholder="john doe"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">予約数無制限</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="timezones" required>
              タイムゾーン
            </InputLabel>
              <Controller
                name="timezone_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    id="select-timezone"
                    label="タイムゾーン"
                    labelId="timezone-select"
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
                  placeholder="備考"
                  label="備考"
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

export default SidebarAddStudent;

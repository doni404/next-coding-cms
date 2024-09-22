// ** React Imports
import { useEffect, forwardRef, useState, useRef } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from '@mui/material/ListItemText';

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline, Router } from "mdi-material-ui";
import { addTeacher } from "src/store/apps/teacher";
import toast from "react-hot-toast";

// ** import static data
import { featuresList } from "src/components/teacher-static-data";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup.string().required("講師名は入力必須項目です。"),
  show_public: yup
    .string()
    .oneOf(["yes", "no"], "表示は 'yes' か 'no' である必要があります。")
    .required("表示は入力必須項目です。"),
  situation: yup
    .string()
    .oneOf(["active", "inactive"], "状態は 'active' か 'inactive' である必要があります。")
    .required("状態は入力必須項目です。"),
  email: yup.string().email("有効な電子メールを入力してください").required("Eメールは入力必須項目です。"),
  password: yup.string().min(8, "8文字以上").required(),
    "confirm-password": yup
      .string()
      .required("パスワード確認は入力必須項目です。")
      .oneOf(
        [yup.ref("password"), null],
        "パスワードが一致している必要があります。"
      ),
  skype_display_name: yup.string().required("スカイプ表示名は入力必須項目です。"),
  skype_name: yup.string().required("スカイプ名は入力必須項目です。"),
  features: yup.string().required("特徴は入力必須項目です。"),
  // reward_01: yup.string().required("1レッスンの報酬 (0時から12時) は入力必須項目です。"),
  // reward_02: yup.string().required("1レッスンの報酬 (13時から24時) は入力必須項目です。"),
  // reward_03: yup.string().required("1レッスンの報酬 (終日) は入力必須項目です。"),
  reservation_available_time: yup.string().required("予約可能時間は入力必須項目です。"),
  cancelation_available_time: yup.string().required("キャンセル可能時間は入力必須項目です。"),
  trial_availability: yup.string().oneOf(["yes", "no"], "無料体験対応は 'yes' か 'no' である必要があります。").required("無料体験対応は入力必須項目です。"),
  available_course_categories: yup.array().of(yup.object({value: yup.string(),
  }),).min(1, '少なくとも 1 つの項目を選択してください').required('対応可能コースは入力必須項目です。'),
  credit_zero_reservation: yup.string().oneOf(["possible", "impossible"], "クレジット0予約可否は 'possible' か 'impossible' である必要があります。").required("クレジット0予約可否は入力必須項目です。"),
  is_reservation_limit: yup.string().required("予約制限は入力必須項目です。"),
});

const defaultValues = {
  name: "", // 講師名
  show_public: "no", // 表示 (yes/no)
  situation: "active", // 状態 (active/inactive)
  email: "", // 講師メールアドレス
  password: "", // 講師パスワード
  "confirm-password": "",
  skype_display_name: "", // スカイプ表示名
  skype_name: "", // スカイプ名
  profile_image: "", // 講師画像
  supported_languages: "", // 対応可能言語
  features: "", // 特徴
  introduction: "", // 自己紹介
  lesson_style: "", // レッスンスタイル
  // reward_01: "", // 1レッスンの報酬 (0時から12時)
  // reward_02: "", // 1レッスンの報酬 (13時から24時)
  // reward_03: "", // 1レッスンの報酬 (終日)
  reservation_available_time: "", // 予約可能時間
  cancelation_available_time: "", // キャンセル可能時間
  trial_availability: "no", // 無料体験対応 (yes/no)
  experienced_attendance: "no", // 受講制限
  available_course_categories: [], // 対応可能コース
  credit_zero_reservation: "impossible", // クレジット0予約可否 (possible, impossible)
  is_reservation_limit: "no", // 予約制限
  personal_career: "", // 経歴
  personal_education: "", // 学歴
  personal_language: "", // 言語
  personal_speciality: "", // 得意分野
  personal_hobby: "", // 趣味
  personal_holiday: "", // 好きな休日の過ごし方
  personal_fav_food: "", // 好きな食べ物
  personal_fav_drink: "", // 好きな飲み物
  note: "", // 講師備考
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddTeacher = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [dataCategory, setDataCategory] = useState([]);
  const [state, setState] = useState({
    password: "",
    password2: "",
    showPassword: false,
    showPassword2: false,
  });

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

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
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [imgSrc, setImgSrc] = useState("");
  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  }));

  const onChangeImage = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const ImgStyled = styled("img")(({ theme }) => ({
    marginBottom: theme.spacing(3),
  }));

  const loadCategory = async () => {
    axiosInstance.get(BASE_URL_API + "v1/cms/course-categories?sort_by=created_at.asc&type=subscription")
      .then((res) => {
        console.log("res categories : ", res.data.data)
        setDataCategory(res.data.data);
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };

  useEffect(() => {
    loadCategory();
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../../../ckeditor5-build-in"),
    };
    setEditorLoaded(true);
  }, []);

  const onSubmit = (formData) => {
    var listcty = []
    formData.available_course_categories.map((item) => (
      listcty.push(item.id)
    ))
    delete formData['confirm-password'];
    const data = {...formData, profile_image: imgSrc, available_course_categories: listcty};
    console.log("Form Data", data);
    dispatch(addTeacher({ ...data })).unwrap()
      .then((originalPromiseResult) => {
        setImgSrc("");
        toggle();
        reset();
        toast.success("講師を登録しました。");
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
            toast.error(message || "講師の登録ができませんでした。");
          }
         } else {
          // Fallback to a generic error message
          toast.error(error.message || "講師の登録ができませんでした。");
         }
      })
  };

  const handleClose = () => {
    setImgSrc("");
    toggle();
    reset();
  };

   // Watch the french_goal field
   const selectedStatuses = watch("features").split(", ").filter(Boolean);

   const handleCheckboxChange = (key) => (event) => {
     const isChecked = event.target.checked;
     const newStatus = isChecked ? [...selectedStatuses, key] : selectedStatuses.filter((item) => item !== key);
 
     // Convert array to a comma-separated string
     const finalValue = newStatus.join(", ");
 
     // Set the value as a string
     setValue("features", finalValue);
   };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 350, sm: 500 }, maxWidth: "100%" },
      }}
    >
      <Header>
        <Typography variant="h6">講師登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Grid fullWidth container>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{ pt: { xs: 0, sm: 2 }, pb: { xs: 4, sm: 2 } }}
              >
                <FormLabel>写真</FormLabel>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Grid fullWidth>
                  <ImgStyled
                    src={imgSrc}
                    alt="Profile Pic"
                    sx={{ maxWidth: "100%" }}
                  />
                </Grid>
                <ButtonStyled
                  component="label"
                  variant="outlined"
                  htmlFor="account-settings-upload-image"
                >
                  写真アップロード
                  <input
                    hidden
                    type="file"
                    onChange={onChangeImage}
                    accept="image/png, image/jpeg"
                    id="account-settings-upload-image"
                  />
                </ButtonStyled>
                <Typography sx={{ mt: 4 }} component="p" variant="caption">
                  画像はPNGまたはJPEGで、800k以内
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">
              表示
            </FormLabel>
            <Controller
              name="show_public"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="radioj" aria-label="public" {...field}>
                  <FormControlLabel
                    value="yes"
                    label="表示"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="no"
                    label="非表示"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">
              状態
            </FormLabel>
            <Controller
              name="situation"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="radioj" aria-label="public" {...field}>
                  <FormControlLabel
                    value="active"
                    label="ログイン可"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="inactive"
                    label="ログイン不可"
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
                  label="講師名"
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
            <Controller
              name="supported_languages"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="対応可能言語"
                  label="対応可能言語"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">
              特徴
            </FormLabel>
            <FormGroup sx={{ flexDirection: "row" }}>
              {Object.keys(featuresList).map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Controller
                      name="features"
                      control={control}
                      render={() => (
                        <Checkbox
                          checked={selectedStatuses.includes(key)}
                          onChange={handleCheckboxChange(key)}
                        />
                      )}
                    />
                  }
                  label={featuresList[key]}
                />
              ))}
            </FormGroup>
            {errors.features && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.features.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">自己紹介</FormLabel>
            {editorLoaded ? (
              <Controller
                name="introduction"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    config={{
                      toolbar: {
                        items: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "subscript",
                          "superscript",
                          "|",
                          "alignment",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "todolist",
                          "indent",
                          "outdent",
                          "|",
                          "blockQuote",
                          "link",
                          "|",
                          "insertTable",
                          "tabletoolbar",
                          "|",
                          "undo",
                          "redo",
                          "|",
                          "highlight",
                          "fontSize",
                          "fontColor",
                          "fontfamily",
                          "fontBackgroundColor",
                          "|",
                          "removeFormat",
                          "|",
                          "horizontalline",
                          "specialCharacters",
                        ],
                        shouldNotGroupWhenFull: true,
                      },
                      heading: {
                        options: [
                          {
                            model: "paragraph",
                            title: "Paragraph",
                            class: "ck-heading_paragraph",
                          },
                          {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1",
                            class: "ck-heading_heading1",
                          },
                          {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2",
                            class: "ck-heading_heading2",
                          },
                          {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3",
                            class: "ck-heading_heading3",
                          },
                          {
                            model: "heading4",
                            view: "h4",
                            title: "Heading 4",
                            class: "ck-heading_heading4",
                          },
                          {
                            model: "heading5",
                            view: "h5",
                            title: "Heading 5",
                            class: "ck-heading_heading5",
                          },
                        ],
                      },
                      fontSize: {
                        options: [
                          9,
                          10,
                          11,
                          12,
                          13,
                          "default",
                          16,
                          17,
                          19,
                          21,
                          24,
                        ],
                      },
                      table: {
                        contentToolbar: [
                          "tableColumn",
                          "tableRow",
                          "mergeTableCells",
                        ],
                      },
                      language: "en",
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
                    }}
                  />
                )}
              />
            ) : (
              "エディタを読み込んでいます。しばらくお待ちください。..."
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">レッスンスタイル</FormLabel>
            {editorLoaded ? (
              <Controller
                name="lesson_style"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value}
                    config={{
                      toolbar: {
                        items: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                          "subscript",
                          "superscript",
                          "|",
                          "alignment",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "todolist",
                          "indent",
                          "outdent",
                          "|",
                          "blockQuote",
                          "link",
                          "|",
                          "insertTable",
                          "tabletoolbar",
                          "|",
                          "undo",
                          "redo",
                          "|",
                          "highlight",
                          "fontSize",
                          "fontColor",
                          "fontfamily",
                          "fontBackgroundColor",
                          "|",
                          "removeFormat",
                          "|",
                          "horizontalline",
                          "specialCharacters",
                        ],
                        shouldNotGroupWhenFull: true,
                      },
                      heading: {
                        options: [
                          {
                            model: "paragraph",
                            title: "Paragraph",
                            class: "ck-heading_paragraph",
                          },
                          {
                            model: "heading1",
                            view: "h1",
                            title: "Heading 1",
                            class: "ck-heading_heading1",
                          },
                          {
                            model: "heading2",
                            view: "h2",
                            title: "Heading 2",
                            class: "ck-heading_heading2",
                          },
                          {
                            model: "heading3",
                            view: "h3",
                            title: "Heading 3",
                            class: "ck-heading_heading3",
                          },
                          {
                            model: "heading4",
                            view: "h4",
                            title: "Heading 4",
                            class: "ck-heading_heading4",
                          },
                          {
                            model: "heading5",
                            view: "h5",
                            title: "Heading 5",
                            class: "ck-heading_heading5",
                          },
                        ],
                      },
                      fontSize: {
                        options: [
                          9,
                          10,
                          11,
                          12,
                          13,
                          "default",
                          16,
                          17,
                          19,
                          21,
                          24,
                        ],
                      },
                      table: {
                        contentToolbar: [
                          "tableColumn",
                          "tableRow",
                          "mergeTableCells",
                        ],
                      },
                      language: "en",
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
                    }}
                  />
                )}
              />
            ) : (
              "エディタを読み込んでいます。しばらくお待ちください。..."
            )}
          </FormControl>
          {/* <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="reward_01"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  required
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="1レッスンの報酬 (0時から12時)"
                  label="1レッスンの報酬 (0時から12時)"
                  error={Boolean(errors.reward_01)}
                />
              )}
            />
            {errors.reward_01 && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.reward_01.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="reward_02"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  required
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="1レッスンの報酬 (13時から24時)"
                  label="1レッスンの報酬 (13時から24時)"
                  error={Boolean(errors.reward_02)}
                />
              )}
            />
            {errors.reward_02 && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.reward_02.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="reward_03"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  required
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="1レッスンの報酬 (終日)"
                  label="1レッスンの報酬 (終日)"
                  error={Boolean(errors.reward_03)}
                />
              )}
            />
             {errors.reward_03 && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.reward_03.message}
              </FormHelperText>
            )}
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="ref-select" required>
              予約可能時間
            </InputLabel>
            <Controller
              name="reservation_available_time"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                // console.log("value reservationApplyLimit :  ",value); // Log the current value on every render
                return (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Number(value)}
                    onChange={onChange}
                    label="予約可能時間"
                    error={Boolean(errors.reservation_available_time)}
                  >
                    {Array.from({ length: 48 }, (_, i) => i + 1).map((num) => (
                      <MenuItem value={num} key={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                );
              }}
            />
            {errors.reservation_available_time && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.reservation_available_time.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="ref-select" required>
              キャンセル可能時間
            </InputLabel>
            <Controller
              name="cancelation_available_time"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                // console.log("value reservationApplyLimit :  ",value); // Log the current value on every render
                return (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Number(value)}
                    onChange={onChange}
                    label="キャンセル可能時間"
                    error={Boolean(errors.cancelation_available_time)}
                  >
                    {Array.from({ length: 48 }, (_, i) => i + 1).map((num) => (
                      <MenuItem value={num} key={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                );
              }}
            />
            {errors.cancelation_available_time && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.cancelation_available_time.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">
              無料体験対応
            </FormLabel>
            <Controller
              name="trial_availability"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="radioj" aria-label="public" {...field}>
                  <FormControlLabel
                    value="yes"
                    label="対応可"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="no"
                    label="対応不可"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">受講制限</FormLabel>
            <Controller
              name="experienced_attendance"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="radioj" aria-label="public" {...field}>
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
            <InputLabel id="ref-select" required>
              対応可能コース
            </InputLabel>
            <Controller
              name="available_course_categories"
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field: { value, onChange } }) => (
                <Select
                  id="multiple-checkbox"
                  multiple
                  value={value || []}
                  onChange={onChange}
                  label="対応可能コース"
                  renderValue={(selected) => selected.map((x) => x.name_ja).join(", ")}
                  MenuProps={MenuProps}
                  sx={{ width: '100%' }}
                >
                  {dataCategory.map((variant) => (
                    <MenuItem key={variant.id} value={variant}>
                      <Checkbox checked={value?.some((item) => item.id === variant.id)} />
                      <ListItemText primary={variant.name_ja} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.available_course_categories && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.available_course_categories.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">
              クレジット0予約可否
            </FormLabel>
            <Controller
              name="credit_zero_reservation"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="radioj" aria-label="public" {...field}>
                  <FormControlLabel
                    value="possible"
                    label="可"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="impossible"
                    label="不可"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel required component="legend">
              予約制限
            </FormLabel>
            <Controller
              name="is_reservation_limit"
              control={control}
              render={({ field }) => (
                <RadioGroup row id="radioj" aria-label="public" {...field}>
                  <FormControlLabel
                    value="yes"
                    label="無"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="no"
                    label="有"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_career"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="経歴"
                  label="経歴"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_education"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="学歴"
                  label="学歴"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_language"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="言語"
                  label="言語"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_speciality"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="得意分野"
                  label="得意分野"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_hobby"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="趣味"
                  label="趣味"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_holiday"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="好きな休日の過ごし方"
                  label="好きな休日の過ごし方"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_fav_food"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="好きな食べ物"
                  label="好きな食べ物"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="personal_fav_drink"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  rows={4}
                  multiline
                  placeholder="好きな飲み物"
                  label="好きな飲み物"
                />
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

export default SidebarAddTeacher;

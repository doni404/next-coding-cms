// ** React Imports
import { useState, forwardRef, useEffect, useRef } from "react";
import { Fragment } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from '@mui/material/ListItemText';

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Actions Imports
import { updateTeacher, deleteTeacher } from "src/store/apps/teacher";

// ** Third Party Components
import toast from "react-hot-toast";
import { useRouter } from "next/router";

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

// ** import static data
import { featuresList } from "src/components/teacher-static-data";
import { SimOutline } from "mdi-material-ui";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

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
  trial_availability: "", // 無料体験対応 (yes/no)
  experienced_attendance: "", // 受講制限
  available_course_categories: [], // 対応可能コース
  credit_zero_reservation: "", // クレジット0予約可否 (possible, impossible)
  is_reservation_limit: "", // 予約制限
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

const ImgStyled = styled("img")(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const TeacherInformation = ({ data, setRefreshKey }) => {
  // console.log("data information : ", data);
  const dataRes = data.data;
  // ** State
  const [id, setId] = useState(data.data.id);
  const [imgSrc, setImgSrc] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [dataCategory, setDataCategory] = useState([]);

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  const loadCategory = async () => {
    console.log("load category");
    axiosInstance.get(BASE_URL_API + "v1/cms/course-categories?sort_by=created_at.asc&type=subscription")
      .then((res) => {
        console.log("res categories : ", res.data.data)
        setDataCategory(res.data.data);
        console.log("dataRes : ", dataRes)
        if (dataRes && dataRes.available_course_categories) {
          const val = res.data.data.filter(
            (item) =>
              data.data.available_course_categories.findIndex(
                (o) => o.id === item.id
              ) >= 0
          );
          console.log("val : ", val);
          setValue("available_course_categories", val, { shouldValidate: true });
        }
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  };

  useEffect(() => {
    delete defaultValues['available_course_categories'];
    if (dataRes) {
      setId(dataRes.id);
      imageWithAuth(dataRes.profile_image);
      Object.keys(defaultValues).forEach((key) => {
        if (dataRes[key] !== undefined) {
          // Check if the key has validation rules in the schema
          const fieldSchema = schema.fields[key];
          const shouldValidate = fieldSchema && (fieldSchema.tests.length > 0);
          // console.log(key , dataRes[key]);
          setValue(key, dataRes[key], shouldValidate ? { shouldValidate: true } : {});
        }
      });
    }
    loadCategory();
  }, [dataRes, setValue]);

  const imageWithAuth = async (profile_image) => {
    const header = {
      responseType: "blob",
    };
    const response = await axiosInstance.get(
      BASE_URL_API + "v1/public/resources/teachers/" + profile_image,
      header
    );
    const fileReader = new FileReader();
    fileReader.readAsDataURL(response.data);
    fileReader.onloadend = function () {
      setImgSrc(fileReader.result);
    };
  };

  const onChangeImage = (file) => {
    console.log("click photo profile");
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => {
        setImgSrc(reader.result);
        setImageChanged(true); // Set the flag to true when a new image is selected
      };
      reader.readAsDataURL(files[0]);
      console.log("files", files);
    }
    console.log("photo profile onchange", imgSrc);
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("src/ckeditor5-build-in"),
    };
    setEditorLoaded(true);
  }, []);

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (formData) => {
    var listcty = []
    formData.available_course_categories.map((item) => (
      listcty.push(item.id)
    ))
    
    const data = { 
      ...formData, 
      cancelation_available_time: parseInt(formData.cancelation_available_time), 
      reservation_available_time: parseInt(formData.reservation_available_time), 
      available_course_categories: listcty 
    };

    if (imageChanged) {
        data.profile_image = imgSrc;
    }else{
        delete data['profile_image'];
    }
    console.log("on submit ", data);
    dispatch(updateTeacher({id, data})).unwrap()
      .then((originalPromiseResult) => {
         setRefreshKey((prev) => prev + 1);
         toast.success("講師が編集されました。");
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
            toast.error(message || "講師が編集されませんでした。");
          }
        } else {
          // Fallback to a generic error message
          toast.error(error.message || "講師が編集されませんでした。");
        }
      });
    };  

  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  const handleDelete = () => {
    dispatch(deleteTeacher(id)).unwrap()
      .then((response) => {
        setDeleteDialog(false);
        if (response.error) {
          console.log("error", response.error);
          toast.error("講師が削除されませんでした。");
        } else {
          console.log("success", response);
          toast.success("講師が削除されました。");
          router.push('/teacher/list');
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected", rejected);
      }); 
    };

  // Watch the french_goal field and split into an array if it's a string
  const selectedStatuses = watch("features")?.split(", ").filter(Boolean) || [];

  const handleCheckboxChange = (key) => (event) => {
    const isChecked = event.target.checked;
    const newStatus = isChecked
        ? [...selectedStatuses, key]
        : selectedStatuses.filter((item) => item !== key);

    // Update the form value as a comma-separated string
    setValue("features", newStatus.join(", "));
  };

  const handleMagicLink = (event) => {
    console.log("MagicLink Student ");

    const request = {
      teacher_id: data.data.id,
    };
    console.log("request", request);

    const endpoint = BASE_URL_API + "v1/cms/teachers/generate-magic-link";
    axiosInstance.post(endpoint, request)
      .then(function (response) {
        console.log(response);
        if (response.data.data.url) {
          window.open(response.data.data.url, '_blank');
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("講師が編集されませんでした。");
      });
  };

  return (
    <Fragment>
      <Card>
        <Box sx={{ p: 5, pb: 10 }}>
          <Grid fullWidth container sx={{ mb: 6, alignItems: "center" }}>
            <Typography variant="h5">講師情報（詳細）</Typography>
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
                  <FormLabel>ID</FormLabel>
                  <FormLabel
                    sx={{ display: { xs: "inline", sm: "none" }, ml: 2 }}
                  >
                    :
                  </FormLabel>
                </Grid>
                <Grid item xs={10} sm={8}>
                  <FormLabel>{id}</FormLabel>
                </Grid>
              </Grid>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>表示</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="show_public"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="radioj"
                          aria-label="public"
                          {...field}
                        >
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>状態</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="situation"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="radioj"
                          aria-label="public"
                          {...field}
                        >
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{ pt: { xs: 4, sm: 2 }, pb: { xs: 4, sm: 2 } }}
                  >
                    <FormLabel>プロフィール写真</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                      htmlFor="account-upload-image"
                    >
                      画像を選択
                      <input
                        hidden
                        type="file"
                        onChange={onChangeImage}
                        accept="image/png, image/jpeg"
                        id="account-upload-image"
                      />
                    </ButtonStyled>
                    <Typography sx={{ mt: 4 }} component="p" variant="caption">
                      画像はPNGまたはJPEGで、800k以内
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>講師名</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="講師名"
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
                    <FormLabel required>Eメール</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          type="email"
                          fullWidth
                          value={value}
                          onChange={onChange}
                          placeholder="Eメール"
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
                    <FormLabel>対応可能言語</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>特徴</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>自己紹介</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>レッスンスタイル</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                  </Grid>
                </Grid>
              </FormControl>
              {/* <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>1レッスンの報酬 (0時から12時)</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="reward_01"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          rows={4}
                          multiline
                          placeholder="1レッスンの報酬 (0時から12時)"
                          error={Boolean(errors.reward_01)}
                        />
                      )}
                    />
                    {errors.reward_01 && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.reward_01.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>1レッスンの報酬 (13時から24時)</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="reward_02"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          rows={4}
                          multiline
                          placeholder="1レッスンの報酬 (13時から24時)"
                          error={Boolean(errors.reward_02)}
                        />
                      )}
                    />
                    {errors.reward_02 && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.reward_02.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>1レッスンの報酬 (終日)</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="reward_03"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          rows={4}
                          multiline
                          placeholder="1レッスンの報酬 (終日)"
                          error={Boolean(errors.reward_03)}
                        />
                      )}
                    />
                    {errors.reward_03 && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.reward_03.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl> */}
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>予約可能時間</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                            error={Boolean(errors.reservation_available_time)}
                          >
                            {Array.from({ length: 48 }, (_, i) => i + 1).map(
                              (num) => (
                                <MenuItem value={num} key={num}>
                                  {num}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        );
                      }}
                    />
                    {errors.reservation_available_time && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.reservation_available_time.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>キャンセル可能時間</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                            error={Boolean(errors.cancelation_available_time)}
                          >
                            {Array.from({ length: 48 }, (_, i) => i + 1).map(
                              (num) => (
                                <MenuItem value={num} key={num}>
                                  {num}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        );
                      }}
                    />
                    {errors.cancelation_available_time && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.cancelation_available_time.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>無料体験対応</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="trial_availability"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="radioj"
                          aria-label="public"
                          {...field}
                        >
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>受講制限</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="experienced_attendance"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="radioj"
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>対応可能コース</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>クレジット0予約可否</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="credit_zero_reservation"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="radioj"
                          aria-label="public"
                          {...field}
                        >
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
                    {errors.credit_zero_reservation && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {errors.credit_zero_reservation.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel required>予約制限</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="is_reservation_limit"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          row
                          id="radioj"
                          aria-label="public"
                          {...field}
                        >
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>経歴</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>学歴</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>言語</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>得意分野</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>趣味</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>好きな休日の過ごし方</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>好きな食べ物</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                    <FormLabel>好きな飲み物</FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={8}>
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
                        />
                      )}
                    />
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
                          fullWidth
                          rows={6}
                          multiline
                          {...field}
                          placeholder="備考"
                          InputProps={{
                            inputProps: {
                              style: {
                                resize: "both",
                                overflow: "auto",
                              },
                            },
                          }}
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
                  講師削除
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    variant="body2"
                    id="user-view-edit-description"
                    sx={{ textAlign: "center", mb: 5 }}
                  >
                    選択の講師を削除してもよろしいですか？
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

export default TeacherInformation;

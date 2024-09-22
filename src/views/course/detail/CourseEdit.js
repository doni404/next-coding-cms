// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Store Imports
import { useDispatch } from 'react-redux'

import axios from 'axios'

import { useRouter } from 'next/router'

import moment from 'moment'

// ** Actions Imports
import { updateCourses, deleteCourses } from "src/store/apps/course";
import { courseTypeList } from "src/components/course-static-data";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

const schema = yup.object().shape({
  course_category_id: yup.string().required("コースタイプは入力必須項目です。"),
  name_ja: yup.string().required("コース名は入力必須項目です。"),
  name_fr: yup.string().required("コース名（仏語）は入力必須項目です。"),
  sub_name_ja: yup.string().required("コースサブ名は入力必須項目です。"),
  sub_name_fr: yup.string().required("コースサブ名（仏語）は入力必須項目です。"),
  // code: yup.string().required("識別コードは入力必須項目です。"),
  lesson_time: yup.string().required("レッスン時間は入力必須項目です。"),
  credit: yup.string().required("クレジット数は入力必須項目です。"),
  price_unit: yup.string().required("レッスン単価は入力必須項目です。"),
  price: yup.string().required("月謝は入力必須項目です。"),
  type: yup.string().required("タイプは入力必須項目です。"),
});

const defaultValues = {
  course_category_id: "",
  name_ja: "",
  name_fr: "",
  sub_name_ja: "",
  sub_name_fr: "",
  // code: "",
  lesson_time: "",
  credit: "",
  price_unit: "",
  price: "",
  type: "",
  paypal_fee: "",
  display_order: "",
  situation: "inactive",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const CourseEdit = ({ data, setRefreshKey }) => {
  const dataRes = data.data;
  // ** State
  const [id, setId] = useState(data.data.id);
  const [dataCategory, setDataCategory] = useState([]);
  const [error, setError] = useState("");

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter()
  
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

  useEffect(() => {
    if (dataRes) {
      setId(dataRes.id);
      Object.keys(defaultValues).forEach((key) => {
        if (dataRes[key] !== undefined) {
          // Check if the key has validation rules in the schema
          const fieldSchema = schema.fields[key];
          const shouldValidate = fieldSchema && (fieldSchema.tests.length > 0);
          setValue(key, dataRes[key], shouldValidate ? { shouldValidate: true } : {});
        }
      });
      setValue("course_category_id", dataRes.course_category?.id)
    }
  }, [dataRes, setValue]);

  const credit = watch('credit');
  const priceUnit = watch('price_unit');

  useEffect(() => {
    const calculatedPrice = credit * priceUnit;
    setValue('price', calculatedPrice);
  }, [credit, priceUnit, setValue]);

  const onSubmit = (data) => {
    console.log("on submit ", data);

    dispatch(updateCourses({id, data})).unwrap()
      .then((originalPromiseResult) => {
        console.log("success", originalPromiseResult);
        setRefreshKey((prev) => prev + 1);
        toast.success("コースが編集されました。");
      })
      .catch((error) => {
        console.log("rejected", error);

        if (error.response) {
          const { status, data: { message },} = error.response;
          if (status === 409) {
            if (message.toLowerCase().includes("Course with this type is already exist!".toLowerCase())) {
              toast.error("無料トライアルまたは入会金のいずれか1つのコースしか受講できません。");
            }
          } else if (status === 400) {
            const lowerCaseMessage = message.toLowerCase();
            if (
              lowerCaseMessage.includes("course type can't be changed from any type to subscription!") ||
              lowerCaseMessage.includes("course type can't be changed from subscription to any type!")
            ) {
              toast.error("コースタイプをサブスクリプションから他のタイプに変更したり、他のタイプからサブスクリプションに変更することはできません。新しいコースを作成してください。");
            }
            } else {
            toast.error("コースが編集されませんでした。");
          }
        } else {
          // Fallback to a generic error message
          toast.error("コースが編集されませんでした。");
        }
      });
  };

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log("id ", id);
    dispatch(deleteCourses(id))
    .then((response) => {
        setDeleteDialog(false);
        if (response.error) {
          console.log("error", response.error);
          toast.error("エラーが発生しました。サポートにお問い合わせください。");
        } else {
          console.log("success", response);
          toast.success("コースが削除されました。");
          router.push('/course/list');
        }
      })
  };

  // delete category
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false)
  }

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
  }, []);

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        コース情報　（詳細）
      </Typography>
      <Grid xs={12} sm={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{ mb: { xs: 6, sm: 4 } }}
          >
            <Grid item xs={2} sm={4}>
              <FormLabel>ID</FormLabel>
              <FormLabel sx={{ display: { xs: "inline", sm: "none" }, ml: 2 }}>
                :
              </FormLabel>
            </Grid>
            <Grid item xs={10} sm={8}>
              <FormLabel>{data.data.id}</FormLabel>
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormLabel required>状態</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="situation"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row aria-label="public" {...field}>
                      <FormControlLabel
                        value="active"
                        label="公開"
                        sx={null}
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="inactive"
                        label="非公開"
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
                <FormLabel required>カテゴリー</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="course_category_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      id="category_id"
                      inputProps={{ placeholder: "Select frech Level" }}
                    >
                      {dataCategory.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name_ja}
                        </MenuItem>
                      ))}
                    </Select>
                    )}
                  />
                {errors.course_category_id && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.course_category_id.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>タイプ</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="type"
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
                      {Object.entries(courseTypeList).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.type && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>コース名</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="name_ja"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="コース名"
                      fullWidth
                      placeholder="コース名"
                      error={Boolean(errors.name_ja)}
                    />
                  )}
                />
                {errors.name_ja && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.name_ja.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>コース名（仏語）</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="name_fr"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="コース名（仏語）"
                      fullWidth
                      placeholder="コース名（仏語）"
                      error={Boolean(errors.name_fr)}
                    />
                  )}
                />
                {errors.name_fr && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.name_fr.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>コースサブ名</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="sub_name_ja"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="コースサブ名"
                      fullWidth
                      placeholder="コースサブ名"
                      error={Boolean(errors.sub_name_ja)}
                    />
                  )}
                />
                {errors.sub_name_ja && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.sub_name_ja.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>コースサブ名（仏語）</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="sub_name_fr"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="コースサブ名（仏語）"
                      fullWidth
                      placeholder="コースサブ名（仏語）"
                      error={Boolean(errors.sub_name_fr)}
                    />
                  )}
                />
                {errors.sub_name_fr && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.sub_name_fr.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          {/* <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>識別コード</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="識別コード"
                      fullWidth
                      placeholder="識別コード"
                      error={Boolean(errors.code)}
                    />
                  )}
                />
                {errors.code && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.code.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>レッスン時間</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="lesson_time"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row aria-label="public" {...field}>
                      <FormControlLabel
                        value="30"
                        label="30分"
                        sx={null}
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="50"
                        label="50分"
                        sx={null}
                        control={<Radio />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.lesson_time && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.lesson_time.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>クレジット数</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="credit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="クレジット数"
                      type="number"
                      fullWidth
                      placeholder="クレジット数"
                      error={Boolean(errors.credit)}
                    />
                  )}
                />
                {errors.credit && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.credit.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>レッスン単価</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="price_unit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="レッスン単価"
                      type="number"
                      fullWidth
                      placeholder="レッスン単価"
                      error={Boolean(errors.price_unit)}
                    />
                  )}
                />
                {errors.price_unit && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.price_unit.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>月謝</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="月謝"
                      type="number"
                      fullWidth
                      placeholder="月謝"
                      error={Boolean(errors.price)}
                    />
                  )}
                />
                {errors.price && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.price.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>ペイパル手数料</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="paypal_fee"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ペイパル手数料"
                      type="number"
                      fullWidth
                      placeholder="ペイパル手数料"
                      error={Boolean(errors.paypal_fee)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>表示順序</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="display_order"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label=""
                      type="number"
                      fullWidth
                      placeholder="表示順序"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                
              </Grid>
              <Grid item xs={12} sm={8}>
              <Typography
                  sx={{ mt: 4, color: "red", marginTop: 0, border: "1px solid red", padding: 2 }}
                  component="p"
                  variant="caption"
                >
                  *このコースタイプがサブスクリプションの場合、タイトルや価格の更新があると、PayPalのサブスクリプション商品にも反映されます。
                </Typography>
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
                  編集
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
              "& .MuiPaper-root": { width: "100%", maxWidth: 500, p: [2, 5] },
            }}
            aria-describedby="user-view-edit-description"
          >
            <DialogTitle
              id="user-view-edit"
              sx={{ textAlign: "center", fontSize: "1.5rem !important" }}
            >
              コースを削除します
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                variant="body2"
                id="user-view-edit-description"
                sx={{ textAlign: "center", mb: 5 }}
              >
                コースを削除してもよろしいですか？
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
        </form>
      </Grid>
    </Box>
  );
};

export default CourseEdit;

// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from "react-hot-toast";

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addCourses } from 'src/store/apps/course'
import { courseTypeList } from "src/components/course-static-data";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

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

const SidebarAddCourse = (props) => {
  // ** Props
  const { open, toggle } = props;
  const [dataCategory, setDataCategory] = useState([]);
  const [error, setError] = useState("");

  // ** Hooks
  const dispatch = useDispatch();

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

  const credit = watch('credit');
  const priceUnit = watch('price_unit');

  useEffect(() => {
    const calculatedPrice = credit * priceUnit;
    setValue('price', calculatedPrice);
  }, [credit, priceUnit, setValue]);

  const onSubmit = (data) => {
    console.log("data form ", data)

    dispatch(addCourses({ ...data }))
      .unwrap()
      .then((originalPromiseResult) => {
        toggle();
        reset();
        toast.success("コースを登録しました。");
      })
      .catch((error) => {
        console.log("rejected", error);

        if (error.response) {
          const { status, data: { message },} = error.response;
          if (status === 409) {
            if (message.toLowerCase().includes("Course with this type is already exist!".toLowerCase())) {
              toast.error("無料トライアルまたは入会金のいずれか1つのコースしか受講できません。");
            }
          } else {
            toast.error("コースを登録しませんでした。");
          }
        } else {
          // Fallback to a generic error message
          toast.error("コースを登録しませんでした。");
        }
      });
  };

  const handleClose = () => {
    toggle();
    reset();
  };

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
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 350, sm: 450 }, maxWidth: "100%" },
      }}
    >
      <Header>
        <Typography variant="h6">コース登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography
            sx={{
              mb: 3,
              color: "red",
              border: "1px solid red",
              padding: 2,
            }}
            component="p"
            variant="caption"
          >
            注意！新しいコースを「定期購読」タイプで作成すると、PayPalで自動的にサブスクリプション商品プランが作成されます。
          </Typography>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <FormLabel>状態</FormLabel>
            <Controller
              name="situation"
              control={control}
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <InputLabel id="ref-select" required>
              カテゴリー
            </InputLabel>
            <Controller
              name="course_category_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  id="category_id"
                  label="フランス語レベル"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <InputLabel id="frechLevel" required>
              タイプ
            </InputLabel>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  required
                  {...field}
                  fullWidth
                  label="タイプ"
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="name_ja"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="name_fr"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="sub_name_ja"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="sub_name_fr"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          {/* <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="code"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <FormLabel required>レッスン時間</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="credit"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="price_unit"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="price"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  required
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Controller
              name="display_order"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="表示順"
                  type="number"
                  fullWidth
                  placeholder="表示順"
                  error={Boolean(errors.display_order)}
                />
              )}
            />
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
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddCourse

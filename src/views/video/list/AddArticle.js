// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Actions Imports
import { addArticle } from "src/store/apps/article";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";

import moment from "moment";

import { useRouter } from 'next/router'

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
  // date: yup.string().required(),
});

const defaultValues = {
  title: "",
  // date: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddArticle = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [dataCategory, setDataCategory] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryTemp, setCategoryTemp] = useState("");

  const [dataArticleSeries, setDataArticleSeries] = useState([]);
  const [articleSeries, setArticleSeries] = useState(null);
  const [articleSeriesTemp, setArticleSeriesTemp] = useState("");

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

  const router = useRouter()

  const onSubmit = (data) => {
    // console.log("article series : ", articleSeries)
    // console.log("category : ", category)
    const id = window.sessionStorage.getItem("id");
    var request = {
      "public_access": publicArticle,
      "title": data.title,
      "subtitle": data.subtitle,
      "released_date": moment(data.date).format("YYYY-MM-DD HH:mm:ss"),
      "image": imgSrc,
      "category_id": category,
      "article_series_id": articleSeries == '``' ? null : articleSeries,
      "link": data.link,
      "tag": data.tag,
      "admin_created_id": parseInt(id),
      "admin_updated_id": parseInt(id),
      "admin_deleted_id": null
    };
    console.log("request ", request);
    dispatch(addArticle({ ...request }))
      .then(function (response) {
        if (!response.error) {
          setPublic("yes");
          setCategory(categoryTemp);
          setArticleSeries(articleSeriesTemp)
          toggle();
          reset();
          toast.success("記事を登録しました。");
          router.push('/article/general/detail/'+response.payload.data.id)
        } else {
          toast.error("記事を登録しませんでした。");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("記事を登録しませんでした。");
      });
  };

  const handleClose = () => {
    setPublic("yes")
    setCategory(categoryTemp);
    setArticleSeries(articleSeriesTemp)
    toggle();
    reset();
  };

  // for handle public article
  const [publicArticle, setPublic] = useState("yes");
  const handleRadio = (event) => {
    console.log(event.target.value);
    setPublic(event.target.value);
  };

  // custom input for date
  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
  });

  // for image
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

  // for load category
  useEffect(() => {
    loadCategory();
    loadArticleSeries();
  }, []);
  const loadCategory = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res ", res.data.data);
        setDataCategory(res.data.data);
        console.log("098 id 0 ", res.data.data[0].id);
        setCategory(res.data.data[0].id);
        setCategoryTemp(res.data.data[0].id);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const loadArticleSeries = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/article_series", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res ", res.data.data);
        setDataArticleSeries(res.data.data);
        setArticleSeries('``')
        // console.log("098 id 0 ", res.data.data[0].id);
        // setArticleSeries(res.data.data[0].id);
        // setArticleSeriesTemp(res.data.data[0].id);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 350, sm: 750 }, maxWidth: "100%" },
      }}
    >
      <Header>
        <Typography variant="h6">記事登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormLabel>状態</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <RadioGroup
                  row
                  id="radioj"
                  aria-label="public"
                  name="validation-basic-radio"
                  onChange={handleRadio}
                  value={publicArticle}
                >
                  <FormControlLabel
                    value="yes"
                    label="公開"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="no"
                    label="非公開"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>タイトル</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="記事のタイトル"
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>サブタイトル</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="subtitle"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="記事のサブタイトル"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>公開日</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id="date"
                        selected={value}
                        showYearDropdown
                        showMonthDropdown
                        showTimeSelect
                        timeFormat="HH:mm:ss"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="yyyy/MM/dd HH:mm:ss"
                        onChange={(e) => onChange(e)}
                        placeholderText="MM/DD/YYYY"
                        customInput={
                          <CustomInput
                            value={value}
                            onChange={onChange}
                            aria-describedby="validation-basic-dob"
                          />
                        }
                      />
                    </DatePickerWrapper>
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
                <FormLabel>画像</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid fullWidth>
                  <ImgStyled
                    src={imgSrc}
                    alt="News Pic"
                    sx={{ maxWidth: "100%" }}
                  />
                </Grid>
                <ButtonStyled
                  component="label"
                  variant="outlined"
                  htmlFor="account-settings-upload-image"
                >
                  画像をアップロード
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
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>カテゴリー</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={category}
                  id="select-category"
                  labelId="category-select"
                  onChange={(e) => setCategory(e.target.value)}
                  inputProps={{ placeholder: "Select category" }}
                >
                  {dataCategory.map(({ name, id }, index) => (
                    <MenuItem value={id}>{name}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel >シリーズ</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={articleSeries}
                  id="select-article-series"
                  labelId="article-series-select"
                  onChange={(e) => setArticleSeries(e.target.value)}
                  inputProps={{ placeholder: "Select Article Series" }}
                > 
                  <MenuItem value='``'>選択してください</MenuItem>
                  {dataArticleSeries.map(({ title, id }, index) => (
                    <MenuItem value={id}>{title}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>リンク</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="link"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="リンク"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>タグ</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      {...field}
                      placeholder="記事に関連のあるキーワードを入力"
                    />
                  )}
                />
                <Typography sx={{ mt: 4 }} component="p" variant="caption">
                  タグはコンマ(,)で区切ってください。
                  <br />
                  例：キーワード1,キーワード2,キーワード3
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

export default SidebarAddArticle;

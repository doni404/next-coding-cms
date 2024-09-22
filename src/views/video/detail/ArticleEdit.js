// ** React Imports
import { useState, useEffect, forwardRef } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Store Imports
import { useDispatch } from "react-redux";

import axios from "axios";

import { useRouter } from "next/router";

import moment from "moment";

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
  date: yup.string().required(),
});

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const ArticleEdit = ({ data, id }) => {
  // ** State
  const [category, setCategory] = useState(null);
  const [articleSeries, setArticleSeries] = useState(null);
  const [subTitle, setSubTitle] = useState(null);
  const [content, setContent] = useState(data.data.content);
  const [orderNumber, setOrderNumber] = useState(data.data.order_number);
  const [link, setLink] = useState(null);
  const adminId = window.sessionStorage.getItem("id");
  const [dataCategory, setDataCategory] = useState([]);
  const [dataArticleSeries, setDataArticleSeries] = useState([]);
  const [tag, setTag] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [publicArticle, setPublic] = useState(null);
  console.log(data)
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  const getArticleData = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/articles/'+id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        imageWithAuth(res.data.data.image)
        setCategory(res.data.data.category.id)
        setArticleSeries(res.data.data.article_series_id == null ? '``' :res.data.data.article_series_id)
        setSubTitle(res.data.data.subtitle)
        setContent(res.data.data.content)
        setOrderNumber(res.data.data.order_number)
        setLink(res.data.data.link)
        setTag(res.data.data.tag)
        setPublic(res.data.data.public_access)
        setValue("title", res.data.data.title, { shouldValidate: true });
        setValue("date", new Date(res.data.data.release_date));
      })
      .catch((error) => {
        console.log("error ",error)
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }
  useEffect(() => {
    getArticleData()
    loadCategory()
    loadArticleSeries()
  }, []);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = (e) => {
    console.log("on submit ", e.title);
    // console.log("article series : ", articleSeries == '' ? null : articleSeries)
    const token = window.sessionStorage.getItem("token");
    const request = {
      category_id: category,
      article_series_id: articleSeries == '``' ? null :  articleSeries,
      title: e.title,
      subtitle: subTitle,
      content: content,
      order_number: parseInt(orderNumber),
      tag: tag,
      image: imgSrc,
      link: link,
      released_date: moment(e.date).format("YYYY-MM-DD HH:mm:ss"),
      public_access: publicArticle,
      admin_created_id: data.data.admin_created_id,
      admin_updated_id: parseInt(adminId),
    };

    console.log("request", request);
    var axios = require("axios");
    var config = {
      method: "put",
      url: BASE_URL_API + "v1/articles/" + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: request,
    };

    console.log("config url", config.url);

    axios(config)
      .then(function (response) {
        console.log(response);
        toast.success("記事が編集されました");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("記事が編集されませんでした。");
      });
  };

  // for handle public article
  const handleRadio = (event) => {
    console.log(event.target.value);
    setPublic(event.target.value);
  };

  // for image
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
  const imageWithAuth = async (image) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };
    const response = await axios.get(
      BASE_URL_API + "v1/resources?type=articles&filename=" + image,
      header
    );
    const fileReader = new FileReader();
    fileReader.readAsDataURL(response.data);
    fileReader.onloadend = function () {
      setImgSrc(fileReader.result);
    };
  };


  // for load category
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
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // for date
  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
  });

  console.log("article series : ", articleSeries)

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        記事詳細
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
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
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
                <FormLabel required>公開日</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: true }}
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
                        onChange={onChange}
                        customInput={
                          <CustomInput
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.date)}
                            aria-describedby="validation-basic-date"
                          />
                        }
                      />
                    </DatePickerWrapper>
                  )}
                />
                {errors.date && (
                  <FormHelperText
                    sx={{ mx: 3.5, color: "error.main" }}
                    id="validation-basic-dob"
                  >
                    Release date is required
                  </FormHelperText>
                )}
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
                <FormLabel>公開日</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid fullWidth>
                  <ImgStyled
                    src={imgSrc}
                    alt="News Pic"
                    onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
                    sx={{ maxWidth: "100%" }}
                  />
                </Grid>
                <ButtonStyled
                  component="label"
                  variant="outlined"
                  htmlFor="account-settings-upload-image"
                >
                  画像を選択
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
                <FormLabel>カテゴリー</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={category}
                  id="select-role"
                  labelId="role-select"
                  onChange={(e) => setCategory(e.target.value)}
                  inputProps={{ placeholder: "Select Category" }}
                >
                  {dataCategory.map(({ name, id }) => (
                    <MenuItem value={id}>{name}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>シリーズ</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={articleSeries}
                  id="select-role"
                  labelId="role-select"
                  onChange={(e) => setArticleSeries(e.target.value)}
                  inputProps={{ placeholder: "Select Article Series" }}
                >
                   <MenuItem value='``'>選択してください</MenuItem>
                  {dataArticleSeries.map(({ title, id }, index) => (
                    <MenuItem value={id} >{title}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          {articleSeries !== '``' ?(
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>表示順</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="orderNumber"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="表示順"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>) : null}
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
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
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
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
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
                  編集
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Box>
  );
};

export default ArticleEdit;

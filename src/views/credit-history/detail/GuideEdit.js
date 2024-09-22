// ** React Imports
import { useState, forwardRef, useEffect } from "react";

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
import toast from "react-hot-toast";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Store Imports
import { useDispatch } from 'react-redux'

import axios from 'axios'

import { useRouter } from 'next/router'

import moment from 'moment'

// ** Actions Imports
import { editGuide } from 'src/store/apps/guide'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
});


const GuideEdit = ({ data, id }) => {
  // ** State
  // const [role, setRole] = useState("subscriber");
  const [category, setCategory] = useState(null)
  const [content, setContent] = useState(data.data.content);
  console.log("content : ", content)
  const adminId = window.sessionStorage.getItem('id')
  const [dataCategory, setDataCategory] = useState([]);
  const [tag, setTag] = useState(null)
  const [publicGuide, setPublic] = useState(null);
  console.log("data guide",data)
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    getGuideData()
    loadCategory()
  }, [])

  const getGuideData = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/guides/' + id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log('res ', res.data.data)
        setCategory(res.data.data.guide_category.id)
        setContent(res.data.data.content)
        setTag(res.data.data.tag)
        setPublic(res.data.data.access)
        setValue('title', res.data.data.title, { shouldValidate: true })
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const loadCategory = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/guide_categories', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        setDataCategory(res.data.data)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

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
    console.log("on submit ", e.date)
    const token = window.sessionStorage.getItem('token')
    const request = {
      guide_category_id: category,
      title: e.title,
      content: content,
      tag: tag,
      access: publicGuide,
      admin_created_id: data.data.admin_created_id,
      admin_updated_id: parseInt(adminId)
    }

    console.log(request)
    var axios = require("axios");
    var config = {
      method: "put",
      url: BASE_URL_API + "v1/guides/" + id,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: request,
    };

    axios(config)
      .then(function (response) {
        console.log(response)
        toast.success("ガイドが編集されました");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("ガイドが編集されませんでした。");
      });
  };

  const handleRadio = (event) => {
    console.log(event.target.value);
    setPublic(event.target.value);
  };

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
      ガイド詳細
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
                  value={publicGuide}
                >
                  <FormControlLabel
                    value="public"
                    label="公開"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="private"
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
                      placeholder="ガイドのタイトル"
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
                <FormLabel>カテゴリー</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={category}
                  id="select-role"
                  labelId="role-select"
                  onChange={(e) => setCategory(e.target.value)}
                  inputProps={{ placeholder: "Select Role" }}
                >
                  {dataCategory.map(({ name, id }) => (
                    <MenuItem value={id}>{name}</MenuItem>
                  ))}
                </Select>
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
                      placeholder="ガイドに関連のあるキーワードを入力"
                    />
                  )}
                />
                <Typography sx={{ mt: 4 }} component="p" variant="caption">
                  タグはコンマ(,)で区切ってください。<br/>
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

export default GuideEdit;

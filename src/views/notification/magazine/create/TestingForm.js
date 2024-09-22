// ** React Imports
import { useState, forwardRef } from "react";

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
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

// ** Icons Imports
import Send from "mdi-material-ui/Send";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { setParam } from 'src/store/apps/mail_magazine_params'
// ** Axios
import axios from 'axios'

import toast from "react-hot-toast";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  email: yup.string().email("有効な電子メールを入力してください").required("Eメールは入力必須項目です。"),
  subject: yup.string().required("メール件名は入力必須項目です。"),
});

const defaultValues = {
  subject: "",
  email: "",
};


const TestingForm = ({setTopTitle, setTitle, setSubtitle, setIntro }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const html = useSelector((state) => state.mail_magazine_params)
  const dispatch = useDispatch();


  const onSubmit = (data) => {
    console.log('html ', html.value)

    dispatch(setParam(data))


    var params = {
      subject: data.subject,
      html_body: html.value.outerHTML,
      email: data.email
    }

    console.log(params)
    const token = window.sessionStorage.getItem('token')
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(BASE_URL_API + "v1/mail_magazine/send_test", params,header)
      .then(async response => {
        console.log(response)
        toast.success("メールを送信しました。");
      })
      .catch(err => {
        toast.error("メールを送信できませんでした。");
        if (errorCallback) errorCallback(err)
      })
  };

  const onChangeTopTitle = (data) => {
    setTopTitle(data)
  }

  const onChangeTitle = (data) => {
    setTitle(data)
  }

  const onChangeSubtitle = (data) => {
    setSubtitle(data)
  }

  const onChangeIntro = (data) => {
    setIntro(data)
  }
  return (
    <Box sx={{ pb: 5 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        配信用テスター
      </Typography>
      <Grid xs={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>Eメール送信先</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      type="email"
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
                <FormLabel required>件名</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="メール件名"
                      error={Boolean(errors.subject)}
                    />
                  )}
                />
                {errors.subject && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.subject.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>トップメルマガタイトル</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="top_title"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      value={value}
                      onChange={e => {
                        onChangeTopTitle(e.target.value);
                        onChange(e);
                      }}
                      placeholder="トップメルマガタイトル"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>メルマガタイトル</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      value={value}
                      onChange={e => {
                        onChangeTitle(e.target.value);
                        onChange(e);
                      }}
                      placeholder="メルマガタイトル"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>メルマガサブタイトル</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="subtitle"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      value={value}
                      onChange={e => {
                        onChangeSubtitle(e.target.value);
                        onChange(e);
                      }}
                      placeholder="メルマガサブタイトル"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>導入部テキスト</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="intro"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      value={value}
                      onChange={e => {
                        onChangeIntro(e.target.value);
                        onChange(e);
                      }}
                      placeholder="導入部テキスト"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>

          {/* <FormControl required fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>Top Article</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={article}
                  id="select-article"
                  labelId="article-select"
                  onChange={(e) => setArticle(e.target.value)}
                  inputProps={{ placeholder: "Select article" }}
                >
                  <MenuItem value="article1">Article 1</MenuItem>
                  <MenuItem value="article2">Article 2</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </FormControl> */}
          {/* <FormControl required fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>Top News</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={news}
                  id="select-news"
                  labelId="news-select"
                  onChange={(e) => setNews(e.target.value)}
                  inputProps={{ placeholder: "Select news" }}
                >
                  <MenuItem value="news1">News 1</MenuItem>
                  <MenuItem value="news2">News 2</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </FormControl> */}

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
                  endIcon={<Send />}
                >
                  送信
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Box>
  );
}

export default TestingForm;
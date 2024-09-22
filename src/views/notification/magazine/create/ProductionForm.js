// ** React Imports
import { useState, useEffect } from "react";

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

// ** Icons Imports
import Send from "mdi-material-ui/Send";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

import toast from "react-hot-toast";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  subject: yup.string().required(),
});

const defaultValues = {
  subject: "",
};

const TestingForm = ({setTopTitle,setTitle, setSubtitle, setIntro}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const store = useSelector((state) => state.mail_magazine_params)
  console.log(store)

  useEffect(() => {
    setValue('subject', store.param.subject)
    setValue('top_title', store.param.top_title)
    setValue('title', store.param.title)
    setValue('subtitle', store.param.subtitle)
    setValue('intro', store.param.intro)

    setTopTitle(store.param.top_title)
    setTitle(store.param.title)
    setSubtitle( store.param.subtitle)
    setIntro(store.param.intro)

  }, [store])
 

  const onSubmit = (data) => {
    const id = window.sessionStorage.getItem('id')
    const token = window.sessionStorage.getItem('token')
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    var params = {
      subject: data.subject,
      top_title : data.top_title,
      title : data.title,
      subtitle : data.subtitle,
      html_body: store.value.outerHTML,
      opening_text : data.intro,
      admin_created_id:parseInt(id),
      admin_deleted_id:null
    }

    console.log(params)
    axios
    .post(BASE_URL_API + "v1/mail_magazine", params,header)
    .then(async response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })

    var paramsEmail = {
      subject: data.subject,
      html_body: store.value.outerHTML,
      email: data.email
    }

    axios
      .post(BASE_URL_API + "v1/mail_magazine/send_production", paramsEmail,header)
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
    console.log('title ', data)
    setTopTitle(data)
  }

  const onChangeTitle = (data) => {
    console.log('title ', data)
    setTitle(data)
  }

  const onChangeSubtitle = (data) => {
    console.log('subtitle ', data)
    setSubtitle(data)
  }

  const onChangeIntro = (data) => {
    console.log('intro ', data)
    setIntro(data)
  }

  return (
    <Box sx={{ pb: 5 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        大量配信
      </Typography>
      <Grid xs={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
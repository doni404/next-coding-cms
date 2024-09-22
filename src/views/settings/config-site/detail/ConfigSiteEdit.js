// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Next Imports
import { useRouter } from "next/router";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  sender_name: yup.string().required("送信元名は入力必須項目です。"),
  sender_email: yup.string().required("送信元メールアドレスは入力必須項目です。"),
  admin_email: yup.string().required("管理者宛メールアドレスは入力必須項目です。"),
  tax_rate: yup.string().required("税率は入力必須項目です。"),
  note: yup.string().required("管理者備考は入力必須項目です。"),
});

const ConfigSiteEdit = ({ data, setRefreshKey }) => {
  // ** State
  const [configData, setConfigData] = useState([]);
  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    setConfigData(data.data);
    setValue("sender_name", data.data.sender_name);
    setValue("sender_email", data.data.sender_email);
    setValue("admin_email", data.data.admin_email);
    setValue("tax_rate", data.data.tax_rate);
    setValue("note", data.data.note);
  }, [data]);

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

  const onSubmit = (data) => {
    console.log("on submit ", data);

    const endpoint = BASE_URL_API + "v1/cms/configs/" + configData.id;
    axiosInstance.put(endpoint, data)
      .then(function (response) {
        console.log(response);
        setRefreshKey((prev) => prev + 1);
        toast.success("サイト設定が編集されました");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("サイトが編集されませんでした。");
      });
  };

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        サイト設定
      </Typography>
      <Grid xs={12} sm={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>送信元名</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="sender_name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="送信元名"
                      error={Boolean(errors.sender_name)}
                    />
                  )}
                />
                {errors.sender_name && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.sender_name.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>送信元メールアドレス</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="sender_email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      placeholder="送信元メールアドレス"
                      error={Boolean(errors.sender_email)}
                    />
                  )}
                />
                {errors.sender_email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.sender_email.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>管理者宛メールアドレス</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="admin_email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="管理者宛メールアドレス"
                      error={Boolean(errors.admin_email)}
                    />
                  )}
                />
                {errors.admin_email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.admin_email.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>税率</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="tax_rate"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box display="flex" alignItems="center" width="25%">
                      <TextField
                        {...field}
                        placeholder="税率"
                        error={Boolean(errors.tax_rate)}
                      />
                      <Box
                        component="span"
                        sx={{
                          fontSize: '1rem', // Adjust the font size to match the TextField
                          marginLeft: '8px', // Add some space between the TextField and the %
                        }}
                      >
                        %
                      </Box>
                    </Box>
                  )}
                />
                {errors.tax_rate && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.tax_rate.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>管理者備考</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      rows={4}
                      multiline
                      placeholder="管理者備考"
                    />
                  )}
                />
                {errors.note && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.note.message}
                  </FormHelperText>
                )}
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
              </Box>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Box>
  );
};

export default ConfigSiteEdit;

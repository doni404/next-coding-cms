// ** React Imports
import { useState, useCallback, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// ** Icons Imports
import Key from "mdi-material-ui/Key";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import LockOpenOutline from "mdi-material-ui/LockOpenOutline";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import axiosInstance from "src/helper/axiosInstance"

// ** Store Imports
import { useDispatch } from "react-redux";

const schema = yup.object().shape({
  newPassword: yup.string().min(4, "パスワードは4文字以上です。").required(),
  confirmNewPassword: yup
    .string()
    .required("新しいパスワードの確認は入力必須項目です。")
    .oneOf([yup.ref("newPassword"), null], "確認パスワードは一致する必要があります"),
});

const defaultValues = {
  newPassword: "",
  confirmNewPassword: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TabSecurity = () => {
  // const dataResponse = data.data;

  // ** Hooks
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");

  const [values, setValues] = useState({
    newPassword: "",
    showNewPassword: false,
    confirmNewPassword: "",
    showConfirmNewPassword: false,
  });

  const userData = JSON.parse(window.sessionStorage.getItem("userData"));
  console.log("user data : ", userData);

  // Handle Current Password
  const handleCurrentPasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  };

  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };

  // Handle New Password
  const handleNewPasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowConfirmNewPassword = () => {
    setValues({
      ...values,
      showConfirmNewPassword: !values.showConfirmNewPassword,
    });
  };

  const handleMouseDownConfirmNewPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    console.log("on submit id", userData.id);
    console.log(data.newPassword);
    var request = {
      password: data.newPassword,
    };

    const endpoint = BASE_URL_API + "v1/cms/admins/" + userData.id + "/update-password";

    axiosInstance.patch(endpoint, request)
      .then(function (response) {
        console.log("response", response);
        toast.success("パスワードが編集されました。");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("パスワードが編集されませんでした。");
      });
  };

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} sx={{mb: [0, 6] }}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="account-settings-new-password">
                    新しいパスワード
                  </InputLabel>
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <OutlinedInput
                        fullWidth
                        label="New password"
                        value={value}
                        id="newPassword"
                        error={Boolean(errors.newPassword)}
                        onChange={onChange}
                        type={values.showNewPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowNewPassword}
                              aria-label="toggle password visibility"
                              onMouseDown={handleMouseDownNewPassword}
                            >
                              {values.showNewPassword ? (
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
                  {errors.newPassword && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.newPassword.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="account-settings-confirm-new-password">
                    新しいパスワードの確認
                  </InputLabel>
                  <Controller
                    name="confirmNewPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <OutlinedInput
                        fullWidth
                        label="Confirm new password"
                        value={value}
                        id="confirmNewPassword"
                        error={Boolean(errors["confirmNewPassword"])}
                        type={
                          values.showConfirmNewPassword ? "text" : "password"
                        }
                        onChange={onChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="toggle password visibility"
                              onClick={handleClickShowConfirmNewPassword}
                              onMouseDown={handleMouseDownConfirmNewPassword}
                            >
                              {values.showConfirmNewPassword ? (
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
                  {errors["confirmNewPassword"] && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors["confirmNewPassword"].message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mr: 4 }}>
                  パスワードを変更する
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              mt: 2.5,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <img
              alt="avatar"
              src="/images/pages/account-settings-security-illustration.png"
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 0, mb: 6 }} />
      </CardContent>
    </form>
  );
};

export default TabSecurity;

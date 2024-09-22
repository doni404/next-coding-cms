// ** React Imports
import { useState } from "react";
import { Fragment } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from "react-hot-toast";

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

// ** Store Imports
import { useDispatch } from 'react-redux'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const schema = yup.object().shape({
  newPassword: yup.string().min(8, "8文字以上").required(),
  confirmNewPassword: yup
    .string()
    .required("新しいパスワードの確認は入力必須項目です。")
    .oneOf([yup.ref("newPassword"), null], "確認パスワードは一致する必要があります。"),
});

const defaultValues = {
  newPassword: "",
  "confirmNewPassword": "",
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const StudentPassword = ({data}) => {
  const dataResponse = data;

  // ** Hooks
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  
  const [values, setValues] = useState({
    newPassword: "",
    showNewPassword: false,
    confirmNewPassword: "",
    showConfirmNewPassword: false,
  });

  // Handle Password
  const handleNewPasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  // Handle Confirm Password
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
    console.log("on submit id", dataResponse.id);
    console.log(data.newPassword);
    var request = {
      "password": data.newPassword,
    };

    axiosInstance.patch(BASE_URL_API + "v1/cms/students/"+dataResponse.data.id+"/update-password", request)
      .then(function (response) {
        console.log("response", response);
        toast.success("パスワードが編集されました。");
        reset(); // Reset the form fields
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
    <Fragment>
      <Card sx={{ mb: 6 }}>
        <Box sx={{ p: 5, pb: 10 }}>
          <Typography variant="h5" sx={{ mb: 5 }}>
            パスワードの変更
          </Typography>
          <Grid xs={12}>
            <Alert icon={false} severity="warning" sx={{ mb: 8, mt: 5 }}>
              <AlertTitle
                sx={{ mb: (theme) => `${theme.spacing(1)} !important` }}
              >
                パスワード設定：
              </AlertTitle>
              8文字以上
            </Alert>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="newPassword">
                      新しいパスワード
                    </InputLabel>
                    <Controller
                      name="newPassword"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          fullWidth
                          label="新しいパスワード"
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
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 7, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="confirmNewPassword">
                      新しいパスワード（確認）
                    </InputLabel>
                    <Controller
                      name="confirmNewPassword"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <OutlinedInput
                          fullWidth
                          label="新しいパスワード（確認）"
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
                  </Grid>
                </Grid>
              </FormControl>
              <Grid fullWidth container>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ mr: 3 }}
                    >
                      パスワードを変更する
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
      </Card>
    </Fragment>
  );
};

export default StudentPassword;

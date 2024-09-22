// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// ** Actions Imports
import { addAdmin } from "src/store/apps/admin";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";

import axios from "axios";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field}は入力必須項目です。`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${min}文字以上`;
  } else {
    return "";
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  email: yup
    .string()
    .email("有効な電子メールではありません")
    .required("Eメールは入力必須項目です。"),
  name: yup
    .string()
    .min(3, (obj) => showErrors("名前", obj.value.length, obj.min))
    .required("名前は入力必須項目です"),
  password: yup.string().min(4, "パスワードは4文字以上です。").required(),
  "confirm-password": yup
    .string()
    .required("確認パスワードは入力必須項目です。")
    .oneOf(
      [yup.ref("password"), null],
      "パスワードが一致している必要があります"
    ),
  phone: yup.string().matches(/^\+?\d{6,15}$/, {
    message: "無効な電話番号",
    excludeEmptyString: true,
  }),
  role: yup.string().required("管理者の役割は入力必須項目です"),
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
  "confirm-password": "",
  phone: "",
  role: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddAdmin = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [dataResponse, setDataResponse] = useState([]);
  const [role, setRole] = useState("");
  const [state, setState] = useState({
    password: "",
    password2: "",
    showPassword: false,
    showPassword2: false,
  });

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle Password
  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Handle Confirm Password
  const handleClickShowConfirmPassword = () => {
    setState({ ...state, showPassword2: !state.showPassword2 });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
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

  useEffect(() => {
    loadAdminRoleData();
  }, []);

  const loadAdminRoleData = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/cms/admin-roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("load admin role : ", res);
        setDataResponse(res.data.data);
      })
      .catch((error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          router.replace('/unauthorized')
        }
      });
  };

  const onSubmit = (data) => {
    var data = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      situation: "active",
      admin_role_id: data.role,
    };

    console.log("Data submit : ", data);

    dispatch(addAdmin({ ...data })).unwrap()
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("管理者を登録しました。");
        } else {
          toast.error("管理者を登録しませんでした。");
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected : ", rejected.toString())
      }); 
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">管理者登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="名前"
                  onChange={onChange}
                  placeholder="John Doe"
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  type="email"
                  value={value}
                  label="Eメール"
                  onChange={onChange}
                  placeholder="johndoe@email.com"
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel htmlFor="password">パスワード</InputLabel>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label="Password"
                  id="password"
                  onChange={onChange}
                  error={Boolean(errors.password)}
                  type={state.showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={handleMouseDownPassword}
                        onClick={handleClickShowPassword}
                      >
                        {state.showPassword ? (
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
            {errors.password && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.password.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel htmlFor="confirm-password">パスワード確認</InputLabel>
            <Controller
              name="confirm-password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label="Confirm Password"
                  id="confirm-password"
                  onChange={onChange}
                  error={Boolean(errors["confirm-password"])}
                  type={state.showPassword2 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={handleMouseDownConfirmPassword}
                        onClick={handleClickShowConfirmPassword}
                      >
                        {state.showPassword2 ? (
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
            {errors["confirm-password"] && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors["confirm-password"].message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="電話番号"
                  onChange={onChange}
                  placeholder="電話番号"
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.phone.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel id="role-select">管理者の役割</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  fullWidth
                  id="role"
                  value={value}
                  label="Select Role"
                  labelId="role-select"
                  onChange={onChange}
                  inputProps={{ placeholder: "Select Role" }}
                  error={Boolean(errors.role)}
                >
                  {dataResponse.map(({ name_ja, id }, index) => (
                    <MenuItem value={id}>{name_ja}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.role && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.role.message}
              </FormHelperText>
            )}
          </FormControl>
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
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddAdmin;

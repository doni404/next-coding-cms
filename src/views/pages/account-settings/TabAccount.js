// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "src/helper/axiosInstance"

// ** Next Imports
import { useRouter } from "next/router";
import { InputAdornment, OutlinedInput } from "@mui/material";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field}は入力必須項目です。`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${min}文字以上`;
  } else {
    return "";
  }
};

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
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
  phone: yup.string()
    .nullable()
    .matches(/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
      message: "無効な電話番号",
      excludeEmptyString: true,
    }),
});

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

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TabAccount = (data) => {
  console.log("data tab account  : ", data)
  // ** State
  const [openAlert, setOpenAlert] = useState(true);
  const [imgSrc, setImgSrc] = useState("/images/avatars/1.png");

  const onChange = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };
  const userData = JSON.parse(window.sessionStorage.getItem("userData"));
  console.log("user data : ", userData);

  const [role, setRole] = useState(userData.admin_role.id);
  const [dataAdminRoles, setDataAdminRoles] = useState([]);
  const [situation, setSituation] = useState(userData.situation);
  const [note, setNote] = useState(userData.note);

  const router = useRouter();

  const loadAdminRoleData = async () => {
    const token = window.sessionStorage.getItem("token");
    axiosInstance.get(BASE_URL_API + "v1/cms/admin-roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("load admin role : ", res);
        setDataAdminRoles(res.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleRoleChange = useCallback((e) => {
    setRole(e.target.value);
  }, []);

  const handleRadio = (event) => {
    console.log(event.target.value);
    setSituation(event.target.value);
  };

  useEffect(() => {
    loadAdminRoleData();
    setValue("name", data.data.name, { shouldValidate: true });
    setValue("email", data.data.email, { shouldValidate: true });
    setValue("phone", data.data.phone);
    setNote(data.data.note)
    setSituation(data.data.situation)
    setRole(data.data.admin_role.id)
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
    console.log("on submit");
    var data = {
      name: e.name,
      email: e.email,
      phone: e.phone,
      admin_role_id: role,
      situation: situation,
      note: note,
    };

    console.log("data : ", data);

    const endpoint = BASE_URL_API + "v1/cms/admins/" + userData.id;
    axiosInstance.put(endpoint, data)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        toast.success("管理者が編集されました。");
        router.push("/pages/account-settings");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("管理者は編集できません。");
      });
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                fullWidth
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label="名前"
                    error={Boolean(errors.lastName)}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.name.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                required
                fullWidth
                name="email"
                type="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    required
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label="Eメール"
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{}}>
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    label="電話番号"
                    value={value}
                    onChange={onChange}
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl required fullWidth>
              <InputLabel>アクセス権限</InputLabel>
              <Select
                label="Role"
                value={role}
                defaultValue={role}
                labelId="user-view-status-label"
                onChange={handleRoleChange}
              >
                {dataAdminRoles.map(({ name_ja, id }, index) => (
                  <MenuItem value={id}>{name_ja}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <InputLabel id="radio">状態</InputLabel>
            <RadioGroup
              row
              id="radioj"
              aria-label="public"
              name="validation-basic-radio"
              onChange={handleRadio}
              value={situation}
            >
              <FormControlLabel
                value="active"
                label="アクティブ"
                sx={null}
                control={<Radio />}
              />
              <FormControlLabel
                value="inactive"
                label="非アクティブ"
                sx={null}
                control={<Radio />}
              />
            </RadioGroup>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  rows={4}
                  multiline
                  label="備考"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="備考"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 4 }}
            >
              編集
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );
};

export default TabAccount;

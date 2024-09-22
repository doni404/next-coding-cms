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
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

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
import { addAdminRole } from "src/store/apps/admin_roles";
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
  nameJa: yup
    .string()
    .required("グループ名は入力必須項目です"),
  role: yup.array().of(yup.object({value: yup.string(),
    }),
  )
  .min(1, '少なくとも 1 つの項目を選択してください')
  .required('個人の許可を得ては入力必須項目です'),
});

const defaultValues = {
  nameJa: "",
  role: [],
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddAdminRole = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [dataPermissions, setDataPermissions] = useState([]);

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

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
    getAllPermissions();
  }, []);

  const getAllPermissions = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/cms/admin-permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("load admin permissions : ", res.data.data.map((x) => x.name_ja).join(", "));
        setDataPermissions(res.data.data);
      })
      .catch((error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          router.replace('/unauthorized')
        }
      });
  };

  const [variantName, setVariantName] = useState([]);
  const [permission, setPermission] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;

    // console.log("value : ", value)
    var listSide = [];

    value.map((item) => (
      listSide.push(item.id)
    ))
    // console.log("item : ", listSide)

    setPermission(listSide)
    setVariantName(value);

    console.log("variant name : ", variantName)
  };

  const onSubmit = (data) => {
    var listrole = []
    data.role.map((item) => (
      listrole.push(item.id)
    ))

    var data = {
      name_ja: data.nameJa,
      admin_permissions: listrole,
    };
    
    console.log("Data submit : ", data)

    dispatch(addAdminRole({ ...data })).unwrap()
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("管理者の役割を登録しました。");
        } else {
          toast.error("管理者の役割を登録しませんでした。");
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
        <Typography variant="h6">管理者の役割登録</Typography>
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
              name="nameJa"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="グループ名"
                  onChange={onChange}
                  placeholder="John Doe"
                  error={Boolean(errors.nameJa)}
                />
              )}
            />
            {errors.nameJa && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.nameJa.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel id="multiple-checkbox-label">アクセス権限</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field: { value, onChange } }) => (
            <Select
              labelId="multiple-checkbox-label"
              id="multiple-checkbox"
              multiple
              value={value}
              onChange={onChange}
              input={<OutlinedInput label="アクセス権限" />}
              renderValue={(selected) => selected.map((x) => x.name_ja).join(", ")}
              MenuProps={MenuProps}
            >
              {dataPermissions.map((variant) => (
                <MenuItem key={variant.id} value={variant}>
                  <Checkbox
                    checked={value.findIndex((item) => item.id === variant.id) >= 0}
                  />
                  <ListItemText primary={variant.name_ja} />
                </MenuItem>
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

export default SidebarAddAdminRole;

// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import FormHelperText from "@mui/material/FormHelperText";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";
import { fetchData, deleteAdminRole } from "src/store/apps/admin_roles";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Next Imports
import { useRouter } from "next/router";

import axios from "axios";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field}は入力必須項目です。`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${min}文字以上`;
  } else {
    return "";
  }
};

// ** Styled <sup> component
const Sup = styled("sup")(({ theme }) => ({
  top: "0.2rem",
  left: "-0.6rem",
  position: "absolute",
  color: theme.palette.primary.main,
}));

// ** Styled <sub> component
const Sub = styled("sub")({
  fontWeight: 400,
  fontSize: ".875rem",
  lineHeight: "1.25rem",
  alignSelf: "flex-end",
});

const roleColors = {
  admin: "error",
  editor: "info",
  author: "warning",
  maintainer: "success",
  subscriber: "primary",
};

const statusColors = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
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

const schema = yup.object().shape({
  nameJa: yup.string().required("グループ名は入力必須項目です"),
  role: yup
    .array()
    .of(yup.object({ value: yup.string() }))
    .min(1, "少なくとも 1 つの項目を選択してください")
    .required("個人の許可を得ては入力必須項目です"),
});

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const AdminDetail = ({ data }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const dataResponse = data.data;
  const [dataPermissions, setDataPermissions] = useState([]);
  const [nameJa, setNameJa] = useState(dataResponse.name_ja);
  const [variantName, setVariantName] = useState([]);
  const [permission, setPermission] = useState([]);
  var listSide = [];

  // console.log("role : ", data)

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  
  const token = window.sessionStorage.getItem("token");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    getAllPermissions();
    setValue("nameJa", dataResponse.name_ja, { shouldValidate: true });
  }, []);

  const getAllPermissions = async () => {
    const token = window.sessionStorage.getItem("token");
    axios.get(BASE_URL_API + "v1/cms/admin-permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("load admin permissions : ", res);
        setDataPermissions(res.data.data);
        if (dataResponse.admin_permissions !== null) {
          const val = res.data.data.filter(
            (item) =>
              dataResponse.admin_permissions.findIndex(
                (o) => o.id === item.id
              ) >= 0
          );
          setVariantName(val);
          val.map((item) => listSide.push(item.id));
          setPermission(listSide);
          setValue("role", val, { shouldValidate: true });
        }
      })
      .catch((error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          router.replace('/unauthorized')
        }
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;

    // console.log("event : ", event);

    value.map((item) => listSide.push(item.id));
    // console.log("item : ", listSide);

    setPermission(listSide);
    setVariantName(value);

    // console.log("variant name : ", variantName);
  };

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => {
    setOpenEdit(false);
    setNameJa(dataResponse.name_ja);
  };

  const onSubmit = (e) => {
    console.log("role : ", e.role);
    var listrole = [];
    e.role.map((item) => listrole.push(item.id));

    var axios = require("axios");
    var data = {
      name_ja: e.nameJa,
      admin_permissions: listrole,
    };
    console.log(data);

    var config = {
      method: "put",
      url: BASE_URL_API + "v1/cms/admin-roles/" + dataResponse.id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setOpenEdit(false);
        toast.success("管理者の役割が編集されました。");
        router.push("/admin/role/list");
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.status === 403 || error.response.status === 401) {
          router.replace('/401')
        }
        toast.error("管理者の役割が編集されませんでした。");
      });
  };

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    dispatch(deleteAdminRole(dataResponse.id)).unwrap().then((response) => {
      setDeleteDialog(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("管理者の役割が削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("管理者の役割が削除されました。");
        router.push('/admin/role/list');
      }
    })
    .catch((rejectedValueOrSerializedError) => {
      const rejected = rejectedValueOrSerializedError.message
      console.log("rejected : ", rejected.toString())
    }); 
  };

  // delete admin
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false);
  };

  if (dataResponse) {
    return (
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            管理者の役割詳細
          </Typography>
          <Typography variant="body2">
            作成日 : {dataResponse.created_at} | 最終更新日 :{" "}
            {dataResponse.updated_at}
          </Typography>
          <Divider sx={{ mt: 4 }} />
          <Box sx={{ pt: 2, pb: 1 }}>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography
                variant="subtitle2"
                sx={{ mr: 2, color: "text.primary" }}
              >
                ID:
              </Typography>
              <Typography variant="body2">{dataResponse.id}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography
                variant="subtitle2"
                sx={{ mr: 2, color: "text.primary" }}
              >
                グループ名:
              </Typography>
              <Typography variant="body2">{dataResponse.name_ja}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}>
                アクセス権限:
              </Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {variantName.map((x) => x.name_ja).join(", ")}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions
          sx={{ display: "flex", justifyContent: "start", mt: "auto", pb: 11 }}
        >
          <Button
            size="large"
            variant="contained"
            sx={{ mr: 2 }}
            onClick={handleEditClickOpen}
          >
            編集
          </Button>
          <Button
            size="large"
            component="label"
            variant="outlined"
            onClick={handleDeleteClickOpen}
          >
            削除
          </Button>
        </CardActions>

        <Dialog
          open={deleteDialog}
          onClose={handleDeleteClose}
          aria-labelledby="user-view-edit"
          sx={{
            "& .MuiPaper-root": { width: "100%", maxWidth: 500, p: [2, 5] },
          }}
          aria-describedby="user-view-edit-description"
        >
          <DialogTitle
            id="user-view-edit"
            sx={{ textAlign: "center", fontSize: "1.5rem !important" }}
          >
            管理者の役割削除
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              variant="body2"
              id="user-view-edit-description"
              sx={{ textAlign: "center", mb: 5 }}
            >
              この管理者の役割を削除してもよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button variant="contained" sx={{ mr: 1 }} onClick={handleDelete}>
              削除する
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteClose}
            >
              キャンセル
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEdit}
          onClose={handleEditClose}
          aria-labelledby="user-view-edit"
          sx={{
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: 500,
              p: [2, 10],
            },
          }}
          aria-describedby="user-view-edit-description"
        >
          <DialogTitle
            id="user-view-edit"
            sx={{ textAlign: "center", fontSize: "1.5rem !important" }}
          >
            管理者の役割を編集
          </DialogTitle>
          <DialogContent>
            {/* <DialogContentText
              variant="body2"
              id="user-view-edit-description"
              sx={{ textAlign: "center", mb: 7 }}
            >
              After edit click "SUBMIT" to save the changes
            </DialogContentText> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6} sx={{ marginTop: ".5em" }}>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{}}>
                    <Controller
                      name="nameJa"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          required
                          fullWidth
                          label="グループ名"
                          value={value}
                          onChange={onChange}
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
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <InputLabel id="multiple-checkbox-label">
                      アクセス権限
                    </InputLabel>
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
                          renderValue={(selected) =>
                            selected.map((x) => x.name_ja).join(", ")
                          }
                          MenuProps={MenuProps}
                        >
                          {dataPermissions.map((variant) => (
                            <MenuItem key={variant.id} value={variant}>
                              <Checkbox
                                checked={
                                  value.findIndex(
                                    (item) => item.id === variant.id
                                  ) >= 0
                                }
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
                </Grid>
              </Grid>
              <DialogActions sx={{ justifyContent: "center" }}>
                <Button variant="contained" sx={{ mr: 1 }} type="submit">
                  保存
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditClose}
                >
                  キャンセル
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    );
  } else {
    return null;
  }
};

export default AdminDetail;

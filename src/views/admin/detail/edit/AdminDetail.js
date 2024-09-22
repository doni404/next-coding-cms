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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";
import { fetchData,deleteAdmin } from "src/store/apps/admin";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Next Imports
import { useRouter } from "next/router";

import axiosInstance from "src/helper/axiosInstance"

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

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const AdminDetail = ({ data }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const dataResponse = data.data;
  console.log("data responnese : ", dataResponse);
  const [role, setRole] = useState(dataResponse.admin_role.id);
  const [dataAdminRoles, setDataAdminRoles] = useState([]);
  const [situation, setSituation] = useState(dataResponse.situation);
  const [note, setNote] = useState(dataResponse.note);

  // console.log("role : ", data)

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter()

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // Handle Password
  const handleRoleChange = useCallback((e) => {
    setRole(e.target.value);
  }, []);

  const handleRadio = (event) => {
    console.log(event.target.value);
    setSituation(event.target.value);
  };

  useEffect(() => {
    loadAdminRoleData();
    setValue("name", dataResponse.name, { shouldValidate: true });
    setValue("email", dataResponse.email, { shouldValidate: true });
    setValue("phone", dataResponse.phone);
  }, []);

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
        console.log("error: ", error);
      });
  };

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const onSubmit = (e) => {
    console.log("e : ", e);
    var data = {
      name: e.name,
      email: e.email,
      phone: e.phone,
      admin_role_id: role,
      situation: situation,
      note: note,
    };

    console.log(data);
    const endpoint =  BASE_URL_API + "v1/cms/admins/" + dataResponse.id;

    axiosInstance.put(endpoint, data)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setOpenEdit(false);
        toast.success("管理者が編集されました。");
        router.push("/admin/list");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("管理者が編集されませんでした。");
      });
  };

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    dispatch(deleteAdmin(dataResponse.id)).unwrap()
    .then((response) => {
      setDeleteDialog(false);
      if (response.error) {
        console.log("error", response.error);
        toast.error("管理者が削除されませんでした。");
      } else {
        console.log("success", response);
        toast.success("管理者が削除されました。");
        router.push('/admin/list');
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
            管理者詳細
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
                名前:
              </Typography>
              <Typography variant="body2">{dataResponse.name}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography
                variant="subtitle2"
                sx={{ mr: 2, color: "text.primary" }}
              >
                Eメール:
              </Typography>
              <Typography variant="body2">{dataResponse.email}</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography
                variant="subtitle2"
                sx={{ mr: 2, color: "text.primary" }}
              >
                電話番号:
              </Typography>
              <Typography variant="body2">
                {dataResponse.phone === null || dataResponse.phone === ""
                  ? "-"
                  : dataResponse.phone}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}>
                職責:
              </Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {dataResponse.admin_role.name_ja}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}>
                状態:
              </Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {dataResponse.situation === "active"
                  ? "アクティブ"
                  : "非アクティブ"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mb: 2.7 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}>
                備考:
              </Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {dataResponse.note === null || dataResponse.note === ""
                  ? "-"
                  : dataResponse.note}
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
            管理者削除
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              variant="body2"
              id="user-view-edit-description"
              sx={{ textAlign: "center", mb: 5 }}
            >
              この管理者を削除してもよろしいですか？
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
            管理者を編集
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
                  <InputLabel id="role">状態</InputLabel>
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
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{}}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          required
                          fullWidth
                          value={value}
                          label="名前"
                          onChange={onChange}
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
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{}}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          required
                          fullWidth
                          type="email"
                          label="Eメール"
                          value={value}
                          onChange={onChange}
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
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth sx={{}}>
                    <Controller
                      name="phone"
                      control={control}
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
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <InputLabel id="role">管理者の役割</InputLabel>
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
                <Grid item xs={12} sm={12}>
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

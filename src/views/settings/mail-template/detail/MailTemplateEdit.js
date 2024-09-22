// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Store Imports
import { useDispatch } from "react-redux";

import { useRouter } from "next/router";

// ** Actions Imports
import { updateMailTemplate, deleteMailTemplate } from "src/store/apps/mail_template";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
  subject: yup.string().required("件名は入力必須項目です"),
});

const defaultValues = {
  title: "",
  subject: "",
  body: "",
  slug: "",
  variable: "",
};

const MailTemplateEdit = ({ data, id, setRefreshKey }) => {
  const dataRes = data.data
  // ** State
  const adminId = window.sessionStorage.getItem("id");
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if(dataRes) {
      setValue("body", dataRes.body);
      setValue("slug", dataRes.slug);
      setValue("variable", dataRes.variable);
      setValue("title", dataRes.title, { shouldValidate: true });
      setValue("subject", dataRes.subject, { shouldValidate: true });
    }
  }, []);

  const changes = JSON.parse(data.data.variable);

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

  const onSubmit = (formData) => {
    console.log("formData", formData);
    dispatch(updateMailTemplate({id, formData})).unwrap()
      .then((originalPromiseResult) => {
        console.log("success", originalPromiseResult);
        setRefreshKey((prev) => prev + 1);
        toast.success("自動メールが編集されました");
      })
      .catch((error) => {
        console.log("rejected", error);
        toast.error("自動メールが編集されませんでした。");
      });
    };

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log("id ", id);
    dispatch(deleteMailTemplate(id))
    .then((response) => {
        setDeleteDialog(false);
        if (response.error) {
          console.log("error", response.error);
          toast.error("Delete was error");
        } else {
          console.log("success", response);
          toast.success("自動メールが削除されました。");
          router.push('/mail-template/list');
        }
      })
  };

  // delete category
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false)
  }

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        自動メール詳細
      </Typography>
      <Grid xs={12} sm={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{ mb: { xs: 6, sm: 4 } }}
          >
            <Grid item xs={2} sm={4}>
              <FormLabel>ID</FormLabel>
              <FormLabel sx={{ display: { xs: "inline", sm: "none" }, ml: 2 }}>
                :
              </FormLabel>
            </Grid>
            <Grid item xs={10} sm={8}>
              <FormLabel>{data.data.id}</FormLabel>
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>タイトル</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      {...field}
                      placeholder="タイトル"
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.title.message}
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
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      {...field}
                      placeholder="件名"
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
                <FormLabel>内容</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      {...field}
                      rows={15}
                      multiline
                      sx={{ width: ['100%', '150%', '150%'] }}
                      placeholder="内容"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          {changes !== null ? 
          <>
          <Divider sx={{ width: ['100%', '150%', '150%'], mt: { xs: 5, sm: 2 } }} />
          <Grid fullWidth container sx={{ mb: { xs: 5, sm: 8 }, width: ['100%', '150%', '150%'] }}>
            <Grid item xs={12} sm={4} sx={{ maxWidth: '22% !important' }}>
              <FormLabel></FormLabel>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" sx={{ pt: 3 }}>
                メール本文内には「変数」が使用されています。下記はそれぞれの変数の説明です。
              </Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize:"1rem !important" }}>変数名</TableCell>
                      <TableCell sx={{ fontSize:"1rem !important" }}>説明</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {changes.map((row) => (
                      <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontSize:"1rem !important" }} component="th" scope="row">{row?.name}</TableCell>
                        <TableCell sx={{ fontSize:"1rem !important" }}>{row?.description_jp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid> 
          </> : null}
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
                <Button
                  size="large"
                  component="label"
                  variant="outlined"
                  onClick={handleDeleteClickOpen}
                >
                  削除
                </Button>
              </Box>
            </Grid>
          </Grid>
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
              自動メールを削除します
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                variant="body2"
                id="user-view-edit-description"
                sx={{ textAlign: "center", mb: 5 }}
              >
                自動メールを削除してもよろしいですか？
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
        </form>
      </Grid>
    </Box>
  );
};

export default MailTemplateEdit;

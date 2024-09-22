// ** React Imports
import { useState, forwardRef, useEffect, useCallback } from "react";

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

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** Store Imports
import { useDispatch } from "react-redux";

import { useRouter } from "next/router";

// ** Actions Imports
import {updateFaqsCategory, deleteFaqsCategory } from "src/store/apps/faq_category";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  title: yup.string().required("カテゴリー名は入力必須項目です。"),
});

const defaultValues = {
  title: "",
  situation: "",
  total_faq: "",
};

const FaqsCategoryEdit = ({ data, id, setRefreshKey }) => {
  // ** State
  const dataRes = data.data;
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if(dataRes) {
      setValue("title", data.data.title, { shouldValidate: true });
      setValue("situation", data.data.situation);
      setValue("total_faq", data.data.total_faq);
    }
  }, []);

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
    console.log("on submit ", formData);

    dispatch(updateFaqsCategory({ id, formData }))
    .unwrap()
    .then((originalPromiseResult) => {
      console.log("success", originalPromiseResult);
      setRefreshKey((prev) => prev + 1);
      toast.success("FAQカテゴリーが編集されました");
    })
    .catch((error) => {
      console.log("rejected", error);
      toast.error("FAQカテゴリーが編集されませんでした。");
    });
  };

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log("id ", id);
    dispatch(deleteFaqsCategory(id))
    .unwrap()
    .then((response) => {
        setDeleteDialog(false);
        if (response.error) {
          console.log("error ", response.error);
          toast.error("FAQカテゴリーが削除されませんでした。");
        } else {
          console.log("success", response);
          toast.success("FAQカテゴリーが削除されました。");
          router.push('/faq/category/list');
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected ", rejected);
      });
  };

  // delete faqs
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false)
  }

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        FAQカテゴリー詳細
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
              <FormLabel>{dataRes.id}</FormLabel>
            </Grid>
          </Grid>
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{ mb: { xs: 6, sm: 4 } }}
          >
            <Grid item xs={2} sm={4}>
              <FormLabel>FAQ合計</FormLabel>
              <FormLabel sx={{ display: { xs: "inline", sm: "none" }, ml: 2 }}>
                :
              </FormLabel>
            </Grid>
            <Grid item xs={10} sm={8}>
              <FormLabel>{dataRes.total_faq}</FormLabel>
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormLabel>状態</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="situation"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row id="situation" aria-label="public" {...field}>
                      <FormControlLabel
                        value="show"
                        label="公開"
                        sx={null}
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="hide"
                        label="非公開"
                        sx={null}
                        control={<Radio />}
                      />
                    </RadioGroup>
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>カテゴリー名</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="カテゴリー名"
                      error={Boolean(errors.name)}
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
              FAQカテゴリーを削除します
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                variant="body2"
                id="user-view-edit-description"
                sx={{ textAlign: "center", mb: 5 }}
              >
                FAQカテゴリーを削除してもよろしいですか？
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

export default FaqsCategoryEdit;

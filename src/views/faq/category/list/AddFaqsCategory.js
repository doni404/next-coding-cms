// ** React Imports
import { useState, forwardRef, useEffect } from "react";

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
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Actions Imports
import { addFaqsCategory } from "src/store/apps/faq_category";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// ** router
import { useRouter } from "next/router"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  title: yup.string().required("名は入力必須項目です。"),
});

const defaultValues = {
  title: "",
  situation: "show",
  total_faq: 0,
};

const SidebarAddFaqsCategory = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State

  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

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

  const onSubmit = (data) => {
    console.log("request data : ", data);
    dispatch(addFaqsCategory({ ...data })).unwrap()
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("FAQカテゴリーを登録しました。");
        } else {
          toast.error("FAQカテゴリーを登録しませんでした。");
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected ", rejected);
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
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 450 } } }}
    >
      <Header>
        <Typography variant="h6">FAQカテゴリー登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel>状態</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  label="カテゴリー名"
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
          </FormControl>
          <Grid fullWidth container>
            <Grid item xs={12} sm={8}>
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
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddFaqsCategory;

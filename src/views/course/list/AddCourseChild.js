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
import Grid from "@mui/material/Grid";
import FormLabel from '@mui/material/FormLabel'
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
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

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";

import axios from "axios";
import { addCoursesChild } from "src/store/apps/course_child";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name_ja: yup.string().required("コース名入力必須項目です")
});

const defaultValues = {
  name_en: "",
  name_ja: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddCourseChild = (props) => {
  console.log("props : ", props)
  const dataResponse = props.data
  // ** Props
  const { open, toggle } = props;

  // ** Hooks
  const dispatch = useDispatch();

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
    console.log("Data submit");
    
    var data = {
      category_id: dataResponse.id,
      name_en: data.name_en,
      name_ja: data.name_ja,
      total_teacher: 0,
    };

    console.log("Data submit : ", data);

    dispatch(addCoursesChild({ ...data })).unwrap()
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("子コースを登録しました。");
        } else {
          console.log(response.error);
          toast.error("子コースを登録できませんでした。");
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        if (rejected.toString().includes('403') || rejected.toString().includes('401')) {
          router.replace("/401");
        }
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
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 500 } } }}
    >
      <Header>
        <Typography variant="h6">子コース登録</Typography>
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
              name="name_ja"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="コース名（日本語）"
                  onChange={onChange}
                  placeholder="コース名（日本語）"
                  error={Boolean(errors.name_ja)}
                />
              )}
            />
            {errors.name_ja && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name_ja.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="name_en"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="コース名（英語）"
                  onChange={onChange}
                  placeholder="コース名（英語）"
                  error={Boolean(errors.name_en)}
                />
              )}
            />
            {errors.name_en && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name_en.message}
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

export default SidebarAddCourseChild;

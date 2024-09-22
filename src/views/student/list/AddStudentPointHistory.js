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
import SidebarAddStudent from "./AddStudentDrawer";
import { addStudentPointHistory } from "src/store/apps/student_point_history";

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
  transactionType: yup.string().required("取引の種類は入力必須項目です"),
  point: yup.string().required("増減ポイントは入力必須項目です"),
});

const defaultValues = {
  transactionType: "gift_gain",
  point: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddStudentPointHistory = ({setRefreshKey, ...props}) => {
  console.log("props : ", props)
  const dataResponse = props.data;
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
      student_id: dataResponse.id,
      transaction_type: data.transactionType,
      point: parseInt(data.point),
    };

    console.log("Data submit : ", data);

    dispatch(addStudentPointHistory({ ...data }))
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          setRefreshKey(prevKey => prevKey + 1); // Use setRefreshKey
          toast.success("ポイント取引が成功裏に作成されました。");
        } else {
          console.log(response.error);
          toast.error("ポイント取引の作成に失敗しました。");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("ポイント取引の作成に失敗しました。");
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
        <Typography variant="h6">ポイント増減登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormControl fullWidth sx={{ mb: 6 }}>
        <InputLabel id="ref-select" required>取引の種類</InputLabel>
            <Controller
              name="transactionType"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  required
                  value={value}
                  id="select-reference"
                  label="取引の種類"
                  labelId="reference-select"
                  onChange={onChange}
                  inputProps={{ placeholder: "取引の種類" }}
                  >
                  <MenuItem value="gift_gain">特別進呈P</MenuItem>
                </Select>
              )}
            />
            {errors.transactionType && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.transactionType.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="point"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="増減ポイント"
                  onChange={(e) => {
                    let newValue = e.target.value;
                    if (newValue === '0') {
                      newValue = '';
                    }
                    if (!isNaN(newValue) && !(newValue[0] === '0' && newValue.length > 1)) {
                      onChange(newValue);
                    }
                  }}
                  placeholder="増減ポイント"
                  error={Boolean(errors.point)}
                  inputProps={{ inputMode: 'numeric' }}
                />
              )}
            />
            {errors.point && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.point.message}
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

export default SidebarAddStudentPointHistory;

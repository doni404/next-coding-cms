// ** React Imports
import { useState, forwardRef, useEffect } from "react";

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid";

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { useRouter } from 'next/router'
import ja from 'date-fns/locale/ja'; 

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addVideoNews } from 'src/store/apps/video_news'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import moment from 'moment'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
  published_date: yup.string().required("公開日は入力必須項目です。"),
});

const defaultValues = {
  title: "",
  published_date: "",
  situation: "show",
  content: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarVideoAddNews = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State

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
    console.log("request : ", data);
    dispatch(addVideoNews({ ...data }))
      .unwrap()
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("ニュースを登録しました。");
        } else {
          toast.error("ニュースを登録しませんでした。");
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected", rejected);
      });
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
  });

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 350, sm: 450 }, maxWidth: "100%" },
      }}
    >
      <Header>
        <Typography variant="h6">ニュース登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">状態</FormLabel>
            <Controller
              name="situation"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup row aria-label="public" {...field}>
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
                  label="タイトル"
                  value={value}
                  onChange={onChange}
                  placeholder="ニュースのタイトル"
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.title.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="published_date"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <DatePickerWrapper>
                  <DatePicker
                    id="published_date"
                    selected={value ? new Date(value) : null}
                    showYearDropdown
                    showMonthDropdown
                    showTimeSelect
                    timeFormat="HH:mm:ss"
                    timeIntervals={15}
                    timeCaption="時刻"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    onChange={(date) => {
                      if (date) {
                        onChange(moment(date).format("YYYY-MM-DD HH:mm:ss"));
                      } else {
                        onChange(null);
                      }
                    }}
                    placeholderText="YYYY-MM-DD"
                    locale={ja}
                    customInput={
                      <CustomInput
                        label="公開日"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.published_date)}
                        aria-describedby="validation-basic-date"
                      />
                    }
                  />
                </DatePickerWrapper>
              )}
            />
            {errors.published_date && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.published_date.message}
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

export default SidebarVideoAddNews

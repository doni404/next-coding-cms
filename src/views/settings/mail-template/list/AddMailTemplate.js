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

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import axios from 'axios'

import moment from 'moment'
import { addMailTemplate } from "src/store/apps/mail_template";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
  subject: yup.string().required("件名は入力必須項目です。"),
  slug: yup.string().required("ナメクジは入力必須項目です。").uppercase(),
});

const defaultValues = {
  title: "",
  subject: "",
  slug: "",
};

const SidebarAddMailTemplate = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [body, setBody] = useState(null);
  const [slug, setSlug] = useState(null);
  const [variable, setVariable] = useState(null);

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

  useEffect(() => {

  }, [])

  const onSubmit = (data) => {

    const id = window.sessionStorage.getItem('id')
    console.log("form data ", data)

    var request = {
      title: data.title,
      subject: data.subject,
      body: body,
      slug: data.slug,
      variable: variable,
    }
    console.log("request data : ",request)
    dispatch(addMailTemplate({ ...request }))
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("自動メールを登録しました。");
        } else {
          toast.error("自動メールを登録しませんでした。");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("自動メールを登録しませんでした。");
      });
  };

  const handleClose = () => {
    toggle();
    reset();
  };


  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
  });
  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  }));

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 350, sm: 750 }, maxWidth: "100%" },
      }}
    >
      <Header>
        <Typography variant="h6">自動メール登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
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
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
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
                      rows={4}
                      multiline
                      {...field}
                      placeholder="内容"
                      onChange={e => setBody(e.target.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>ナメクジ</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="slug"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value.toUpperCase()}
                      onChange={onChange}
                      placeholder="ナメクジ"
                      error={Boolean(errors.slug)}
                    />
                  )}
                />
                {errors.slug && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.slug.message}
                  </FormHelperText>
                )}
                <Typography sx={{ mt: 4, color : "red", marginTop : 1 }} component="p" variant="caption">
                    *このナメクジは一意である必要があります。
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>置換可能な変数</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="variable"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={e => setVariable(e.target.value)}
                      placeholder="置換可能な変数"
                    />
                  )}
                />
                <Typography sx={{ mt: 4, color : "red", marginTop : 1 }} component="p" variant="caption">
                  *変数はカンマ「,」で区切ります。
                </Typography>
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

export default SidebarAddMailTemplate

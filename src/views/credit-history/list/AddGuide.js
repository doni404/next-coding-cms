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

// ** Actions Imports
import { addGuide } from 'src/store/apps/guide'

import { useRouter } from 'next/router'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

import axios from 'axios'

import moment from 'moment'

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
});

const defaultValues = {
  title: "",
  tag:"",
};

const SidebarAddGuide = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [category, setCategory] = useState("");
  const [dataCategory, setDataCategory] = useState([]);
  const [categoryTemp, setCategoryTemp] = useState("");

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

  const router = useRouter()

  useEffect(() => {
    loadCategory()
  }, [])

  const loadCategory = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/guide_categories', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log('res ', res.data.data)
        setDataCategory(res.data.data)
        setCategory(res.data.data[0].id);
        setCategoryTemp(res.data.data[0].id);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const onSubmit = (data) => {

    const id = window.sessionStorage.getItem('id')
    console.log("test ", data)
    var request = {
      "guide_category_id": category,
      "title": data.title,
      "tag": data.tag,
      "access": publicGuide,
      "admin_created_id": parseInt(id),
      "admin_updated_id": parseInt(id),
      "admin_deleted_id": null
    }
    console.log(request)
    dispatch(addGuide({ ...request }))
      .then(function (response) {
        if (!response.error) {
          setPublic("public");
          setCategory(categoryTemp);
          toggle();
          reset();
          toast.success("ガイドを登録しました。");
          router.push('/guide/general/detail/'+response.payload.data.id)
        } else {
          toast.error("ガイドを登録しませんでした。");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("ガイドを登録しませんでした。");
      });
  };

  const handleClose = () => {
    setPublic("public")
    setCategory(categoryTemp);
    toggle();
    reset();
  };

  const [publicGuide, setPublic] = useState("public");
  const handleRadio = (event) => {
    console.log(event.target.value);
    setPublic(event.target.value);
  };

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
        <Typography variant="h6">ガイド登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormLabel>状態</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <RadioGroup
                  row
                  id="radioj"
                  aria-label="gender"
                  name="validation-basic-radio"
                  onChange={handleRadio}
                  value={publicGuide}
                >
                  <FormControlLabel
                    value="public"
                    label="公開"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="private"
                    label="非公開"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </FormControl>
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
                      placeholder="ガイドのタイトル"
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
                <FormLabel required>カテゴリー</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={category}
                  id="select-category"
                  labelId="role-select"
                  onChange={(e) => setCategory(e.target.value)}
                  inputProps={{ placeholder: "Select Role" }}
                >
                  {dataCategory.map(({ name, id }, index) => (
                    <MenuItem value={id}>{name}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>タグ</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      {...field}
                      placeholder="記事に関連のあるキーワードを入力"
                    />
                  )}
                />
                <Typography sx={{ mt: 4 }} component="p" variant="caption">
                  タグはコンマ(,)で区切ってください。<br/>
                  例：キーワード1,キーワード2,キーワード3
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

export default SidebarAddGuide

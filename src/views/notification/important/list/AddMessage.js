// ** React Imports
import { useState, useEffect } from "react";

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
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import CardContent from "@mui/material/CardContent";
import { convertToRaw } from 'draft-js'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from "react-hot-toast";

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Send from "mdi-material-ui/Send";

// ** Store Imports
import { useDispatch } from 'react-redux'
import { addMailSend } from 'src/store/apps/mail_send'

// ** Actions Imports
import EditorControlled from "./EditorControlled";

import axios from 'axios'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg';

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  subject: yup.string().required("件名は入力必須項目です。")
});

export const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddMessage = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [recipient, setRecipient] = useState("individual");
  const [target, setTarget] = useState("all");
  const [type] = useState("info");
  const [account, setAccount] = useState("");
  const [dataAccount, setDataAccount] = useState([]);
  const [accountTemp, setAccountTemp] = useState("");
  const [content, setContent] = useState({});
  const sendDataToParent = (data) => { // the callback. Use a better name
    setContent(convertToRaw(data.getCurrentContent()));
  };
  //** convert to html
  const markup = draftToHtml(content);

  // ** Hooks
  const dispatch = useDispatch();

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    loadAccount()
  }, [props])

  const loadAccount = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/accounts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log('res ', res.data.data)
        setDataAccount(res.data.data)
        setAccount(res.data.data[0].email);
        setAccountTemp(res.data.data[0].email);
        setValue('subject', '')
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const onSubmit = (data) => {

    const id = window.sessionStorage.getItem('id')
    console.log("data submit ", data)

    var request = {
      email: account,
      target: recipient === "bulk" ? target : recipient,
      subject: data.subject,
      content: markup,
      type: type,
      admin_created_id: parseInt(id),
      admin_deleted_id: null,
    }
    console.log("request : ", request)
    dispatch(addMailSend({ ...request }))
      .then(function (response) {
        if (!response.error) {
          setAccount(accountTemp);
          toggle();
          reset();
          toast.success("重要メールを登録しました。");
        } else {
          toast.error("重要メールを登録しませんでした。");
        }
      })
      .catch(function (error) {
        console.log("error ",error);
        toast.error("重要メールを登録しませんでした。");
      });
  };

  const handleClose = () => {
    setAccount(accountTemp);
    toggle();
    reset();
  };

  const handleRadio = (event) => {
    // console.log("recipient : " ,event.target.value);
    setRecipient(event.target.value);
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
        <Typography variant="h6">重要メール作成</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  value={recipient}
                >
                  <FormControlLabel
                    value="individual"
                    label="個別"
                    sx={null}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="bulk"
                    label="一括"
                    sx={null}
                    control={<Radio />}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </FormControl>
          {recipient === 'bulk' &&(
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel >受信者</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={target}
                  id="select-target"
                  labelId="target-select"
                  onChange={(e) => setTarget(e.target.value)}
                  inputProps={{ placeholder: "Select target" }}
                >
                  <MenuItem value="seller">売り手</MenuItem>
                  <MenuItem value="buyer">買い手</MenuItem>
                  <MenuItem value="all">全て</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          )}
          {recipient === 'individual' &&(
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel >受信者</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  fullWidth
                  value={account}
                  id="select-account"
                  labelId="account-select"
                  onChange={(e) => setAccount(e.target.value)}
                  inputProps={{ placeholder: "Select Role" }}
                >
                  {dataAccount.map(({ username, email }, index) => (
                    <MenuItem value={email}>{username}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          )}
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
                <FormLabel >本文</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <EditorWrapper sx={{ padding: 0 }}>
                  <Grid item xs={12}>
                    <CardContent sx={{ padding: 0 }}>
                      <EditorControlled
                        content={content}
                        sendDataToParent={sendDataToParent}
                        json={isJson(content)}
                      />
                    </CardContent>
                  </Grid>
                </EditorWrapper>
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
                  endIcon={<Send />}
                >
                  送信
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

export default SidebarAddMessage;

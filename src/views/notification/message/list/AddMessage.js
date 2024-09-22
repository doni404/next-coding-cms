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
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";


// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Send from "mdi-material-ui/Send";

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

// ** Data dummy
import { top100Films } from 'src/@fake-db/autocomplete'

import axios from "axios";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  // recipient: yup.string().required(),
  // type: yup.string().required(),
  subject: yup.string().required("件名は入力必須項目です。"),
  body: yup.string().required("本文は入力必須項目です。"),
});

const defaultValues = {
  recipient: "",
  type: "",
  subject: "",
  body: "",
};

const SidebarAddMessage = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** Hooks
  const dispatch = useDispatch();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // dispatch(addUser({ ...data, role, currentPlan: plan }));
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
    setRecipient("all");
    setSelectDisable(true);
  };

  const [recipient, setRecipient] = useState("all");
  const [selectDisable, setSelectDisable] = useState(true);
  const handleRadio = (event) => {
    console.log(event.target.value);
    setRecipient(event.target.value);

    if (event.target.value == "all") {
      setSelectDisable(true);
    } else {
      setSelectDisable(false);
    }
  };

  // get all accounts data for select
  const [dataResponse, setDataResponse] = useState([]);
  useEffect(() => {
    loadAccountsData();
  }, []);
  const loadAccountsData = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDataResponse(res.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  console.log("dataResponse are", dataResponse);

  const [accounts, setAccounts] = useState();
  console.log("accounts are", accounts);
  

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
        <Typography variant="h6">メッセージ作成</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl required fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{ pt: { xs: 0, sm: 4 }, pb: { xs: 0, sm: 4 } }}
              >
                <FormLabel required>送信先</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Box sx={{ mb: 2, pt: 2 }}>
                  <RadioGroup
                    row
                    id="radioj"
                    aria-label="gender"
                    name="validation-basic-radio"
                    onChange={handleRadio}
                    value={recipient}
                  >
                    <FormControlLabel
                      value="all"
                      label="全員"
                      sx={null}
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value="some"
                      label="選択"
                      sx={null}
                      control={<Radio />}
                    />
                  </RadioGroup>
                </Box>
                <Box>
                  <FormControl fullWidth>
                    <Autocomplete
                      disabled={selectDisable}
                      multiple
                      options={dataResponse}
                      id="autocompletej"
                      getOptionLabel={(option) => option.username}
                      onChange={(event, value) => setAccounts(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="送信先を選択"
                          placeholder="送信先を選択"
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.username}
                        </li>
                      )}
                    />
                  </FormControl>
                </Box>
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
                      placeholder="メッセージ件名"
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
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>本文</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="body"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      rows={4}
                      multiline
                      {...field}
                      placeholder="メッセージ本文"
                      error={Boolean(errors.body)}
                    />
                  )}
                />
                {errors.body && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.body.message}
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

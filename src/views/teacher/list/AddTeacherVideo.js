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
import SingleFileUpload from "src/components/SingleFileUpload";

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

import { addTeacherVideo } from "src/store/apps/teacher_video";


const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  title: yup.string().required("動画名が必要です。"),
  type: yup.string().required("タイプが必要です。").oneOf(["youtube", "own"], "無効な状況選択"),
  url: yup.string().test('is-youtube', '無効なYouTubeのURL', function (value) {
    const { type } = this.parent;
    if (type === 'youtube') {
      if (!value) {
        return this.createError({ message: "URLが必要です。" });
      }
      return /^((?:https?:)?\/\/)?((?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|(?:youtu\.be)\/([a-zA-Z0-9_-]{11}))(\?[\w=&]+)?$/.test(value);
    }
    return true;
  }),
  videoFiles: yup.mixed().test('file', 'ファイルを選択する必要があります。', function (value) {
    const { type } = this.parent;
    if (type === 'own') {
      return value && value.length > 0;
    }
    return true;
  }),
});

const defaultValues = {
  title: "",
  type: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddTeacherTournament = (props) => {
  // ** Props
  const dataResponse = props.data
  // ** States
  const [isLoading, setIsLoading] = useState(false);
  // Form
  // Handle file uploads from child component
  const [videoFiles, setVideoFiles] = useState([]);

  // ** Props
  const { open, toggle } = props;

  // ** Hooks
  const dispatch = useDispatch();

  const {
    reset,
    watch,
    control,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const type = watch('type');

  const onSubmit = (data) => {
    console.log("type:", data.type);

    const formData = new FormData();
    if (data.type === "youtube") {
      formData.append("url", data.url);
    }
    if (data.type === "own") {
      console.log("videoFiles:", videoFiles);
      videoFiles.forEach((file) => {
        formData.append("file", file);
      });
    }
    console.log("dataResponse.id:", dataResponse.id);
    formData.append("teacher_id", dataResponse.id);
    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("situation", "show");
    // formData.append("thumbnail", thumbnail);
    console.log(Object.fromEntries(formData.entries()));

    setIsLoading(true);

    dispatch(addTeacherVideo(formData))
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("動画を登録しました。");
          setIsLoading(false);
        } else {
          console.log(response.error);
          toast.error("新しい動画を正常に追加しました。");
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("新しい動画の追加に失敗しました。");
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
        <Typography variant="h6">動画登録</Typography>
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
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  value={value}
                  label="動画名"
                  onChange={onChange}
                  placeholder="動画名"
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
            <Grid fullWidth container>
              <Grid item xs={12} sm={2} sx={{ pt: 2, pb: 2 }}>
                <FormLabel required component="legend">
                  タイプ
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel
                        value="youtube"
                        label="YouTube"
                        sx={null}
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="own"
                        label="ファイル"
                        sx={null}
                        control={<Radio />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.type && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          {type === "youtube" && (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Grid fullWidth container>
                <Grid item xs={12} sm={4} sx={{ pt: 2, pb: 2 }}>
                  <FormLabel required component="legend">
                    YouTube URL
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="url"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        className="handle-url"
                        rows={3}
                        multiline
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="ここにYouTubeのURLを入力してください"
                        error={Boolean(errors.url)}
                      />
                    )}
                  />
                  {errors.url && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.url.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </FormControl>
          )}
          {type === "own" && (
            <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
              <Grid fullWidth container>
                <Grid item xs={12} sm={2} sx={{ pt: 2, pb: 2 }}>
                  <FormLabel required component="legend">
                    ファイル
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <SingleFileUpload
                    setVideoFiles={setVideoFiles}
                    setValue={setValue}
                    trigger={trigger}
                    error={Boolean(errors.videoFiles)}
                  />
                  {errors.videoFiles && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.videoFiles.message}
                    </FormHelperText>
                  )}
                  <Typography sx={{ mt: 4 }} component="p" variant="caption">
                    動画はMP4形式で、300MB以内
                  </Typography>
                </Grid>
              </Grid>
            </FormControl>
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
              disabled={isLoading}
            >
              登録
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
          </Box>
          <Box className="wrapper-value-modal" style={{ padding: "10px" }}>
            <Box className="wrapper-text-modal">
              <Typography className="text-modal">
                {isLoading && (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    アップロード中…
                  </p>
                )}
              </Typography>
            </Box>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddTeacherTournament;

// ** React Imports
import { useState, forwardRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";
import ja from 'date-fns/locale/ja'; 
import moment from "moment";

// ** Store Imports
import { updateNews, deleteNews } from "src/store/apps/news";

const schema = yup.object().shape({
  title: yup.string().required("タイトルは入力必須項目です。"),
  published_date: yup.string().required("公開日は入力必須項目です。"),
});

const defaultValues = {
  title: "",
  published_date: "",
  situation: "",
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const NewsEdit = ({ setRefreshKey, data, id }) => {
  const dataRes = data.data;
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
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if(dataRes){
      setValue("situation", dataRes.situation);
      setValue("title", dataRes.title, { shouldValidate: true });
      setValue('published_date', moment(dataRes.published_date).format('YYYY-MM-DD HH:mm:ss'), { shouldValidate: true });
    }
  }, [dataRes, setValue]);

  const onSubmit = (data) => {
    console.log("on submit ", data);
    dispatch(updateNews({ id, data }))
      .unwrap()
      .then((originalPromiseResult) => {
        setRefreshKey((prev) => prev + 1);
        toast.success("ニュースが編集されました。");
      })
      .catch((error) => {
        console.log("rejected", error);
        toast.error("ニュースが編集されませんでした。");
      });
  }; 

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log("id ", id);
    dispatch(deleteNews(id))
      .unwrap().then((response) => {
        setDeleteDialog(false);
        if (response.error) {
          console.log("error", response.error);
          toast.error("Delete was error");
        } else {
          console.log("success", response);
          toast.success("ニュースが削除されました。");
          router.push("/news/list");
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected", rejected);
      });
  };

  // delete news
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false)
  }

  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
  });

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        ニュース詳細
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
              <FormLabel>{data.data.id}</FormLabel>
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>状態</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="situation"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row id="radioj" aria-label="public" {...field}>
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
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={4} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>公開日</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8}>
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
                            value={value}
                            onChange={onChange}
                            error={Boolean(errors.date)}
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
              ニュースを削除します
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                variant="body2"
                id="user-view-edit-description"
                sx={{ textAlign: "center", mb: 5 }}
              >
                ニュースを削除してもよろしいですか？
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

export default NewsEdit;

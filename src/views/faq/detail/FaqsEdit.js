// ** React Imports
import { useState, forwardRef, useEffect, useRef } from "react";
// import Editor from "ckeditor5-custom-build"; // don't remove this line, it's for ckeditor build

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
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

// ** Store Imports
import { useDispatch } from "react-redux";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

import { useRouter } from "next/router";

import moment from "moment";

// ** Actions Imports
import { updateFaqs, deleteFaqs } from "src/store/apps/faq";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const schema = yup.object().shape({
  question: yup.string().required("質問は入力必須項目です。"),
  faq_category_id: yup.string().required("カテゴリーは入力必須項目です。"),
});

const defaultValues = {
  question: "",
  answer: "",
  faq_category_id: "",
  situation: "",
};

const FaqsEdit = ({ data, id, setRefreshKey }) => {
  const dataRes = data.data;
  // ** State
  const [dataCategory, setDataCategory] = useState([]);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../../../ckeditor5-build-in"),
    };
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (dataRes) {
      Object.keys(defaultValues).forEach((key) => {
        if (dataRes[key] !== undefined) {
          // Check if the key has validation rules in the schema
          const fieldSchema = schema.fields[key];
          const shouldValidate = fieldSchema && (fieldSchema.tests.length > 0);
          // console.log(key , dataRes[key]);
          setValue(key, dataRes[key], shouldValidate ? { shouldValidate: true } : {});
        }
      });
      setValue("faq_category_id", dataRes.faq_category?.id)
    }
    loadCategory();
  }, [dataRes, setValue]);

  const loadCategory = async () => {
    axiosInstance.get(BASE_URL_API + "v1/cms/faq-categories")
      .then((res) => {
        setDataCategory(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const onSubmit = (formData) => {
    console.log("on submit ", formData);

    dispatch(updateFaqs({ id, formData }))
      .unwrap()
      .then((originalPromiseResult) => {
        console.log("success", originalPromiseResult);
        setRefreshKey((prev) => prev + 1);
        toast.success("FAQが編集されました。");
      })
      .catch((error) => {
        console.log("rejected", error);
        toast.error("FAQが編集されませんでした。");
      });
  };

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleDelete = () => {
    console.log("id ", id);
    dispatch(deleteFaqs(id)).unwrap()
    .then((response) => {
        setDeleteDialog(false);
        if (response.error) {
          console.log("error", response.error);
          toast.error("FAQが削除されませんでした。");
        } else {
          console.log("success", response);
          toast.success("FAQが削除されました。");
          router.push('/faq/list');
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected ", rejected);
      }); 
  };

  // delete faqs
  const handleDeleteClickOpen = () => setDeleteDialog(true);
  const handleDeleteClose = () => {
    setDeleteDialog(false)
  }

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 6 }}>
        FAQ詳細
      </Typography>
      <Grid xs={12} sm={10}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{ mb: { xs: 6, sm: 4 } }}
          >
            <Grid item xs={2} sm={3}>
              <FormLabel>ID</FormLabel>
              <FormLabel sx={{ display: { xs: "inline", sm: "none" }, ml: 2 }}>
                :
              </FormLabel>
            </Grid>
            <Grid item xs={10} sm={6}>
              <FormLabel>{data.data.id}</FormLabel>
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: { xs: 0, sm: 6 } }}>
            <Grid fullWidth container alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormLabel>状態</FormLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="situation"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      id="situation"
                      aria-label="public"
                      {...field}
                    >
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
                <Typography
                  sx={{ mt: 4, color: "red", marginTop: 0 }}
                  component="p"
                  variant="caption"
                >
                  *非公開を選択した場合、メンバーのマイページでのみ表示されます。
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={3} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>質問</FormLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="question"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="質問"
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.question && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.question.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ pt: 4, pb: 4, marginTop: "5rem!important" }}
              >
                <FormLabel>答え</FormLabel>
              </Grid>
              <Grid item xs={12} sm={8} className="faq">
                {editorLoaded ? (
                  <Controller
                    name="answer"
                    control={control}
                    render={({ field }) => (
                      <CKEditor
                        editor={ClassicEditor}
                        data={field.value}
                        config={{
                          toolbar: {
                            items: [
                              "heading",
                              "|",
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                              "subscript",
                              "superscript",
                              "|",
                              "alignment",
                              "|",
                              "bulletedList",
                              "numberedList",
                              "todolist",
                              "indent",
                              "outdent",
                              "|",
                              "blockQuote",
                              "link",
                              "|",
                              "insertTable",
                              "tabletoolbar",
                              "|",
                              "undo",
                              "redo",
                              "|",
                              "highlight",
                              "fontSize",
                              "fontColor",
                              "fontfamily",
                              "fontBackgroundColor",
                              "|",
                              "removeFormat",
                              "|",
                              "horizontalline",
                              "specialCharacters",
                            ],
                            shouldNotGroupWhenFull: true,
                          },
                          heading: {
                            options: [
                              {
                                model: "paragraph",
                                title: "Paragraph",
                                class: "ck-heading_paragraph",
                              },
                              {
                                model: "heading1",
                                view: "h1",
                                title: "Heading 1",
                                class: "ck-heading_heading1",
                              },
                              {
                                model: "heading2",
                                view: "h2",
                                title: "Heading 2",
                                class: "ck-heading_heading2",
                              },
                              {
                                model: "heading3",
                                view: "h3",
                                title: "Heading 3",
                                class: "ck-heading_heading3",
                              },
                              {
                                model: "heading4",
                                view: "h4",
                                title: "Heading 4",
                                class: "ck-heading_heading4",
                              },
                              {
                                model: "heading5",
                                view: "h5",
                                title: "Heading 5",
                                class: "ck-heading_heading5",
                              },
                            ],
                          },
                          fontSize: {
                            options: [
                              9,
                              10,
                              11,
                              12,
                              13,
                              "default",
                              16,
                              17,
                              19,
                              21,
                              24,
                            ],
                          },
                          table: {
                            contentToolbar: [
                              "tableColumn",
                              "tableRow",
                              "mergeTableCells",
                            ],
                          },
                          language: "en",
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          field.onChange(data);
                        }}
                      />
                    )}
                  />
                ) : (
                  "エディタを読み込んでいます。しばらくお待ちください。..."
                )}
              </Grid>
            </Grid>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ mb: { xs: 3, sm: 6 }, marginBottom: "2rem!important" }}
          >
            <Grid fullWidth container>
              <Grid item xs={12} sm={3} sx={{ pt: 4, pb: 4 }}>
                <FormLabel required>カテゴリー</FormLabel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="faq_category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      id="faq_category_id"
                      labelId="faq_category_id"
                      inputProps={{ placeholder: "Select category" }}
                    >
                      {dataCategory.map(({ title, id }, index) => (
                        <MenuItem key={id} value={id}>
                          {title}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.faq_category_id && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.faq_category_id.message}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </FormControl>
          <Grid fullWidth container>
            <Grid item xs={12} sm={3} sx={{ pt: 4, pb: 4 }}>
              <FormLabel></FormLabel>
            </Grid>
            <Grid item xs={12} sm={6}>
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
              FAQを削除します
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                variant="body2"
                id="user-view-edit-description"
                sx={{ textAlign: "center", mb: 5 }}
              >
                FAQを削除してもよろしいですか？
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

export default FaqsEdit;

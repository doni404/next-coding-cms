// ** React Imports
import { useState, forwardRef, useEffect, useRef } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";

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
import { addFaqs } from "src/store/apps/faq";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

import { useRouter } from "next/router";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  question: yup.string().required("質問は入力必須項目です。"),
  faq_category_id: yup.string().required("カテゴリーは入力必須項目です。"),
});

const defaultValues = {
  question: "",
  answer: "",
  faq_category_id: "",
  situation: "show",
};

const SidebarAddFaq = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [dataCategory, setDataCategory] = useState([]);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

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
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    loadCategory();
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../../../ckeditor5-build-in/build/ckeditor"),
    };
    setEditorLoaded(true);
  }, []);

  const loadCategory = async () => {
    axiosInstance.get(BASE_URL_API + "v1/cms/faq-categories")
      .then((res) => {
        console.log("res ", res.data.data);
        setDataCategory(res.data.data);
      })
      .catch((error) => {
        console.log("error : ", error)
      });
  };

  const onSubmit = (data) => {
    console.log("request data : ", data);
    dispatch(addFaqs({ ...data }))
      .unwrap()
      .then(function (response) {
        if (!response.error) {
          toggle();
          reset();
          toast.success("FAQを登録しました。");
        } else {
          toast.error("FAQを登録しませんでした。");
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected ", rejected);
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
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 350, sm: 450 }, maxWidth: "100%" },
      }}
    >
      <Header>
        <Typography variant="h6">FAQ登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel>状態</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="question"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  required
                  fullWidth
                  label="質問"
                  value={value}
                  onChange={onChange}
                  placeholder="質問"
                  error={Boolean(errors.question)}
                />
              )}
            />
            {errors.question && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.question.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">答え</FormLabel>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="faq_category_id" required>
              カテゴリー
            </InputLabel>
            <Controller
              name="faq_category_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  id="faq_category_id"
                  label="カテゴリー"
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

export default SidebarAddFaq;

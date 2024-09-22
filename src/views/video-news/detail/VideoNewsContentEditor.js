// ** React Imports
import { useState, useEffect, useRef } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// ** Styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import toast from "react-hot-toast";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

import { useDispatch } from "react-redux";

import { fetchData, deleteVideoNewsMedia } from "src/store/apps/video_news_media";
import { updateContentVideoNews } from "src/store/apps/video_news";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const VideoNewsContent = ({setRefreshKey, data, id }) => {
  const dataRes = data.data;
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  // ** Hooks
  const dispatch = useDispatch();
  // ** States
  const [content, setContent] = useState({});
  const [imageOnServer, setImageOnServer] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  useEffect(() => {
    console.log("data : ", dataRes);
    if (dataRes) {
      console.log("content ", dataRes.content === null ? "" : dataRes.content);
      setContent(dataRes.content);
    }
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("../../../ckeditor5-build-in/build/ckeditor"),
    };
    setEditorLoaded(true);
  }, [id]);

  const onSubmit = () => {

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    // Find all img elements within the parsed HTML
    const mediaElements = tempDiv.querySelectorAll(
      `img[src^="${BASE_URL_API}"], video[src^="${BASE_URL_API}"], audio[src^="${BASE_URL_API}"], video > source[src^="${BASE_URL_API}"], audio > source[src^="${BASE_URL_API}"]`
    );
    // Extract the last part of the file name from each element's src attribute
    const extractedFileNames = Array.from(mediaElements).map((element) => {
      // For video and audio elements, check if the element itself has a src attribute or if it's a source element with a parent
      const src =
        element.getAttribute("src") ||
        (element.tagName.toLowerCase() === "source"
          ? element.parentElement.getAttribute("src")
          : null);
      return src ? src.split("/").pop() : null; // Extract the last part of the URL
    });
    const mediaName = extractedFileNames.filter((fileName) => fileName);
    // Update the state with the array of extracted file names
    setFileNames(extractedFileNames.filter((fileName) => fileName));

    dispatch(fetchData(id))
      .unwrap()
      .then((originalPromiseResult) => {
        console.log("get image by id", originalPromiseResult.data);
        setImageOnServer(originalPromiseResult.data);

        const mediaNameDelete = originalPromiseResult.data.filter(
          (item) => !mediaName.includes(item.file_name)
        );
        console.log("mediaNameDelete", mediaNameDelete);

        mediaNameDelete.forEach((item) => {
          const data = { video_news_id: id, id: item.id };
          console.log("data", data);

          dispatch(deleteVideoNewsMedia(data))
            .unwrap()
            .then((response) => {
              if (response.error) {
                console.log("error", response.error);
              } else {
                console.log("success", response);
              }
            })
            .catch((rejectedValueOrSerializedError) => {
              const rejected = rejectedValueOrSerializedError.message;
              console.log("rejected delete", rejected);
            });
        });
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected fetch ", rejected);
      });
    
    const dataContent = {
      content: content,
    };
    console.log("data", dataContent);

    dispatch(updateContentVideoNews({ id, dataContent }))
      .unwrap()
      .then((originalPromiseResult) => {
        setRefreshKey((prev) => prev + 1);
        toast.success("ニュース内容が編集されました。");
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message;
        console.log("rejected", rejected);
        toast.error("ニュース内容が編集されませんでした。");
      });
  };

  class UploadAdapter {
    constructor(loader, editor, placeholderId) {
        this.loader = loader;
        this.editor = editor;
        this.placeholderId = placeholderId;
    }

    async upload() {
        const file = await this.loader.file;
        const fileType = file.type.split("/")[0];

        const view = this.editor.data.processor.toView(
          fileType === "video"
              ? `<video src='' controls="controls"></video>`
              : fileType === "audio"
                  ? `<audio src='' controls="controls"></audio>`
                  : `<img src='' />`
        );
        const model = this.editor.data.toModel(view)
        this.editor.model.insertContent(model, this.editor.model.document.selection)

        // Insert the placeholder
        this.editor.model.change(writer => {
            const insertPosition = this.editor.model.document.selection.getFirstPosition();
            const placeholder = writer.createElement('placeholder', { id: this.placeholderId, text: 'メディアを読み込み中...' });
            this.editor.model.insertContent(placeholder, insertPosition);
        });

        const formData = new FormData();
        formData.append("video_news_id", id);
        formData.append("file", file);
        formData.append("caption", "test");
        formData.append("type", fileType);

        try {
            const response = await axiosInstance.post(`${BASE_URL_API}v1/cms/video-news-media`,formData);
            if (response.data.data.file_name) {
                const fileURL = `${BASE_URL_API}v1/public/resources/video-news-media/${response.data.data.file_name}`;
                return { default: fileURL, type: fileType };
            }
            throw new Error("Upload failed");
        } catch (error) {
          toast.error("メディアのアップロードに失敗しました。ファイルサイズは最大300MBまでです。");
          console.error("Upload error:", error);

          this.editor.model.change(writer => {
              // Check and remove any existing placeholders
              const root = this.editor.model.document.getRoot();
              const existingPlaceholder = Array.from(root.getChildren()).find(
                  element => element.is('element', 'placeholder') && element.getAttribute('id') === this.placeholderId
              );

              if (existingPlaceholder) {
                  writer.remove(existingPlaceholder);
              }
              
              const elementToRemove = Array.from(root.getChildren()).find(element => 
                (element.is('element', 'image') || element.is('element', 'video') || element.is('element', 'audio')) && 
                element.getAttribute('src') === ''
              );

              if (elementToRemove) {
                writer.remove(elementToRemove);
              }
          });

          throw error;
        }
    }
    abort() {}
  }

  function extendEditorModel(editor) {
    editor.model.schema.register("video", {
        allowWhere: "$block",
        isObject: true,
        allowAttributes: ["src", "controls"],
    });
    editor.model.schema.register("audio", {
        allowWhere: "$block",
        isObject: true,
        allowAttributes: ["src", "controls"],
    });
    editor.model.schema.register("placeholder", {
        allowWhere: "$block",
        isObject: true,
        allowAttributes: ["id", "text"],
    });

    defineConverters(editor);
  }

  function defineConverters(editor) {
    editor.conversion.for('upcast').elementToElement({
        view: 'video',
        model: (viewElement, { writer: modelWriter }) => {
            return modelWriter.createElement('video', {
                src: viewElement.getAttribute('src'),
                controls: 'controls'
            });
        }
    });

    editor.conversion.for('upcast').elementToElement({
        view: 'audio',
        model: (viewElement, { writer: modelWriter }) => {
            return modelWriter.createElement('audio', {
                src: viewElement.getAttribute('src'),
                controls: 'controls'
            });
        }
    });

    editor.conversion.for('downcast').elementToElement({
        model: 'video',
        view: (modelElement, { writer: viewWriter }) => {
            return viewWriter.createEmptyElement('video', {
                src: modelElement.getAttribute('src'),
                controls: 'controls',
                style: 'max-width: 100%; height: auto;'
            });
        }
    });

    editor.conversion.for('downcast').elementToElement({
        model: 'audio',
        view: (modelElement, { writer: viewWriter }) => {
            return viewWriter.createEmptyElement('audio', {
                src: modelElement.getAttribute('src'),
                controls: 'controls',
                style: 'width: 100%;'
            });
        }
    });

    editor.conversion.for('downcast').elementToElement({
        model: 'placeholder',
        view: (modelElement, { writer: viewWriter }) => {
            const textNode = viewWriter.createText(modelElement.getAttribute('text'));
            const p = viewWriter.createContainerElement('p', {
                id: modelElement.getAttribute('id'),
                class: 'placeholder'
            });

            viewWriter.insert(viewWriter.createPositionAt(p, 0), textNode);

            return p;
        }
    });
  }

  function MyCustomUploadAdapterPlugin(editor) {
    extendEditorModel(editor);
    const placeholderId = `upload-${Math.random().toString(36).substr(2, 9)}`;
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
        new UploadAdapter(loader, editor, placeholderId);

    // Listen for the completion of the upload
    const imageUploadEditing = editor.plugins.get('ImageUploadEditing');
    imageUploadEditing.on('uploadComplete', (evt, { data }) => {
      editor.model.change(writer => {
        const root = editor.model.document.getRoot();
        const placeholderElement = Array.from(root.getChildren()).find(
            element => element.is('element', 'placeholder') && element.getAttribute('id') === placeholderId
        );
        const elementToRemove = Array.from(root.getChildren()).find(element => 
          (element.is('element', 'image') || element.is('element', 'video') || element.is('element', 'audio')) && 
          element.getAttribute('src') === ''
        );
        try {
          if (elementToRemove) {
            writer.remove(elementToRemove);
          }
          if (placeholderElement) {  // Added check for placeholderElement existence
            writer.remove(placeholderElement);
          }
          console.log("Received data type:", data.type); // Debugging line
    
          // Validate data structure
          if (!data || !data.default) {
            throw new Error("Invalid data structure");
          }

          const view = editor.data.processor.toView(
            data.type === 'video'
              ? `<video src='${data.default}' controls="controls"></video>`
              : data.type === 'audio'
              ? `<audio src='${data.default}' controls="controls"></audio>`
              : `<img src='${data.default}' />`
          )
          const model = editor.data.toModel(view)
          editor.model.insertContent(model, editor.model.document.selection)
    
        } catch (error) {
          console.error("Error processing upload completion:", error);
        }
      });
    });
  }

  return (
    <Box sx={{ p: 5, pb: 10, overflow: "visible" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        ニュース内容
      </Typography>
      <Grid xs={12} sx={{ mt: 6, mb: 6 }}>
        <Box
          sx={{
            p: 5,
            display: "flex",
            borderRadius: 1,
            flexDirection: ["column"],
            justifyContent: ["start"],
            alignItems: ["start"],
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">ニュース内容の編集方法です：</Typography>
          <ul sx={{ m: 0 }}>
            <li>
              画像をインポートしたい場合は、画像タブからURLをコピーし、ここでURLをインポートするボタンを押してください。
            </li>
            <li>
                動画や大きなサイズの写真を添付する際、テキストエディタには『メディアを読み込み中...』と表示されます。読み込みが完了するまで、テキストエディタを使用しないでください。
            </li>
            <li>
              メディアの最大アップロードサイズは300MBです。
            </li>
          </ul>
        </Box>
      </Grid>
      {editorLoaded ? (
        <CKEditor
          data={content}
          editor={ClassicEditor}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
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
                "imageUpload",
                "mediaEmbed",
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
            image: {
              styles: ["alignLeft", "alignCenter", "alignRight"],
              resizeOptions: [
                {
                  name: "resizeImage: original",
                  value: null,
                  icon: "original",
                },
                {
                  name: "resizeImage: 25",
                  value: "25",
                  icon: "small",
                },
                {
                  name: "resizeImage: 50",
                  value: "50",
                  icon: "medium",
                },
                {
                  name: "resizeImage: 75",
                  value: "75",
                  icon: "large",
                },
              ],
              toolbar: [
                "imageStyle:full",
                "imageStyle:alignLeft",
                "imageStyle:alignCenter",
                "imageStyle:alignRight",
                "|",
                "imageTextAlternative",
                "|",
                "resizeImage: 25",
                "resizeImage: 50",
                "resizeImage: 75",
                "resizeImage: original",
              ],
            },
            fontSize: {
              options: [9, 10, 11, 12, 13, "default", 16, 17, 19, 21, 24],
            },
            table: {
              contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
            },
            htmlEmbed: {
              showPreviews: true,
            },
            // This value must be kept in sync with the language defined in webpack.config.js.
            language: "en",
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
            console.log({ event, editor, data });
          }}
        />
      ) : (
        "エディタを読み込んでいます。しばらくお待ちください。..."
      )}
      <Button
        size="large"
        onClick={onSubmit}
        variant="contained"
        sx={{ mt: 5 }}
      >
        保存
      </Button>
    </Box>
  );
};

export default VideoNewsContent;

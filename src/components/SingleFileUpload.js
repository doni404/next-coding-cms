//package
import React, { useState, useEffect } from "react";

// material ui
import { Box, Button, TextField} from "@mui/material";

// styles
import { styled } from "@mui/material/styles";

const StyledFileUpload = styled("div")(() => ({
  "& .handle-input": {
    width: "100%",
    ".MuiInputBase-root": {
      borderRadius: "0",
      border: "1px solid #CCC",
      background: "#FFF",
      width: "100%",
      height: "36px",
      alignItems: "flex-start",
      padding: "0",
      ".MuiOutlinedInput-input": {
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "normal",
        color: "#131313",
        padding: "6px 16px",
      },
    },
  },
  ".wrapper-upload": {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    ".wrapper-button-upload": {
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "row",
      gap: "10px",
      width: "100%",
      ".btn-upload": {
        width: "130px",
        display: "inline-flex",
        padding: "8px 20px",
        height: "36px",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        border: "1px solid var(--gray, #C2C2C2)",
        background: "#FFF",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.15)",
        color: "var(--text---black, #131313)",
        textAlign: "center",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "normal",
        borderRadius: "0",
        "&:hover": {
          border: "1px solid #c2c2c2",
          background: "#f7f7f7",
          color: "#131313",
        },
      },
    },
    ".wrapper-button-delete": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      width: "100%",
      ".text-delete": {
        color: "var(--text---black, #131313)",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
      },
      ".btn-delete": {
        border: "1px solid var(--gray, #C2C2C2)",
        background: "var(--ultra-light---gray, #F7F7F7)",
        display: "flex",
        minWidth: "56px",
        padding: "3px 7.67px 3px 8px",
        justifyContent: "center",
        alignItems: "flex-start",
        color: "#131313",
        textAlign: "center",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        borderRadius: "0",
        "&:hover": {
          backgroundColor: "#113A78",
          color: "#FFFFFF",
          border: "none",
        },
      },
    },
  },
  "@media screen and (max-width: 768px)": {
    ".wrapper-upload": {
      display: "flex",
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "14px",
      ".wrapper-button-upload": {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: "10px",
        ".text-upload": {
          color: "var(--text---black, #131313)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "21px",
        },
        ".btn-upload": {
          display: "inline-flex",
          padding: "8px",
          justifyContent: "center",
          alignItems: "center",
          gap: "0",
          border: "1px solid var(--gray, #C2C2C2)",
          background: "#FFF",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.15)",
          color: "var(--text---black, #131313)",
          textAlign: "center",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
          borderRadius: "0",
        },
      },
      ".wrapper-button-delete": {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        ".text-delete": {
          color: "var(--text---black, #131313)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        ".btn-delete": {
          border: "1px solid var(--gray, #C2C2C2)",
          background: "var(--ultra-light---gray, #F7F7F7)",
          display: "flex",
          minWidth: "56px",
          padding: "3px 7.67px 3px 8px",
          justifyContent: "center",
          alignItems: "flex-start",
          color: "#131313",
          textAlign: "center",
          fontSize: "12px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          borderRadius: "0",
          "&:hover": {
            backgroundColor: "#113A78",
            color: "#FFFFFF",
            border: "none",
          },
        },
      },
    },
  },
  "@media screen and (max-width: 640px)": {
    ".wrapper-upload": {
      width: "100%",
      display: "flex",
      alignItems: "flex-end",
      flexDirection: "column",
      gap: "10px",
      ".wrapper-button-upload": {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: "5px",
        ".text-upload": {
          minWidth: "95%",
          color: "var(--text---black, #131313)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "21px",
        },
        ".btn-upload": {
          display: "inline-flex",
          padding: "8px",
          justifyContent: "center",
          alignItems: "center",
          gap: "0",
          border: "1px solid var(--gray, #C2C2C2)",
          background: "#FFF",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.15)",
          color: "var(--text---black, #131313)",
          textAlign: "center",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
          borderRadius: "0",
          span: {
            marginRight: "4px",
          },
        },
      },
      ".wrapper-button-delete": {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        ".text-delete": {
          color: "var(--text---black, #131313)",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        ".btn-delete": {
          minWidth: "100%",
          border: "1px solid var(--gray, #C2C2C2)",
          background: "var(--ultra-light---gray, #F7F7F7)",
          display: "flex",
          minWidth: "56px",
          padding: "3px 6px",
          justifyContent: "center",
          alignItems: "flex-start",
          color: "#131313",
          textAlign: "center",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          borderRadius: "0",
          "&:hover": {
            backgroundColor: "#113A78",
            color: "#FFFFFF",
            border: "none",
          },
        },
      },
    },
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const MAX_COUNT = 1;

const SingleFileUpload = React.memo(({ setVideoFiles, setValue, trigger, videoUrl }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);

  useEffect(() => {
    // Check if videoUrl is not empty and update videoFiles state accordingly
    if (videoUrl) {
      console.log("videoUrl: ", videoUrl)
      const fileName = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
      const newFile = { name: fileName, url: videoUrl };
      handleUploadFiles([newFile]);
    }
  }, [videoUrl]);

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        console.log("up length : ",uploaded.length)
        if (uploaded.length > MAX_COUNT) {
          // alert(`You can only add a maximum of ${MAX_COUNT} files`);
          console.log(`You can only add a maximum of ${MAX_COUNT} files`)
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded){
      setUploadedFiles(uploaded);
      setVideoFiles(uploaded);
      setValue('videoFiles', uploaded); // manually update the videoFiles input's value
      trigger('videoFiles'); // manually trigger validation
    }
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const HandleOptions = ({ file, files }) => {
    const handleDelete = () => {
      const s = files.filter(
        (item) => item.name !== file.name && item.size !== file.size
      );
      setUploadedFiles(s);

      // Update fileLimit
      if (s.length < MAX_COUNT) {
        setFileLimit(false);
      }

      // Update the videoFiles state in the parent component
      setVideoFiles(s);
      setValue('videoFiles', s); // manually update the videoFiles input's value
    };
    console.log("file 1: ", file)
    return (
      <Box className="wrapper-button-delete" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {file && file instanceof File ? (
          <video controls src={URL.createObjectURL(file)} style={{ width: '100%' }} />
        ) : (
          <video controls src={videoUrl} style={{ width: '100%' }} />
        )}
        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TextField disabled={true} value={file.name} placeholder="select file" className="handle-input" style={{marginRight: "5px"}}/>
          <Button className="btn-delete" onClick={handleDelete}>
            削除
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <StyledFileUpload>
      <Box className="wrapper-upload">
        <Box className="wrapper-button-upload">
          <Box className="wrapper-file">
            {uploadedFiles.map((file) => (
              <HandleOptions key={file.name} file={file} files={uploadedFiles} />
            ))}
          </Box>
          {uploadedFiles.length === 0 && (
          <Button className="btn-upload" component="label" variant="contained">
            アップロード
            <VisuallyHiddenInput
              type="file"
              multiple
              accept="video/mp4, video/mp3"
              onChange={handleFileEvent}
              disabled={fileLimit}
            />
          </Button>
        )}
        </Box>
      </Box>
    </StyledFileUpload>
  );
});

export default SingleFileUpload;

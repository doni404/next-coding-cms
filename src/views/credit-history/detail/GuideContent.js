// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// ** Demo Components Imports
import EditorControlled from "./EditorControlled";

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

import { convertToRaw } from 'draft-js'
import toast from "react-hot-toast";

import axios from "axios";

export const isJson = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const GuideContent = ({data, id}) => {
  const [content, setContent] = useState({});

  useEffect(() => {
    getGuideData()
  }, [id]);

  const getGuideData = async () => {
    console.log("get Guide Data")
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/guides/'+id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log("res ", res)
        setContent(res.data.data.content)
      })
      .catch((error) => {
        console.log("res ", error)
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }
  const sendDataToParent = (data) => { // the callback. Use a better name
    console.log("convert ", convertToRaw(data.getCurrentContent()))
    setContent(convertToRaw(data.getCurrentContent()));
  };

  const onSubmit = () => {
    console.log('data submit',JSON.stringify(content));
    const token = window.sessionStorage.getItem('token')
    const request = {
      "content": JSON.stringify(content),
    }
    var axios = require("axios");
    var config = {
      method: "patch",
      url: BASE_URL_API + "v1/guides/" + id+"/content",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: request,
    };

    axios(config)
      .then(function (response) {
        console.log(response)
        toast.success("ガイドが編集されました。");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("ガイドが編集されませんでした。");
      });
  };
  return (
    <Box sx={{ p: 5, pb: 10, overflow: "visible" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        ガイド内容
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
          <Typography variant="h6">ガイド内容の編集方法です：</Typography>
          <ul sx={{ m: 0 }}>
            <li>
              画像をインポートしたい場合は、画像タブからURLをコピーし、ここでURLをインポートするボタンを押してください。
            </li>
          </ul>
        </Box>
      </Grid>
      <Card sx={{ overflow: "visible" }}>
        <EditorWrapper>
          <Grid item xs={12}>
            <Card sx={{ overflow: "visible" }}>
              <CardContent>
                <EditorControlled
                  content={content}
                  sendDataToParent={sendDataToParent}
                  json={isJson(content)}
                />
                <Button
                  size="large"
                  onClick={onSubmit}
                  variant="contained"
                  sx={{ mt: 5 }}
                >
                  編集
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </EditorWrapper>
      </Card>
    </Box>
  );
};

export default GuideContent;

// ** MUI Imports
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import axios from 'axios'
import draftToHtml from 'draftjs-to-html';

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import { set } from "nprogress";

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + '年' + date[1] + '月' + date[2] + '日'
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

const colors = {
  read: "secondary",
  unread: "warning",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const MessageDetail = (data)  => {
  console.log("data : ", data.id)
  const [id, setId] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [target, setTarget] = useState('')
  const [content, setContent] = useState('')
  const [adminCreatedId, setAdminCreatedId] = useState('')
  const [createDate, setCreateDate] = useState('');

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(BASE_URL_API + "v1/mail_sends/" + data.id, header)
      .then(async response => {
        console.log("response : ", response)
        setId(response.data.data.id)
        setSubject(response.data.data.subject)
        setType(response.data.data.type)
        setTarget(response.data.data.target)
        setContent(response.data.data.content)
        setAdminCreatedId(response.data.data.admin_created_id)
        setCreateDate(dateFormater(response.data.data.create_at)+" "+timeFormater(response.data.data.create_at))
      })
      .catch(err => {
      })
  }, [data])

  return (
    <Card>
      <CardContent>
        <Box sx={{ p: 0 }}>
          <Grid container alignItems={"center"}>
            <Typography variant="h5">重要メール詳細</Typography>
          </Grid>
          <Divider sx={{ mt: 3, mb: 5 }} />
          <Grid xs={12}>
            <Grid
              fullWidth
              container
              alignItems="center"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                  ID
                </FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {id}
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
              fullWidth
              container
              alignItems="center"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>件名</FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {subject}
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
              fullWidth
              container
              alignItems="center"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>種類</FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {type}
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
              fullWidth
              container
              alignItems="center"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>受信者</FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {target === "individual" ? "個別" : target === "seller" ? "一括 (売り手)" : target === "buyer" ? "一括 (買い手)" : target === "all" ?  "一括 (全て)" : "-"}
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
              fullWidth
              container
              alignItems="baseline"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                  本文
                </FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  <div dangerouslySetInnerHTML={{__html: content}}></div>
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
              fullWidth
              container
              alignItems="center"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>作成者</FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {adminCreatedId}
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
              fullWidth
              container
              alignItems="baseline"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                  作成日
                </FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {createDate}
                </FormLabel>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MessageDetail;

// ** MUI Imports
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import axios from 'axios'

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + '年' + date[1] + '月' + date[2] + '日'
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const MessageDetail = (data) => {
  const [id, setId] = useState('');
  const [subject, setSubject] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [topTitle, setTopTitle] = useState('');
  const [totalSend, setTotalSend] = useState('');

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(BASE_URL_API + "v1/mail_magazine/" + data.id.id, header)
      .then(async response => {
        console.log(response)
        setId(response.data.data.id)
        setSubject(response.data.data.subject)
        setTopTitle(response.data.data.top_title)
        setTotalSend(response.data.data.total_send)
        setCreateDate(dateFormater(response.data.data.create_at)+" "+timeFormater(response.data.data.create_at))
      })
      .catch(err => {
      })
  }, [data])


  return (
    <Box sx={{ p: 0 }}>
      <Grid container alignItems={"center"}>
        <Typography variant="h5">メルマガ詳細</Typography>
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
            <FormLabel sx={{ fontWeight: { xs: 500 } }}>トップタイトル</FormLabel>
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
              {topTitle}
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
            <FormLabel sx={{ fontWeight: { xs: 500 } }}>受信機数</FormLabel>
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
              {totalSend}
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
  );
};

export default MessageDetail;

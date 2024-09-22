// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
// ** Third Party Components
import axiosInstance from "src/helper/axiosInstance";
import { useState, useEffect } from "react";


export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0]+'年'+date[1]+'月'+date[2]+'日'
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length-3);
  return time;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const VideoNewsDetailTop = ({ data }) => {
  const [adminCreated, setAdminCreated] = useState(null);
  const [adminUpdated, setAdminUpdated] = useState(null);

  const getAdminCreated = async () => {
    const apiUrl = BASE_URL_API + "v1/cms/admins/" + data.data.admin_created_id;
    axiosInstance.get(apiUrl)
      .then((response) => {
        setAdminCreated(response.data.data.name);
      })
      .catch(() => {

      });
  }

  const getAdminUpdated = async () => {
    const apiUrl = BASE_URL_API + "v1/cms/admins/" + data.data.admin_updated_id;
    axiosInstance.get(apiUrl)
      .then((response) => {
        setAdminUpdated(response.data.data.name);
      })
      .catch(() => {

      });
  }

  useEffect(() => {
    getAdminCreated();
    getAdminUpdated();
  }, [data])
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item sx={{ display: "flex", pr: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mr: 2, color: "text.primary" }}
                >
                  作成者:
                </Typography>
                <Typography variant="body2">{adminCreated}</Typography>
              </Grid>
              <Grid item sx={{ display: "flex", pr: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mr: 2, color: "text.primary" }}
                >
                  作成日:
                </Typography>
                <Typography variant="body2">
                  {dateFormater(data.data.created_at)}{" "}
                  {timeFormater(data.data.created_at)}
                </Typography>
              </Grid>
              <Grid item sx={{ display: "flex", pr: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mr: 2, color: "text.primary" }}
                >
                  最終編集者:
                </Typography>
                <Typography variant="body2">{adminUpdated}</Typography>
              </Grid>
              <Grid item sx={{ display: "flex", pr: 3 }}>
                <Typography
                  sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                >
                  最終編集日:
                </Typography>
                <Typography variant="body2">
                  {dateFormater(data.data.updated_at)}{" "}
                  {timeFormater(data.data.updated_at)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default VideoNewsDetailTop;

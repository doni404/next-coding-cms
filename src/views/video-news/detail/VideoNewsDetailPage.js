// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axiosInstance from "src/helper/axiosInstance";

// ** Demo Components Imports
import VideoNewsDetailTop from "src/views/video-news/detail/VideoNewsDetailTop";
import VideoNewsDetailMid from "src/views/video-news/detail/VideoNewsDetailMid";
import VideoNewsDetailBottom from "src/views/video-news/detail/VideoNewsDetailBottom";
import BreadcrumbsPage from "src/views/video-news/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const VideoNewsDetailPage = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  const apiUrl = BASE_URL_API + "v1/cms/video-news/" + id;

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then((response) => {
        console.log("response", response.data)
        setData(response.data);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [id, refreshKey]);

  if (data) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <VideoNewsDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <VideoNewsDetailMid data={data} />
        </Grid>
        <Grid item xs={12}>
          <VideoNewsDetailBottom 
            setRefreshKey={setRefreshKey} data={data} id={id} sx={{ overflow: "visible" }} />
        </Grid>
      </Grid>
    );
  } 
};

export default VideoNewsDetailPage

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
import NewsDetailTop from "src/views/news/detail/NewsDetailTop";
import NewsDetailMid from "src/views/news/detail/NewsDetailMid";
import NewsDetailBottom from "src/views/news/detail/NewsDetailBottom";
import BreadcrumbsPage from "src/views/news/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const NewsDetailPage = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  const apiUrl = BASE_URL_API + "v1/cms/news/" + id;

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
          <NewsDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <NewsDetailMid data={data} />
        </Grid>
        <Grid item xs={12}>
          <NewsDetailBottom 
            setRefreshKey={setRefreshKey} data={data} id={id} sx={{ overflow: "visible" }} />
        </Grid>
      </Grid>
    );
  } 
};

export default NewsDetailPage

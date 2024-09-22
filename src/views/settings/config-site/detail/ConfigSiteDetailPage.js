// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import ConfigSiteDetailTop from "src/views/settings/config-site/detail/ConfigSiteDetailTop";
import ConfigSiteDetailBottom from "src/views/settings/config-site/detail/ConfigSiteDetailBottom";
import BreadcrumbsPage from "src/views/settings/config-site/detail/BreadcrumbsPage";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const ConfigSiteDetailPage = () => {
  // ** hooks */
  const router = useRouter();
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  const apiUrl = BASE_URL_API + "v1/cms/configs/1";

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then((response) => {
        console.log(response.data)
        setData(response.data);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshKey]);

  if (data) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <ConfigSiteDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <ConfigSiteDetailBottom data={data} setRefreshKey={setRefreshKey} sx={{ overflow: "visible" }} />
        </Grid>
      </Grid>
    );
  }
};

export default ConfigSiteDetailPage

// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

// ** Demo Components Imports
import MailTemplateDetailTop from "src/views/settings/mail-template/detail/MailTemplateDetailTop";
import MailTemplateDetailBottom from "src/views/settings/mail-template/detail/MailTemplateDetailBottom";
import BreadcrumbsPage from "src/views/settings/mail-template/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const MailTemplateDetailPage = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  const apiUrl = BASE_URL_API + "v1/cms/mail-templates/" + id;

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then((response) => {
        console.log("mail template response : ",response.data)
        setData(response.data);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [id, refreshKey])

  if (data) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <MailTemplateDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <MailTemplateDetailBottom data={data} id={id} setRefreshKey={setRefreshKey} sx={{ overflow: "visible" }} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            User with the id: {id} does not exist. Please check the list of
            users: <Link href="/apps/user/list">User List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default MailTemplateDetailPage

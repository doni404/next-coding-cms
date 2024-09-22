// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import GuideDetailTop from "src/views/credit-history/detail/GuideDetailTop";
import GuideDetailBottom from "src/views/credit-history/detail/GuideDetailBottom";
import BreadcrumbsPage from "src/views/credit-history/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const GuideDetailPage = ({ id }) => {
  console.log(id)
  // ** State
  const [error, setError] = useState(false);
  const [dataGuide, setDataGuide] = useState(null);

  const apiUrl = BASE_URL_API + "v1/guides/" + id;
  const token = window.sessionStorage.getItem('token')

  useEffect(() => {
    axios
      .get(apiUrl,{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        const dataResponse = response.data
        setDataGuide(dataResponse);
        console.log("response data : ", response.data)
        
        setError(false);
      })
      .catch(() => {
        setDataGuide(null);
        setError(true);
      });
  }, [id])
  if (dataGuide) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <GuideDetailTop data={dataGuide} />
        </Grid>
        <Grid item xs={12}>
          <GuideDetailBottom data={dataGuide} id={id} sx={{ overflow: "visible" }} />
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

export default GuideDetailPage

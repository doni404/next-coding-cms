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
import ArticleDetailTop from "src/views/video/detail/ArticleDetailTop";
import ArticleDetailBottom from "src/views/video/detail/ArticleDetailBottom";
import BreadcrumbsPage from "src/views/video/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const ArticleView = ({ id }) => {
  console.log("id is", id)
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const apiUrl = BASE_URL_API + "v1/articles/" + id;
  const token = window.sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setData(response.data);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [id]);
  
  if (data) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <ArticleDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <ArticleDetailBottom
            data={data}
            id={id}
            sx={{ overflow: "visible" }}
          />
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

export default ArticleView;

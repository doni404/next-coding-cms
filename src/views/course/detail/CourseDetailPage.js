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
import CourseDetailTop from "src/views/course/detail/CourseDetailTop";
import CourseDetailBottom from "src/views/course/detail/CourseDetailBottom";
import BreadcrumbsPage from "src/views/course/detail/BreadcrumbsPage";

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const CourseDetailPage = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  const apiUrl = BASE_URL_API + "v1/cms/courses/" + id;

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then((response) => {
        console.log("detail page : ",response.data)
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
          <CourseDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <CourseDetailBottom data={data} id={id} setRefreshKey={setRefreshKey} sx={{ overflow: "visible" }} />
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

export default CourseDetailPage

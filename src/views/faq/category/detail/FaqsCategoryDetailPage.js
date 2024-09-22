// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

// ** Demo Components Imports
import FaqsCategoryDetailTop from "src/views/faq/category/detail/FaqsCategoryDetailTop";
import FaqsCategoryDetailBottom from "src/views/faq/category/detail/FaqsCategoryDetailBottom";
import BreadcrumbsPage from "src/views/faq/category/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const FaqsCategoryDetailPage = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line
  const apiUrl = BASE_URL_API + "v1/cms/faq-categories/" + id;

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then((response) => {
        console.log("faq cty response : ", response.data)
        setData(response.data);
        setError(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id, refreshKey])

  if (data) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <FaqsCategoryDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <FaqsCategoryDetailBottom data={data} id={id} setRefreshKey={setRefreshKey} sx={{ overflow: "visible" }} />
        </Grid>
      </Grid>
    );
  } 
};

export default FaqsCategoryDetailPage

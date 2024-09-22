// ** React Imports
import { useState, useEffect } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

// ** Third Party Components
import axiosInstance from "src/helper/axiosInstance"
import TeacherDetailTop from "src/views/teacher/detail/TeacherDetailTop";
import TeacherDetailBottom from "src/views/teacher/detail/TeacherDetailBottom";
import BreadcrumbsPage from "src/views/teacher/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TeacherDetailPage = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const apiUrl = BASE_URL_API + "v1/cms/teachers/" + id;
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  useEffect(() => {
    // console.log("apiUrl", apiUrl);
    axiosInstance.get(apiUrl)
      .then((response) => {
        console.log("response teacher : ",response.data);
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
          <TeacherDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <TeacherDetailBottom data={data} setRefreshKey={setRefreshKey}/>
        </Grid>
      </Grid>
    );
  }
};

export default TeacherDetailPage;

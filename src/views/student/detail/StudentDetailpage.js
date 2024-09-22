// ** React Imports
import { useState, useEffect } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

// ** Third Party Components
import axiosInstance from "src/helper/axiosInstance"
import StudentDetailTop from "src/views/student/detail/StudentDetailTop";
import StudentDetailBottom from "src/views/student/detail/StudentDetailBottom";
import BreadcrumbsPage from "src/views/student/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const StudentView = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add this line
  const apiUrl = BASE_URL_API + "v1/cms/students/code/" + id;

  useEffect(() => {
    axiosInstance.get(apiUrl)
      .then((response) => {
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
          <StudentDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <StudentDetailBottom data={data} setRefreshKey={setRefreshKey}/>
        </Grid>
      </Grid>
    );
  // } else if (error) {
  //   return (
  //     <Grid container spacing={6}>
  //       <Grid item xs={12}>
  //         <Alert severity="error">
  //           Account with the id: {id} does not exist. Please check the list of
  //           accounts: <Link href="/account/list">Account List</Link>
  //         </Alert>
  //       </Grid>
  //     </Grid>
  //   );
  // } else {
  //   return null;
  }
};

export default StudentView;

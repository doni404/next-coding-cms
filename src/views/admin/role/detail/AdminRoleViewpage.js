// ** React Imports
import { useState, useEffect } from "react";

// ** Next Import
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

// ** Third Party Components
import axios from "axios";
import AdminDetail from "src/views/admin/role/detail/AdminDetail";
import BreadcrumbsPage from "src/views/admin/role/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const UserView = ({ id }) => {
  // ** hooks
  const router = useRouter();
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const apiUrl = BASE_URL_API + "v1/cms/admin-roles/" + id;
  const token = window.sessionStorage.getItem('token')

  useEffect(() => {
    axios
      .get(apiUrl,{
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        setData(response.data);
        setError(false);
      })
      .catch((error) => {
        if (error.response.status === 403 || error.response.status === 401) {
          router.replace('/unauthorized')
        }
      });
  }, [id])
  if (data) {
    return (
      <Grid
        container
        spacing={6}
        className="match-height"
      >
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12} md={12} >
          <AdminDetail data={data} />
        </Grid>
      </Grid>
    );
  } 
  // else if (error) {
  //   return (
  //     <Grid container spacing={6}>
  //       <Grid item xs={12}>
  //         <Alert severity="error">
  //           User with the id: {id} does not exist. Please check the list of
  //           users: <Link href="/apps/user/list">User List</Link>
  //         </Alert>
  //       </Grid>
  //     </Grid>
  //   );
  // } else {
  //   return null;
  // }
};

export default UserView;

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
import ItemDetailTop from "src/views/reservation/detail/ItemDetailTop";
import ItemDetail from "src/views/reservation/detail/ItemDetail";
import BreadcrumbsPage from "src/views/reservation/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const ItemView = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const apiUrl = BASE_URL_API + "v1/assets/" + id;
  const token = window.sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("id check", id);
        console.log("response check", response);
        console.log("response data check", response.data);
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
          <BreadcrumbsPage/>
        </Grid>
        <Grid item xs={12}>
          <ItemDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <ItemDetail data={data} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Item with the id: {id} does not exist. Please check the list of
            items: <Link href="/item/list">Item List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
}

export default ItemView;

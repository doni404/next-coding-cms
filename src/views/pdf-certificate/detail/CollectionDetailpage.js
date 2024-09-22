// ** React Imports
import { useState, useEffect } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";

// ** Third Party Components
import axios from "axios";
import CollectionDetail from "src/views/pdf-certificate/detail/CollectionDetail";
import CollectionDetailTop from "src/views/pdf-certificate/detail/CollectionDetailTop";
import CollectionItems from "src/views/pdf-certificate/detail/CollectionItems";
import BreadcrumbsPage from "src/views/pdf-certificate/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const CollectionView = ({ id }) => {
  // ** State
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const apiUrl = BASE_URL_API + "v1/collections/" + id;
  const token = window.sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } })
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
      <Grid container sx={{ overflow: "visible" }} spacing={6}>
        <Grid item xs={12}>
          <BreadcrumbsPage/>
        </Grid>
        <Grid item xs={12}>
          <CollectionDetailTop data={data} />
        </Grid>
        <Grid item xs={12}>
          <CollectionDetail data={data} />
        </Grid>
        <Grid item xs={12}>
          <CollectionItems id={id} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Collection with the id: {id} does not exist. Please check the list
            of collection: <Link href="/collection/list">Collection List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default CollectionView;

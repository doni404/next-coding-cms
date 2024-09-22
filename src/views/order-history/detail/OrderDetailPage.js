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
import OrderDetail from "src/views/order-history/detail/OrderDetail";
import BreadcrumbsPage from "src/views/order-history/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const OrderView = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  const apiUrl = BASE_URL_API + "v1/nft_sales/" + id;
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
  }, [id])

  console.log("data order is", data)
  
  if (data) {
    return (
      <Grid container spacing={6} sx={{ overflow: "visible" }}>
        <Grid item xs={12}>
          <BreadcrumbsPage />
        </Grid>
        <Grid item xs={12}>
          <OrderDetail data={data} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Order with the id: {id} does not exist. Please check the list of
            Orders: <Link href="/order/list">Order List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null
  }
}

export default OrderView;

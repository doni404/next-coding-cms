// ** MUI Imports
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";
import ListRecipients from "src/views/notification/message/detail/ListRecipients";
import MessageDetail from "src/views/notification/message/detail/MessageDetail";
import BreadcrumbsPage from "src/views/notification/message/detail/BreadcrumbsPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const colors = {
  read: "secondary",
  unread: "warning",
  broadcast: "primary",
  paid: "success",
  sold: "warning",
};

const MessageDetailPage = ({ id }) => {
  const [data, setData] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = BASE_URL_API + "v1/messages/" + id;
  const token = window.sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setData(response.data.data);
        setError(false);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  });

  // console.log("data message detail is ", data);

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <BreadcrumbsPage/>
        </Grid>
        <Grid item xs={12}>
          <MessageDetail data={data} />
        </Grid>
        <Grid item xs={12}>
          <ListRecipients data={data} />
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            Message with the id: {id} does not exist. Please check the list of
            message: <Link href="/message/list">Message List</Link>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default MessageDetailPage;

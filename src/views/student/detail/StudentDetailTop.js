// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useState, useEffect } from "react";


export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0]+'年'+date[1]+'月'+date[2]+'日'
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length-3);
  return time;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const StudentDetailTop = ({ data }) => {
  const [adminCreated, setAdminCreated] = useState(null);
  const [adminUpdated, setAdminUpdated] = useState(null);

  const token = window.sessionStorage.getItem('token')
  console.log('data ',data)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item sx={{ display: "flex", pr: 3 }}>
                <Typography variant="h6">
                  {data?.data ? data?.data.name : "-"}{" "}
                  ({data?.data.code})
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentDetailTop;

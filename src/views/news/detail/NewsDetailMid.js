// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import axiosInstance from "src/helper/axiosInstance";
import { useState, useEffect } from "react";

// ** Custom Components
import { useRouter } from 'next/router'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;
export const BASE_URL_EC = process.env.REACT_APP_BASE_URL_EC;

const NewsDetailTop = ({ data }) => {
  //* State
  const [url, setUrl] = useState(null);

  useEffect(() => {
    setUrl(data.data.id)
  }, [data])
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item sx={{ display: "flex", pr: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mr: 2, color: "text.primary" }}
                >
                  プレビュー URL:
                </Typography>
                <Typography variant="body2">
                  <a href={`${BASE_URL_EC}news/${url}`} target="_blank" rel="noopener noreferrer">
                    {BASE_URL_EC}news/{url}
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default NewsDetailTop;

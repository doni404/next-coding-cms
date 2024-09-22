// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

import axios from "axios";
import { useState, useEffect } from "react";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const GetAvatar = (avatar) => {
  // console.log("avatar", avatar.avatar);
  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    imageWithAuth(avatar.avatar);
  }, []);
  const imageWithAuth = async (avatar) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };
    const response = await axios.get(
      BASE_URL_API + "v1/resources?type=accounts/profiles&filename=" +
      avatar,
      header
    );
    const fileReader = new FileReader();
    fileReader.readAsDataURL(response.data);
    fileReader.onloadend = function () {
      if (fileReader.result == null) {
        setImgSrc("/images/avatars/1.png");
      } else {
        setImgSrc(fileReader.result);
      }
    };
  };

  if (avatar.avatar != "") {
    return <Avatar src={imgSrc} sx={{ mr: 3, width: 42, height: 42 }} />
  } else {
    return <Avatar src="/images/avatars/1.png" sx={{ mr: 3, width: 42, height: 42 }} />;
  }
}

const CurrencyIcon = styled("img")(({ theme }) => ({
  width: "auto",
  height: "13px",
  marginRight: "7px",
  marginLeft: "7px!important"
}));

function ParseFloat(str, val) {
  str = String(str);
  str = str.slice(0, str.indexOf(".") + val + 1);
  return Number(str);
}

const TotalReservation = () => {
  const apiUrl = BASE_URL_API + "v1/nft_sales/groups/seller?sort=desc";
  const [artist, setArtist] = useState([]);

  useEffect(() => {
    // getArtist();
  }, []);

  const getArtist = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setArtist(response.data.data);
      })
      .catch(() => { });
  };

  return (
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item xs={12} sm={12}>
            <Typography variant="body2" sx={{ fontSize: "1.2rem", textAlign : "center", marginBottom : "1.5rem" }}>
              <Box component="span">
                予約数
              </Box>
            </Typography>
            <Box sx={{alignItems: "center"}}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, textAlign : "center", marginBottom : "1.5rem"}}
              >
                30,000
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalReservation;

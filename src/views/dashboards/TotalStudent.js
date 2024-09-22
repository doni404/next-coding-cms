// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

// ** Next Imports
import { useRouter } from 'next/router'

import axios from "axios";
import { useState, useEffect } from "react";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// Styled component for the trophy image
const TrophyImg = styled("img")(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: "absolute",
  [theme.breakpoints.down("sm")]: {
    width: 95,
  },
}));

function ParseFloat(str, val) {
  str = String(str);
  str = str.slice(0, str.indexOf(".") + val + 1);
  return Number(str);
}
console.log(ParseFloat("10.547892", 2));

const CurrencyIcon = styled("img")(({ theme }) => ({
  width: "auto",
  height: "18px",
  marginRight: "7px"
}));

const TotalStudent = () => {
  const apiUrl = BASE_URL_API + "v1/nft_sales/groups/seller?sort=desc";
  const [name, setName] = useState(null)
  const [total, setTotal] = useState(null);
  const [idArtist, setIdArtist] = useState(null);

  const router = useRouter();
  const pathname = router.pathname.split("/")
  const dataUser = JSON.parse(window.sessionStorage.getItem('userData'))
  // const adminPermission = dataUser.admin_role.permission === null ? dataUser.admin_role_permissions : dataUser.admin_role.permission;
  // const status =  adminPermission.find(obj => {
  //   return obj.title === pathname[1]
  // })

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
        // console.log("999 top artist", response.data.data[0].seller_username);
        setName(response.data.data[0].seller_username);
        setTotal(response.data.data[0].sales_total);
        setIdArtist(response.data.data[0].seller_id);
      })
      .catch(() => { });
  };

  return (
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Typography sx={{ fontSize: "1.2rem", textAlign : "center", marginBottom : "1.5rem" }}>
              <Box component="span">
              生徒数
              </Box>
            </Typography>
            <Box sx={{alignItems: "center"}}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, textAlign : "center", marginBottom : "1.5rem"}}
              >
                1,000 / 30,000 人
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalStudent;

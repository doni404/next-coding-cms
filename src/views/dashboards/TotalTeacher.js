// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

// ** Icon imports
import Heart from "mdi-material-ui/Heart";

// ** Next Imports
import { useRouter } from 'next/router'

import axios from "axios";
import { useState, useEffect } from "react";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const style = {
  imgShadow: {
    boxShadow: "0px 2px 10px 0px #4c4e6438",
  },
};

// Styled Grid component
const ImgWrap = styled(Grid)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  position: "relative",
  width: "100%",
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    height: "200px",
    order: -1,
  },
}));

// Styled component for the image
const Img = styled("img")(({ theme }) => ({
  width: "auto",
  height: "auto",
  position: "absolute",
  objectFit: "contain",
  maxWidth: "100%",
  maxHeight: "100%",
}));

const GetAssetImage = (asset) => {
  // console.log("avatar", avatar.avatar);
  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    imageWithAuth(asset.asset);
  }, []);
  const imageWithAuth = async (asset) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };
    const response = await axios.get(
      BASE_URL_API + "v1/resources?type=assets&filename=" +
      asset,
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

  if (asset.asset != "") {
    return <ImgWrap><Img style={style.imgShadow} alt="Congratulations" src={imgSrc} /></ImgWrap>
  } else {
    return <ImgWrap><Img style={style.imgShadow} alt="Congratulations" src="/images/avatars/1.png" /></ImgWrap>
  }
}

const TotalTeacher = () => {
  const apiUrl = BASE_URL_API + "v1/asset_favourites/groups/asset?sort=desc";
  const [name, setName] = useState(null);
  const [total, setTotal] = useState(null);
  const [image, setImage] = useState(null);
  const [idAsset, setIdAsset] = useState(null);

  const router = useRouter();
  const pathname = router.pathname.split("/")
  const dataUser = JSON.parse(window.sessionStorage.getItem('userData'))
  // const adminPermission = dataUser.admin_role.permission === null ? dataUser.admin_role_permissions : dataUser.admin_role.permission;
  // const status =  adminPermission.find(obj => {
  //   return obj.title === pathname[1]
  // })
  
  useEffect(() => {
    // getNft();
  }, []);

  const getNft = async () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setName(response.data.data[0].asset_name);
        setTotal(response.data.data[0].total_favourite);
        setImage(response.data.data[0].asset_image);
        setIdAsset(response.data.data[0].asset_id);
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
export default TotalTeacher;

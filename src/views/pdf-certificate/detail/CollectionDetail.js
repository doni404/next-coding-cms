// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormLabel from "@mui/material/FormLabel";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Next Import
import Link from "next/link";

// ** Actions Imports
import { fetchData } from "src/store/apps/user";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.palette.primary.main,
  cursor: "pointer",
}));

const CollectionDetail = ({ data }) => {
  const [bannerSrc, setBannerSrc] = useState("");
  // ** State
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const dataResponse = data.data;
  const token = window.sessionStorage.getItem("token");

  // ** Hooks
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchData({
        role,
        q: value,
      })
    );
    imageToBase64(dataResponse.banner);
  }, [dispatch, role, value]);

  const imageToBase64 = async (image) => {
    const header = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    };

    if (image != "" || image != null) {
      const response = await axios.get(
        BASE_URL_API + "v1/resources?type=collections&filename=" + image,
        header
      );
      const fileReader = new FileReader();
      fileReader.readAsDataURL(response.data);
      fileReader.onloadend = function () {
        setBannerSrc(fileReader.result);
      };
    }
  };

  const ImgStyled = styled("img")(({ theme }) => ({
    // marginBottom: theme.spacing(3),
  }));

  console.log("collection detail information is", dataResponse);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">コレクション詳細</Typography>
        <Divider sx={{ mt: 3, mb: 5 }} />
        <Grid xs={12}>
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>ID</FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.id}
              </FormLabel>
            </Grid>
          </Grid>
          {/* <Grid
            fullWidth
            container
            alignItems="center"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                コレクション詳細
              </FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.owner.username}
              </FormLabel>
            </Grid>
          </Grid> */}
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                コレクション名
              </FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.name}
              </FormLabel>
            </Grid>
          </Grid>
          <Grid
            fullWidth
            container
            alignItems="baseline"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>説明文</FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.description == ""
                  ? "-"
                  : dataResponse.description}
              </FormLabel>
            </Grid>
          </Grid>
          {/* <Grid
            fullWidth
            container
            alignItems="center"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>アクセス数</FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.total_access}
              </FormLabel>
            </Grid>
          </Grid> */}
          {/* <Grid
            fullWidth
            container
            alignItems="center"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>スラッグ</FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.slug}
              </FormLabel>
            </Grid>
          </Grid> */}
          <Grid
            fullWidth
            container
            alignItems="center"
            sx={{
              mb: { xs: 4, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ position: "relative", pr: 5, minWidth: 200 }}
            >
              <FormLabel sx={{ fontWeight: { xs: 500 } }}>URL</FormLabel>
              <FormLabel
                sx={{
                  display: { xs: "none", sm: "inline" },
                  position: "absolute",
                  right: 7,
                }}
              >
                :
              </FormLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormLabel
                sx={{
                  color: {
                    xs: "rgba(76, 78, 100, 0.68)",
                  },
                }}
              >
                {dataResponse.url}
              </FormLabel>
            </Grid>
          </Grid>
          <Grid
              fullWidth
              container
              alignItems="center"
              sx={{
                mb: { xs: 4, sm: 4 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ position: "relative", pr: 5, minWidth: 200 }}
              >
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                  ロイヤリティ
                </FormLabel>
                <FormLabel
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    position: "absolute",
                    right: 7,
                  }}
                >
                  :
                </FormLabel>
              </Grid>
              <Grid item xs={12} sm={10}>
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                  }}
                >
                  {dataResponse.royalties}%
                </FormLabel>
              </Grid>
            </Grid>
            <Grid
                  fullWidth
                  container
                  alignItems="flex-start"
                  sx={{
                    mb: { xs: 4, sm: 4 },
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{ position: "relative", pr: 5, minWidth: 200 }}
                  >
                    <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                      バナー
                    </FormLabel>
                    <FormLabel
                      sx={{
                        display: { xs: "none", sm: "inline" },
                        position: "absolute",
                        right: 7,
                      }}
                    >
                      :
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                  <ImgStyled
                    src={bannerSrc}
                    alt="News Pic"
                    sx={{ maxWidth: "100%" }}
                  />
                  </Grid>
                </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CollectionDetail;

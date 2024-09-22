// ** MUI Imports
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Icons Imports
import HeartOutline from "mdi-material-ui/HeartOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Next Import
import Link from "next/link";

// ** React Import
import { useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'

const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.palette.primary.main,
  cursor: "pointer"
}));

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const ItemDetail = ({ data }) => {
  const dataResponse = data.data;
  console.log("dataResponse is", dataResponse);

  const [imgSrc, setImgSrc] = useState();

  useEffect(() => {
    imageWithAuth(dataResponse.image_url);
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
        setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif');
      } else {
        setImgSrc(fileReader.result);
      }
    };
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ p: { xs: 0, sm: 5 }, pb: { xs: 0, sm: 10 } }}>
          <CustomAvatar
            alt="Item Image"
            src={imgSrc}
            variant="square"
            sx={{
              width: "100%",
              maxWidth: 700,
              height: "auto",
              m: { xs: "0 auto 20px", sm: "20px auto 20px" },
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: { xs: 6, sm: 4 },
            }}
          >
            <Box sx={{ mr: 6, display: "flex", alignItems: "center" }}>
              <CustomAvatar
                skin="light"
                variant="rounded"
                sx={{ mr: 4, width: 44, height: 44 }}
                color="error"
              >
                <HeartOutline />
              </CustomAvatar>
              <Box>
                <Typography variant="h5" sx={{ lineHeight: 1.3 }}>
                  {dataResponse.total_favourite}
                </Typography>
                <Typography variant="body2">お気に入り数</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomAvatar
                skin="light"
                variant="rounded"
                sx={{ mr: 4, width: 44, height: 44 }}
              >
                <EyeOutline />
              </CustomAvatar>
              <Box>
                <Typography variant="h5" sx={{ lineHeight: 1.3 }}>
                  {dataResponse.total_access}
                </Typography>
                <Typography variant="body2">閲覧数</Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="h5">作品詳細</Typography>
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
                  コレクション
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
                  {dataResponse.collection.name}
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>オーナー</FormLabel>
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
                <Link
                  href={`/account/detail/${dataResponse.owner.id}`}
                  passHref
                >
                  <FormLabel
                    sx={{
                      color: {
                        xs: "rgba(76, 78, 100, 0.68)",
                      },
                    }}
                  >
                    <StyledLink>{dataResponse.owner.username}</StyledLink>
                  </FormLabel>
                </Link>
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>カテゴリ</FormLabel>
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
                  {dataResponse.category.name}
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>名前</FormLabel>
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>タグ</FormLabel>
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
                  {dataResponse.tag}
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
                  {dataResponse.description}
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>連絡日</FormLabel>
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
                  {dateFormater(dataResponse.created_at)}
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>販売数</FormLabel>
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
                  {dataResponse.supply}
                </FormLabel>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItemDetail;

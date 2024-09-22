// ** MUI Imports
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import CustomAvatar from "src/@core/components/mui/avatar";
import { styled } from "@mui/material/styles";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";

// ** Next Import
import Link from "next/link";

// ** React Import
import { useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'


const colors = {
  auction: "info",
  normal: "primary",
};

// ** Styled component for the link in the dataTable
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  cursor: "pointer"
}))

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length);
  return time;
}

const CurrencyIcon = styled("img")(({ theme }) => ({
  width: "auto",
  height: "14px",
  marginRight: "7px",
}));

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;
export const BASE_URL_BLOCKCHAIN_SCAN = process.env.REACT_APP_BLOCKCHAIN_SCAN;

const OrderDetail = ({ data }) => {
  const dataResponse = data.data;

  const [imgSrc, setImgSrc] = useState();

  useEffect(() => {
    imageWithAuth(dataResponse.asset.image_url);
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

  const AssetBuyer = ({ salesType, dataResponse }) => {
    if (salesType == "normal") {
      return (
        <Link href={`/account/detail/${dataResponse.to.id}`} passHref>
          <StyledLink>{`${dataResponse.to.username} (${dataResponse.to.metamask_address})`}</StyledLink>
        </Link>
      );
    } else {
      return (
        <Link href={`/account/detail/${dataResponse.winner.id}`} passHref>
          <StyledLink>{`${dataResponse.winner.username} (${dataResponse.winner.metamask_address})`}</StyledLink>
        </Link>
      );
    }
  };

  console.log("dataResponse order is", dataResponse);

  return (
    <Card>
      <CardContent>
        <Box sx={{ p: { xs: 0, sm: 5 }, pb: { xs: 0, sm: 10 } }}>
          <CustomAvatar
            alt="Item Image"
            src={imgSrc}
            variant="square"
            onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
            sx={{
              width: "100%",
              maxWidth: 700,
              height: "auto",
              m: { xs: "0 auto 40px", sm: "20px auto 40px" },
            }}
          />
          <Typography variant="h5">注文詳細</Typography>
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>注文ID</FormLabel>
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
                  取引ハッシュ
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
                    wordBreak: "break-word",
                  }}
                >
                  <a target='_blank' href={BASE_URL_BLOCKCHAIN_SCAN + dataResponse.transaction_hash} passHref>
                    <StyledLink>{dataResponse.transaction_hash}</StyledLink>
                  </a>
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>注文日</FormLabel>
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
                  {dateFormater(dataResponse.created_at)}{" "}
                  {timeFormater(dataResponse.created_at)}
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
                作品名
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
                  {dataResponse.asset.name}
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
                  {dataResponse.asset.collection.name}
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
                方式
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
                <CustomAvatar
                  skin="light"
                  color={colors[dataResponse.sales_type]}
                  variant="rounded"
                  sx={{
                    mr: 1.5,
                    width: 65,
                    height: 24,
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    color: "text.primary",
                  }}
                >
                  {dataResponse.sales_type == "normal" ? "通常" : "auction"}
                </CustomAvatar>
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>販売者</FormLabel>
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
                  <Link
                    href={`/account/detail/${dataResponse.from.id}`}
                    passHref
                  >
                    <StyledLink>{`${dataResponse.from.username} (${dataResponse.from.metamask_address})`}</StyledLink>
                  </Link>
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>注文者</FormLabel>
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
                  <AssetBuyer
                    salesType={dataResponse.sales_type}
                    dataResponse={dataResponse}
                  />
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>数量</FormLabel>
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
                  {dataResponse.quantity}
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
                <FormLabel sx={{ fontWeight: { xs: 500 } }}>総額</FormLabel>
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
              <Grid
                item
                xs={12}
                sm={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CurrencyIcon src="/images/eth.png" alt="icon" />
                <FormLabel
                  sx={{
                    color: {
                      xs: "rgba(76, 78, 100, 0.68)",
                    },
                    wordBreak: "break-word",
                  }}
                >
                  {`${dataResponse.total_price}`}
                </FormLabel>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderDetail;

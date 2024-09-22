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
import ListRecipients from "src/views/notification/message/detail/ListRecipients"

const colors = {
  read: "secondary",
  unread: "warning",
  broadcast: "primary",
  paid: "success",
  sold: "warning",
};

const labelType = {
  broadcast: "broadcast",
  paid: "支払済",
  sold: "sold",
};

const MessageDetail = ({data}) => {

    return (
      <Card>
        <CardContent>
          <Box sx={{ p: 0 }}>
            <Grid container alignItems={"center"}>
              <Typography variant="h5">メッセージ詳細</Typography>
              {/* <CustomChip
                size="small"
                skin="light"
                color={colors["read"]}
                label="Read"
                sx={{
                  "& .MuiChip-label": { textTransform: "capitalize" },
                  "&:not(:last-of-type)": { mr: 3 },
                  ml: 3,
                }}
              /> */}
            </Grid>
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>
                    メッセージID
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
                    {data.id}
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>種類</FormLabel>
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
                  <CustomChip
                    size="small"
                    skin="light"
                    color={colors[data.type]}
                    label={labelType[data.type]}
                    sx={{
                      "& .MuiChip-label": { textTransform: "capitalize" },
                      "&:not(:last-of-type)": { mr: 3 },
                    }}
                  />
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>件名</FormLabel>
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
                    {data.subject}
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>本文</FormLabel>
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
                    {data.body}
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>作成者</FormLabel>
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
                    {data.creator_account.username}
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>作成日</FormLabel>
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
                    {data.created_at}
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
                    受信者数
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
                    {data.total_recipient}
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
                  <FormLabel sx={{ fontWeight: { xs: 500 } }}>既読数</FormLabel>
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
                    {data.total_read}
                  </FormLabel>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
};

export default MessageDetail;

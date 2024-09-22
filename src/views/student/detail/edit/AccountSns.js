// ** React Imports
import { useState } from "react";
import { Fragment } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// ** Third Party Imports
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  radio: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const AccountSns = ({ data }) => {
  const dataResponse = data;

  const [sns_twitter, setSns_twitter] = useState("twitter");
  const [sns_instagram, setSns_instagram] = useState("instagram");
  const [sns_facebook, setSns_facebook] = useState("facebook");
  const [sns_youtube, setSns_youtube] = useState("youtube");
  const [sns_tiktok, setSns_tiktok] = useState("tiktok");
  const [website, setWebsite] = useState("website");

  const { control, handleSubmit } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("on submit ");
    const token = window.sessionStorage.getItem("token");
    var request = {
      "sns_twitter": sns_twitter,
      "sns_instagram": sns_instagram,
      "sns_facebook": sns_facebook,
      "sns_youtube": sns_youtube,
      "sns_tiktok": sns_tiktok,
      "website": website,
    };
    console.log("data is", request);
    console.log("dataResponse.id is", dataResponse.id);

    var axios = require("axios");
    var config = {
      method: "patch",
      url:
        BASE_URL_API + "v1/accounts/" +
        dataResponse.id +
        "/social_media",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: request,
    };

    console.log("url is", config.url);

    axios(config)
      .then(function (response) {
        console.log("response", response);
        toast.success("ソーシャルアカウントが編集されました。");
      })
      .catch(function (error) {
        console.log(error);
        toast.error("ソーシャルアカウントが編集されませんでした。");
      });
  };

  return (
    <Fragment>
      <Card sx={{ mb: 6 }}>
        <Box sx={{ p: 5, pb: 10 }}>
          <Typography variant="h5" sx={{ mb: 6 }}>
            ソーシャルアカウント
          </Typography>
          <Grid xs={12}>
            <form onSubmit={onSubmit}>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Twitter"
                      value={sns_twitter}
                      placeholder="Twitter"
                      onChange={(e) => setSns_twitter(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Instagram"
                      value={sns_instagram}
                      placeholder="Instagram"
                      onChange={(e) => setSns_instagram(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <Controller
                      name="facebook"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          label="Facebook"
                          value={sns_facebook}
                          placeholder="Facebook"
                          onChange={(e) => setSns_facebook(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <Controller
                      name="youtube"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          label="Youtube"
                          value={sns_youtube}
                          placeholder="Youtube"
                          onChange={(e) => setSns_youtube(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <Controller
                      name="tiktok"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          label="Tiktok"
                          value={sns_tiktok}
                          placeholder="Tiktok"
                          onChange={(e) => setSns_tiktok(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <FormControl fullWidth sx={{ mb: { xs: 7, sm: 6 } }}>
                <Grid fullWidth container>
                  <Grid item xs={12}>
                    <Controller
                      name="web"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          label="Website"
                          value={website}
                          placeholder="Website"
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>

              <Grid fullWidth container>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{ mr: 3 }}
                    >
                      編集
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Box>
      </Card>
    </Fragment>
  );
};

export default AccountSns;

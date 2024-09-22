// ** React Imports
import { forwardRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
// ** MUI Imports
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Download from 'mdi-material-ui/Download'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TableHeader = (props) => {
  // ** Props
  const { onSubmit, toggle } = props;
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      keyword: "",
    },
  });

  const onSubmitForm = (data) => {
    console.log("data", data);

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Box
        sx={{
          p: 5,
          pb: 3,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          pt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%", // or a specific value
          }}
        >
          <Grid container direction="column" item xs={12} sm={6} sx={{ mt: 2 }}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={12} sm={12}>
                <Controller
                  name="keyword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      sx={{ width: "50%" }}
                      size="small"
                      {...field}
                      placeholder="コースタイプ / コース名 /  識別コード"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={8}>
                <Button variant="contained" color="primary" type="submit">
                  検索
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column" item xs={12} sm={6} sx={{ mt: 2 }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
                コース登録
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default TableHeader;

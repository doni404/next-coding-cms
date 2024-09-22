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

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

// ** Icons Imports
import { schoolStatusList } from "src/components/student-static-data";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TableHeader = (props) => {
  // ** Props
  const { value, handleFilter } = props;
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      keyword: "",
    },
  });

  return (
    <form>
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
                <TextField
                  value={value}
                  onChange={(e) => handleFilter(e.target.value)}
                  sx={{ width: "50%" }}
                  size="small"
                  placeholder="GMTコード / タイムゾーン名 /  タイムゾーン名（英語）"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="column" item xs={12} sm={6} sx={{ mt: 2 }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            ></Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default TableHeader;

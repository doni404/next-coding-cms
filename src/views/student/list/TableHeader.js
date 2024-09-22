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
  const { onSubmit, toggle } = props;
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      keyword: "",
      school_status: [],
    },
  });

  // Watch the school_status field
  const selectedStatuses = watch("school_status");

  const handleCheckboxChange = (key) => (event) => {
    const isChecked = event.target.checked;
    const newStatus = isChecked
      ? [...selectedStatuses, key]
      : selectedStatuses.filter((item) => item !== key);

    setValue("school_status", newStatus);
  };

  const downloadExcel = async () => {
    // Get the current form data
    const formData = watch();
    const formattedStatus = formData.school_status.join(",");
    const finalData = { ...formData, school_status: formattedStatus };
  
    // Prepare filter data
    let dataFilter = {}

    // Filter parameter which have a value
    const activeParams = Object.keys(finalData).filter(key => finalData[key])
    activeParams.map(param => dataFilter[param] = finalData[param])
  
    const data = new URLSearchParams(dataFilter).toString();
    console.log('params ', data)
  
    const endpoint = "v1/cms/students/excel?"+data+"&sort_by=created_at.desc"
    console.log('endpoint ', endpoint)
  
    try {
      const response = await axiosInstance.get(`${BASE_URL_API}` + endpoint, {
        responseType: 'blob', // Important
      });
      
      console.log('response', response)
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Ensemble_Student_List.xlsx'); // or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const onSubmitForm = (data) => {
    const formattedStatus = data.school_status.join(",");
    const finalData = { ...data, school_status: formattedStatus };
    console.log("data", finalData);

    onSubmit(finalData);
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
                      placeholder="氏名（漢字) / Eメール /  会員番号"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" alignItems="center" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={12}>
                <FormGroup sx={{ flexDirection: "row" }}>
                  {Object.keys(schoolStatusList).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Controller
                          name="school_status"
                          control={control}
                          render={() => (
                            <Checkbox
                              checked={selectedStatuses.includes(key)}
                              onChange={handleCheckboxChange(key)}
                            />
                          )}
                        />
                      }
                      label={schoolStatusList[key]}
                    />
                  ))}
                </FormGroup>
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
              <Button sx={{ mb: 2, mr: 2}} onClick={downloadExcel} variant="contained">
                <Download sx={{ mr: 2 }} />
                生徒一覧DL
              </Button>
              <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
                生徒登録
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  );
};

export default TableHeader;

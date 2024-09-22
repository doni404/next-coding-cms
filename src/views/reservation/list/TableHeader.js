// ** React Imports
import { useState, useEffect, useCallback } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// ** Third Party Imports
import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import moment from "moment";

// ** Styled Components
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";

// ** Third Party Styles Imports

const TableHeader = (props) => {
  // ** Props
  const { handleFilter, value, add, substract} = props;

  // custom input for date
  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
  });
  
  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: { xs: "block", sm: "flex" },
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <DatePickerWrapper
          sx={{
            zIndex: "999",
            ".MuiInputBase-input": { padding: "8.5px 14px" },
          }}
          size="small"
        >
          <DatePicker
            id="date"
            selected={value.toDate()}
            showYearDropdown
            showMonthDropdown
            dateFormat="yyyy-MM-dd"
            onChange={(e) => handleFilter(e)}
            placeholderText="YYYY-MM-DD"
            customInput={
              <CustomInput
                value={value}
                onChange={(e) => handleFilter(e.target.value)}
                aria-describedby="validation-basic-dob"
              />
            }
          />
        </DatePickerWrapper>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: { xs: "start", sm: "end" },
          flex: 1,
          marginTop: { xs: 4, sm: 0 },
        }}
      >
        <Button
          onClick={(e) => substract(value)}
          size="large"
          type="submit"
          variant="outlined"
          sx={{
            height: "40px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            borderColor: "#4c4e6438",
          }}
          color="secondary"
        >
          前
        </Button>
        <TextField
          id="outlined-basic"
          value={moment(value).format("YYYY年MM月DD")}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          size="small"
          sx={{
            ".MuiOutlinedInput-root": {
              borderRadius: 0,
              width: "160px",
              ".MuiInputBase-input": {
                textAlign: "center",
              },
            },
          }}
        />
        <Button
          onClick={(e) => add(value)}
          size="large"
          type="submit"
          variant="outlined"
          sx={{
            height: "40px",
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
            borderColor: "#4c4e6438",
          }}
          color="secondary"
        >
          次
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;

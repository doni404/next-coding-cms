// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import { tabsClasses } from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import Card from "@mui/material/Card";

// ** Icons Imports
import HistoryIcon from 'mdi-material-ui/History';

// ** Demo Components Imports
import AdminEdit from "src/views/admin/detail/AdminEdit";
import AdminLoginLogs from "src/views/admin/detail/AdminLoginLogs";
import { FormSelect } from "mdi-material-ui";

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: "row",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(1),
  },
}));

const AdminDetailBottom = ({ data, id }) => {
  // ** State

  const [value, setValue] = useState("detail");
  console.log(data);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        aria-label="forced scroll tabs example"
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          mb: 3,
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        <Tab
          value="detail"
          label="詳細"
          icon={<FormSelect sx={{ fontSize: "18px" }} />}
        />
        <Tab
          value="login-logs"
          label="ログインログ"
          icon={<HistoryIcon sx={{ fontSize: "18px" }} />}
        />
      </TabList>
      <Box>
        <TabPanel sx={{ p: 0 }} value="detail">
          <AdminEdit data={data} id={id} />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="login-logs">
          <AdminLoginLogs data={data} id={id} />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default AdminDetailBottom;

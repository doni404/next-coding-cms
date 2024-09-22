// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";
import { tabsClasses } from "@mui/material/Tabs";

// ** Icons Imports
import CardAccountMailOutline from "mdi-material-ui/CardAccountMailOutline";
import EmailFastOutline from "mdi-material-ui/EmailFastOutline";

// ** Demo Components Imports
import CreateMailTesting from "src/views/notification/magazine/create/CreateMailTesting";
import CreateMailProduction from "src/views/notification/magazine/create/CreateMailProduction";

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: "row",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(1),
  },
}));

const CreateMagazinePage = () => {
  // ** State
  const [value, setValue] = useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList
        variant="scrollable"
        allowScrollButtonsMobile
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
          value="one"
          label="テスト送信"
          icon={<CardAccountMailOutline sx={{ fontSize: "18px" }} />}
        />
        <Tab
          value="many"
          label="配信"
          icon={<EmailFastOutline sx={{ fontSize: "22px" }} />}
        />
      </TabList>
      <Box>
        <TabPanel sx={{ p: 0 }} value="one">
          <CreateMailTesting />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="many">
          <CreateMailProduction />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default CreateMagazinePage;

// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab from "@mui/material/Tab";

// ** Icons Imports
import BellOutline from "mdi-material-ui/BellOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import LockOpenOutline from "mdi-material-ui/LockOpenOutline";
import BookmarkOutline from "mdi-material-ui/BookmarkOutline";
import InformationOutline from "mdi-material-ui/InformationOutline";

// ** Demo Tabs Imports
import TabInfo from "src/views/pages/account-settings/TabInfo";
import TabAccount from "src/views/pages/account-settings/TabAccount";
import TabBilling from "src/views/pages/account-settings/TabBilling";
import TabSecurity from "src/views/pages/account-settings/TabSecurity";
import TabNotifications from "src/views/pages/account-settings/TabNotifications";

import axiosInstance from "src/helper/axiosInstance"

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  marginLeft: theme.spacing(2.5),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState("account");
  const [data, setData] = useState(null);
  const userData = JSON.parse(window.sessionStorage.getItem("userData"));
  const apiUrl = BASE_URL_API + "v1/cms/admins/" + userData.id;
  const token = window.sessionStorage.getItem("token");
  console.log("data user acc : ",userData)
  console.log("api url : ",apiUrl)

  useEffect(() => {
    console.log("use effect run ")
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    axiosInstance.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("load admin : ", res.data.data);
        setData(res.data.data);
      })
      .catch((error) => {
       console.log("error", error);
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (data) {
  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="account-settings tabs"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value="account"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>管理者詳細</TabName>
              </Box>
            }
          />
          <Tab
            value="password"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LockOpenOutline sx={{ fontSize: "1.125rem" }} />
                <TabName>パスワードの変更</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value="account">
          <TabAccount data={data}/>
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="password">
          <TabSecurity />
        </TabPanel>
      </TabContext>
    </Card>
  );
  } else {
    return null;
  }
};

export default AccountSettings;

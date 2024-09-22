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
import Card from "@mui/material/Card";

// ** Icons Imports
import CarCog from "mdi-material-ui/CarCog";
import Cached from "mdi-material-ui/Cached";
import FileDocumentOutline from "mdi-material-ui/FileDocumentOutline";
import HistoryIcon from 'mdi-material-ui/History';
import CertificateOutline from "mdi-material-ui/CertificateOutline";
import CashMultiple from "mdi-material-ui/CashMultiple";

// ** Demo Components Imports
import { FormSelect } from "mdi-material-ui";
import StudentEdit from "src/views/student/detail/StudentEdit";
import StudentCertificate from "src/views/student/detail/StudentCertificate";
import StudentOrderHistory from "src/views/student/detail/StudentOrderHistory";
import StudentPointHistory from "src/views/student/detail/StudentPointHistory";
import StudentLessonHistory from "src/views/student/detail/StudentLessonHistory";
import StudentLoginLogs from "src/views/student/detail/StudentLoginLogs";
import StudentChangeLogs from "src/views/student/detail/StudentChangeLogs";

import { useRouter } from "next/router";

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: "row",
  "& svg": {
    marginBottom: "0 !important",
    marginRight: theme.spacing(1),
  },
}));

const StudentDetailBottom = ({ data, state, setRefreshKey }) => {
  // ** State
  const [value, setValue] = useState("detail");
  // console.log(id)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ overflow: "visible" }}>
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
            value="detail"
            label="生徒情報"
            icon={<FormSelect sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="certification"
            label="証明書発行"
            icon={<CertificateOutline sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="order_history"
            label="領収書"
            icon={<FileDocumentOutline sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="point_history"
            label="個別推移表"
            icon={<CashMultiple sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="lesson_history"
            label="レッスン履歴"
            icon={<CarCog sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="student_login_logs"
            label="ログイン履歴"
            icon={<HistoryIcon sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="student_change_logs"
            label="変更履歴"
            icon={<Cached sx={{ fontSize: "18px" }} />}
          />
        </TabList>
        <Box>
          <TabPanel sx={{ p: 0 }} value="detail">
            <StudentEdit data={data} setRefreshKey={setRefreshKey} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="certification">
            <StudentCertificate data={data} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="order_history">
            <StudentOrderHistory data={data} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="point_history">
            <StudentPointHistory data={data} setRefreshKey={setRefreshKey} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="lesson_history">
            <StudentLessonHistory data={data} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="student_login_logs">
            <StudentLoginLogs data={data} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="student_change_logs">
            <StudentChangeLogs data={data} />
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  );
};

export default StudentDetailBottom;

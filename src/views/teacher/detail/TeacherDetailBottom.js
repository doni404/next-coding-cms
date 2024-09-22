// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import { tabsClasses } from "@mui/material/Tabs";
import Card from "@mui/material/Card";

// ** Icons Imports
import CarCog from "mdi-material-ui/CarCog";
import Cached from "mdi-material-ui/Cached";
import HistoryIcon from 'mdi-material-ui/History';
import VideoOutline from 'mdi-material-ui/VideoOutline'


// ** Demo Components Imports
import { FormSelect } from 'mdi-material-ui'
import TeacherEdit from "src/views/teacher/detail/TeacherEdit";
import TeacherVideos from "src/views/teacher/detail/TeacherVideos";
import TeacherLessonHistory from "src/views/teacher/detail/TeacherLessonHistory";
import TeacherLoginLogs from "src/views/teacher/detail/TeacherLoginLogs";
import TeacherChangeLogs from "src/views/teacher/detail/TeacherChangeLogs";

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const TeacherDetailBottom = ({ data, setRefreshKey }) => {
  // ** State
  const [value, setValue] = useState("information");

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
            value="information"
            label="講師情報"
            icon={<FormSelect sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="videos"
            label="動画一覧"
            icon={<VideoOutline sx={{ fontSize: "18px" }} />}
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
          <TabPanel sx={{ p: 0 }} value="information">
            <TeacherEdit data={data} setRefreshKey={setRefreshKey} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="videos">
            <TeacherVideos data={data} /> 
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="lesson_history">
            <TeacherLessonHistory data={data} /> 
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="student_login_logs">
            <TeacherLoginLogs data={data} /> 
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="student_change_logs">
            <TeacherChangeLogs data={data} /> 
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  );
};

export default TeacherDetailBottom;

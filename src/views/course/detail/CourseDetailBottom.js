// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Card from "@mui/material/Card";

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import BookOpenOutline from 'mdi-material-ui/BookOpenOutline'

// ** Demo Components Imports
import CourseEdit from "src/views/course/detail/CourseEdit";
// import CourseChild from "src/views/course/detail/CourseChild";
// import CourseTeacher from "src/views/course/detail/CourseTeacher";
import { FormSelect } from 'mdi-material-ui'

// ** Third party Imports
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from 'next/router'

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const CourseDetailBottom = ({data, id, setRefreshKey }) => {
  // ** State
  const [value, setValue] = useState("detail");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ overflow: "visible" }}>
      <TabContext value={value}>
        <TabList
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleChange}
          aria-label="forced scroll tabs example"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value="detail"
            label="コース情報"
            icon={<FormSelect sx={{ fontSize: "18px" }} />}
          />
          {/* <Tab
          value="course_child"
          label="子コース一覧"
          icon={<BookOpenOutline sx={{ fontSize: "18px" }} />}
          />
          <Tab
          value="course_teacher"
          label="インストラクター一覧"
          icon={<AccountOutline sx={{ fontSize: "18px" }} />}
          /> */}
        </TabList>
        <Box>
          <TabPanel sx={{ p: 0 }} value="detail">
            <CourseEdit data={data} id={id} setRefreshKey={setRefreshKey} />
          </TabPanel>
          {/* <TabPanel sx={{ p: 0 }} value="course_child">
            <CourseChild data={dataCourse} /> 
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="course_teacher">
            <CourseTeacher data={dataCourse} /> 
          </TabPanel> */}
        </Box>
      </TabContext>
    </Card>
  );
};

export default CourseDetailBottom;

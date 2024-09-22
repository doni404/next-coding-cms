// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Card from "@mui/material/Card";

// ** Icons Imports
import CircleEditOutline from "mdi-material-ui/CircleEditOutline";
import ImageOutline from "mdi-material-ui/ImageOutline";

// ** Demo Components Imports
import NewsEdit from "src/views/news/detail/NewsEdit";
import NewsContentEditor from './NewsContentEditor'
import { FormSelect } from 'mdi-material-ui'

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const NewsDetailBottom = ({ setRefreshKey, data,id }) => {
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
            label="詳細"
            icon={<FormSelect sx={{ fontSize: "18px" }} />}
          />
          <Tab
            value="content"
            label="内容"
            icon={<CircleEditOutline sx={{ fontSize: "18px" }} />}
          />
        </TabList>
        <Box>
          <TabPanel sx={{ p: 0 }} value="detail">
            <NewsEdit setRefreshKey={setRefreshKey} data={data} id={id} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value="content">
            <NewsContentEditor setRefreshKey={setRefreshKey} data={data} id={id} />
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  );
};

export default NewsDetailBottom;

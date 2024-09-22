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
import ConfigSiteEdit from "src/views/settings/config-site/detail/ConfigSiteEdit";
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

const ConfigSiteDetailBottom = ({ data, setRefreshKey }) => {
  // ** State

  const [value, setValue] = useState("detail");
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ overflow: "visible" }}>
      <TabContext value={value}>
        <Box>
          <TabPanel sx={{ p: 0 }} value="detail">
            <ConfigSiteEdit data={data} setRefreshKey={setRefreshKey}/>
          </TabPanel>
        </Box>
      </TabContext>
    </Card>
  );
};

export default ConfigSiteDetailBottom;

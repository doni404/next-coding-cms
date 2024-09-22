// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Components
import StudentInformation from "src/views/student/detail/edit/StudentInformation";
import AccountSns from "src/views/student/detail/edit/AccountSns";
import StudentPassword from "src/views/student/detail/edit/StudentPassword";
import AccountNotification from "src/views/student/detail/edit/AccountNotification";

const StudentEdit = ({ data, setRefreshKey }) => {
  return (
    <Grid fullWidth container>
      <Grid item xs={12} md={7} sx={{ padding : "0 1rem 1rem"}}>
        <StudentInformation data={data} setRefreshKey={setRefreshKey}/>
      </Grid>
      <Grid item xs={12} md={5} sx={{ padding : "0 1rem 1rem"}}>
        <StudentPassword data={data} />
      </Grid>

    </Grid>
  );
};

export default StudentEdit;

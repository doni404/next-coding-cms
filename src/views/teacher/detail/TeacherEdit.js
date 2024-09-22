// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Components
import TeacherInformation from "src/views/teacher/detail/edit/TeacherInformation";
import TeacherPassword from "src/views/teacher/detail/edit/TeacherPassword";

const StudentEdit = ({data, setRefreshKey}) => {
  return (
    <Grid fullWidth container>
      <Grid item xs={12} md={7} sx={{ padding : "0 1rem 1rem"}}>
        <TeacherInformation data={data} setRefreshKey={setRefreshKey}/>
      </Grid>
      <Grid item xs={12} md={5} sx={{ padding : "0 1rem 1rem"}}>
        <TeacherPassword data={data} />
      </Grid>
    </Grid>
  );
};

export default StudentEdit;

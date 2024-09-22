// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Components
import AdminDetail from "src/views/admin/detail/edit/AdminDetail";
import AdminPassword from "src/views/admin/detail/edit/AdminPassword";

const StudentEdit = ({ data }) => {
  return (
    <Grid container spacing={12}>
      <Grid item xs={12} md={7}>
        <AdminDetail data={data} />
      </Grid>
      <Grid item xs={12} md={5}>
        <AdminPassword data={data} />
      </Grid>

    </Grid>
  );
};

export default StudentEdit;

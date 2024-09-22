// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';
import MonthlySalesChart from "src/views/dashboards/MonthlySalesChart";
import TotalStudent from "src/views/dashboards/TotalStudent";
import TotalReservation from "src/views/dashboards/TotalReservation";
import TotalTeacher from "src/views/dashboards/TotalTeacher";
import TotalOrder from 'src/views/dashboards/TotalOrder';
  
const AnalyticsDashboard = () => {

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className="match-height">
        <Grid item xs={12} sm={3} md={3}>
          <TotalStudent />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TotalTeacher />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TotalReservation />
        </Grid>
        <Grid item xs={12} sm={3} md={3}>
          <TotalOrder />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <MonthlySalesChart />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
}

export default AnalyticsDashboard

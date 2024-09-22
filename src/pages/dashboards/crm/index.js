// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import NewspaperVariant from 'mdi-material-ui/NewspaperVariant'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import Account from 'mdi-material-ui/Account'
import School from 'mdi-material-ui/School'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CrmAward from 'src/views/dashboards/crm/CrmAward'
import CrmTable from 'src/views/dashboards/crm/CrmTable'
import CrmTotalGrowth from 'src/views/dashboards/crm/CrmTotalGrowth'
import CrmTotalProfit from 'src/views/dashboards/crm/CrmTotalProfit'
import CrmMonthlyBudget from 'src/views/dashboards/crm/CrmMonthlyBudget'
import CrmExternalLinks from 'src/views/dashboards/crm/CrmExternalLinks'
import CrmWeeklyOverview from 'src/views/dashboards/crm/CrmWeeklyOverview'
import CrmPaymentHistory from 'src/views/dashboards/crm/CrmPaymentHistory'
import CrmOrganicSessions from 'src/views/dashboards/crm/CrmOrganicSessions'
import CrmProjectTimeline from 'src/views/dashboards/crm/CrmProjectTimeline'
import CrmMeetingSchedule from 'src/views/dashboards/crm/CrmMeetingSchedule'
import CrmSocialNetworkVisits from 'src/views/dashboards/crm/CrmSocialNetworkVisits'
import CrmMostSalesInCountries from 'src/views/dashboards/crm/CrmMostSalesInCountries'

// ** Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchData } from "src/store/apps/dashboard";

const CrmDashboard = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.dashboard);
  const router = useRouter();

  useEffect(() => {
    dispatch(
      fetchData()
    ).unwrap()
      .then((originalPromiseResult) => {
        // handle result here
      })
      .catch((rejectedValueOrSerializedError) => {
        const rejected = rejectedValueOrSerializedError.message
        console.log("rejected : ", rejected.toString())
      });
  }, [dispatch])

  console.log("store dashboard : ", store);

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        {/* <Grid item xs={12} md={4}>
          <CrmAward />
        </Grid> */}
        <Grid item xs={6} sm={4} md={3}>
          <CardStatisticsVertical
            stats={store.data.total_active_students}
            color='primary'
            // trendNumber='+22%'
            icon={<AccountGroup />}
            title='生徒'
            // chipText='Last 4 Month'
            kanji='人'
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <CardStatisticsVertical
            stats={store.data.total_active_teachers}
            color='success'
            title='講師'
            icon={<Account />}
            kanji='人'
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <CardStatisticsVertical
            stats={store.data.total_reserved_done_reservations}
            color='info'
            title='レッスン履歴の総数'
            icon={<School />}
            kanji='科目'
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
        <CardStatisticsVertical
          stats={store.data.total_reserved_ongoing_reservations}
          color='warning'
          title='予約中のレッスン'
          icon={<NewspaperVariant />}
          kanji='予約'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CrmWeeklyOverview />
        </Grid>
        <Grid item xs={12} md={6}>
          <CrmMostSalesInCountries />
        </Grid>
        <Grid item xs={12} md={4}>
          <CrmOrganicSessions />
        </Grid>
        <Grid item xs={12} md={8}>
          <CrmProjectTimeline />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmSocialNetworkVisits />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmMonthlyBudget />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CrmMeetingSchedule />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CrmExternalLinks />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CrmPaymentHistory />
        </Grid>
        <Grid item xs={12} md={12}>
          <CrmTable />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default CrmDashboard

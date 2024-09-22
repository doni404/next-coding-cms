// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

import axios from "axios";

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";

  date = date.slice(5, 8);
  // console.log("999 date slice", date);
  if (date.charAt(0) === "0") {
    date = date.slice(1, 3);
  } else {
    date = date
  }

  return date;
}

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

function ParseFloat(str, val) {
  str = String(str);
  str = str.slice(0, str.indexOf(".") + val + 1);
  return Number(str);
}

const apiUrl = BASE_URL_API + "v1/nft_sales/period?time=monthly";
const date = [];
const total = [];

const getSalesChart = async () => {
  const token = window.sessionStorage.getItem("token");
  axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const x = response.data.data.length;
      for (var i = 0; i < x; i++) {
        date.push(dateFormater(response.data.data[i].sales_date));
        total.push(ParseFloat(response.data.data[i].sales_total, 3));
      }
    })
    .catch(() => { });
};


const series = [
  {
    name: "Sales",
    data: total,
  },
];

const MonthlySalesChart = () => {
  const maxTotal = Math.max(...total);

  // ** Hook
  const theme = useTheme()
  // getSalesChart();

  const options = {
    chart: {
      offsetY: -9,
      offsetX: -16,
      parentHeightOffset: 0,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "35%",
        // endingShape: "rounded",
        startingShape: "rounded",
        // colors: {
        //   ranges: [
        //     {
        //       from: 40,
        //       to: 50,
        //       color: hexToRGBA(theme.palette.primary.main, 1),
        //     },
        //   ],
        // },
      },
    },
    markers: {
      size: 3.5,
      strokeWidth: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
      colors: [theme.palette.background.paper],
      strokeColors: hexToRGBA(theme.palette.primary.main, 1),
    },
    stroke: {
      width: [0, 2],
      colors: [theme.palette.background.default, theme.palette.primary.main],
    },
    legend: { show: false },
    grid: { strokeDashArray: 7 },
    dataLabels: { enabled: false },
    // colors: [hexToRGBA(theme.palette.background.default, 1)],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    xaxis: {
      categories: date,
      // categories: [
      //   "1月",
      //   "2月",
      //   "3月",
      // ],
      tickPlacement: "on",
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      min: 0,
      max: maxTotal,
      show: true,
      tickAmount: 3,
      // labels: {
      //   formatter: (value) =>
      //     `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`,
      // },
      // labels: {
      //   formatter: (value) => parseFloat(value).toFixed(2),
      // },
    },
  };

  return (
    <Card>
      <CardHeader
        title="月間売上"
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
          >
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent
        sx={{
          "& .apexcharts-xcrosshairs.apexcharts-active": { opacity: 0 },
          "& .apexcharts-canvas .apexcharts-yaxis-label": {
            fontSize: "0.75rem",
            fill: theme.palette.text.disabled,
          },
        }}
      >
        <ReactApexcharts
          type="bar"
          height={250}
          series={series}
          options={options}
        />
        {/* <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 4 }} variant="h5">
            62%
          </Typography>
          <Typography variant="body2">
            Your sales performance is 35% 😎 better compared to last month
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  );
}

export default MonthlySalesChart

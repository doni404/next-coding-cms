// ** MUI Import
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = () => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    > 
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="89"
      height="91"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 89 91"
      xmlSpace="preserve"
    >
      <image
        width="89"
        height="91"
        x="0"
        y="0"
        href="data:image/png;base64,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"
      ></image>
    </svg>

      {/* <svg width={80} fill='none' height={44} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
        <rect
          rx='25.1443'
          width='50.2886'
          height='143.953'
          fill={theme.palette.primary.main}
          transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
        />
        <rect
          rx='25.1443'
          width='50.2886'
          height='143.953'
          fillOpacity='0.4'
          fill='url(#paint0_linear_7821_79167)'
          transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
        />
        <rect
          rx='25.1443'
          width='50.2886'
          height='143.953'
          fill={theme.palette.primary.main}
          transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
        />
        <rect
          rx='25.1443'
          width='50.2886'
          height='143.953'
          fill={theme.palette.primary.main}
          transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
        />
        <rect
          rx='25.1443'
          width='50.2886'
          height='143.953'
          fillOpacity='0.4'
          fill='url(#paint1_linear_7821_79167)'
          transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
        />
        <rect
          rx='25.1443'
          width='50.2886'
          height='143.953'
          fill={theme.palette.primary.main}
          transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
        />
        <defs>
          <linearGradient
            y1='0'
            x1='25.1443'
            x2='25.1443'
            y2='143.953'
            id='paint0_linear_7821_79167'
            gradientUnits='userSpaceOnUse'
          >
            <stop />
            <stop offset='1' stopOpacity='0' />
          </linearGradient>
          <linearGradient
            y1='0'
            x1='25.1443'
            x2='25.1443'
            y2='143.953'
            id='paint1_linear_7821_79167'
            gradientUnits='userSpaceOnUse'
          >
            <stop />
            <stop offset='1' stopOpacity='0' />
          </linearGradient>
        </defs>
      </svg> */}
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'

const CardStatsVertical = props => {
  // ** Props
  const { title, color, icon, stats, trend, chipText, trendNumber, kanji } = props
  const TrendIcon = trend === 'positive' ? ChevronUp : ChevronDown

  return (
    <Card>
      <CardContent sx={{ }}>
        <Box sx={{ mb: 6, width: '100%', display: 'flex', alignItems: 'flex-start' }}>
          <CustomAvatar skin='light' variant='rounded' color={color}>
            {icon}
          </CustomAvatar>
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='subtitle2' sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}>
              {trendNumber}
            </Typography>
            <TrendIcon fontSize='small' sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }} />
          </Box> */}
          <Typography variant='h4' sx={{ mb: 1, margin: "auto auto auto 1.5rem"}}>
            {stats} <span style={{fontSize: "14px"}}>{kanji}</span>
          </Typography>
        </Box>
       
        <Typography variant='body2' sx={{ mb: 5, textAlign: "center", fontWeight: "700" }}>
          {title}
        </Typography>
        {/* <CustomChip
          skin='light'
          size='small'
          label={chipText}
          color='secondary'
          sx={{ height: 20, fontWeight: 500, fontSize: '0.75rem', alignSelf: 'flex-start', color: 'text.secondary' }}
        /> */}
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical

CardStatsVertical.defaultProps = {
  color: 'primary',
  trend: 'positive'
}

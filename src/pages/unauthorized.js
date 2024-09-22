// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import Cookies from 'js-cookie'

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))

const Error401 = () => {
  const router = useRouter()
  const auth = useAuth()
  
  function backtoHome() {
    auth.setUser(null)
    window.sessionStorage.removeItem("userData");
    window.sessionStorage.removeItem("token");
    Cookies.remove('en_cms_cookie_login')
    Cookies.remove('en_cms_cookie_user_data')
    window.location = "/login";
  }
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            401
          </Typography>
          <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            あなたには権限がありません！ 🔐
          </Typography>
          <Typography variant='body2'>このページにアクセスする権限がありません。ホームに戻りましょう！</Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/401.png' />
        <Button component='a' color='primary' variant='contained' sx={{ px: 5.5, backgroundColor: '#ff3d00' }} onClick={backtoHome}>
          ホームに戻る
        </Button>
      </Box>
      <FooterIllustrations image='/images/pages/misc-401-object.png' />
    </Box>
  )
}
Error401.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error401

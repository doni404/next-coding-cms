// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Axios
import axios from 'axios'

// ** Actions Imports
import toast from "react-hot-toast";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const defaultValues = {
  email: ''
}

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email.").required("Email is a required field.")
})

const ForgotPassword = () => {
  // ** Hooks
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data) => {
    var params = {
      email: data.email
    };
    console.log("params ", params);

    axios
      .post(BASE_URL_API + "v1/cms/admins/forgot-password", params)
      .then(async response => {
        if (!response.error) {
          router.push('/login')
          toast.success("A password reset link has been sent to your email.");
        } else {
          toast.error("We couldn't send the password reset link to your email.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("We couldn't send the password reset link to your email.");
      })
  }

  const imageSource =
    skin === 'bordered' ? 'auth-v2-forgot-password-illustration-bordered' : 'auth-v2-forgot-password-illustration'

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <ForgotPasswordIllustrationWrapper>
            <ForgotPasswordIllustration
              alt='forgot-password-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </ForgotPasswordIllustrationWrapper>
          <FooterIllustrationsV2 image={`/images/pages/auth-v2-forgot-password-mask-${theme.palette.mode}.png`} />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: -30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
                <image href="/images/coding-logo.png" width="180" height="180" />
              </svg>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Reset Password 🔒</TypographyStyled>
              <Typography variant='body2'>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ display: 'flex', mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      label='Email'
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='user@email.com'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }}>
                Send
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link passHref href='/login'>
                  <Typography
                    component={MuiLink}
                    sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', justifyContent: 'center' }}
                  >
                    <ChevronLeft sx={{ mr: 1.5, fontSize: '2rem' }} />
                    <span>Return to login page</span>
                  </Typography>
                </Link>
              </Typography>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ForgotPassword.guestGuard = true
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgotPassword

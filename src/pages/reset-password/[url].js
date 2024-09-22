// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Axios
import axios from 'axios'

// ** Actions Imports
import toast from "react-hot-toast";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const defaultValues = {
  password: '',
  confirmPassword: ''
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
  password: yup.string().min(8, "At least 8 characters.").required(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password"), null], "The passwords must match.")
})

const ResetPassword = () => {
  const router = useRouter()
  const { url } = router.query

  console.log("router path : ", url)
  const [showPassword, setShowPassword] = useState(false);
  const [cShowPassword, setcShowPassword] = useState(false);

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {

    var params = {
      password: data.password
    };
    console.log("params ", params);

    axios
      .patch(BASE_URL_API + "v1/cms/admins/reset-password/" + url, params)
      .then(async response => {
        console.log("response : " + response)
        if (!response.error) {
          router.push('/login')
          toast.success("Your password has been successfully reset.");
        } else {
          toast.error("Could not reset password.");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Could not reset your password.");
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
              <TypographyStyled variant='h5'>Reset Password</TypographyStyled>
              <Typography variant='body2'>
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* input password */}
              <FormControl fullWidth sx={{ display: 'flex', mb: 4 }}>
                <InputLabel
                  htmlFor="passwordId"
                  error={Boolean(errors.password)}
                >
                  New Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="New Password"
                      onChange={onChange}
                      id="passwordId"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }} id="">
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>

              {/* confirm password */}
              <FormControl fullWidth sx={{ display: 'flex', mb: 4 }}>
                <InputLabel
                  htmlFor="cpasswordId"
                  error={Boolean(errors.confirmPassword)}
                >
                  Confirm Password
                </InputLabel>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Confirm Password"
                      onChange={onChange}
                      id="cpasswordId"
                      error={Boolean(errors.confirmPassword)}
                      type={cShowPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setcShowPassword(!cShowPassword)}
                          >
                            {cShowPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormHelperText sx={{ color: "error.main" }} id="">
                    {errors.confirmPassword.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }}>
                Reset
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
ResetPassword.guestGuard = true
ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ResetPassword

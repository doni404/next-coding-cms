// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from "axios";

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
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
    maxWidth: 500
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 500
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

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email address.").required("Email is a required field."),
  password: yup.string().required("Password is a required field."),
});

const defaultValues = {
  password: '',
  email: '',
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  // ** Hooks
  const auth = useAuth();
  const theme = useTheme();
  const bgClasses = useBgColor();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  // ** Vars
  const { skin } = settings;

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
    var data = {
      email: data.email,
      password: data.password,
      remember: checked
    };

    auth.login(data, () => {
      setError('email', {
        type: 'manual',
        message: 'Invalid email address or password.'
      })
    })
    console.log("login email: ", data.email)
  }

  // remember me checkbox
  const [checked, setChecked] = useState(false);
  const handleChangeCheck = event => {
    console.log("checked ", event.target.checked)
    setChecked(event.target.checked)
  }

  const imageSource =
    skin === "bordered"
      ? "auth-v2-login-illustration-bordered"
      : "auth-v2-login-illustration";

  return (
    <Box className="content-right">
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt="login-illustration"
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === "bordered" && !hidden
            ? { borderLeft: `1px solid ${theme.palette.divider}` }
            : {}
        }
      >
        <Box
          sx={{
            p: 7,
            height: "100%",
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            backgroundColor: "background.paper",
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Box>
            <Box sx={{ mb: 6 }} style={{ marginTop: "4rem", marginBottom: "2rem" }}>
              <img src="/images/coding-logo.png" style={{ width: "70%", textAlign: "center" }} />
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant="h5">{`${themeConfig.templateName} CMS 👋🏻`}</TypographyStyled>
              <Typography variant="body2">
                Manage your products, orders, and more through CMS
              </Typography>
            </Box>
            {/* <Alert
              icon={false}
              sx={{
                py: 3,
                mb: 6,
                ...bgClasses.primaryLight,
                "& .MuiAlert-message": { p: 0 },
              }}
            >
              <Typography
                variant="caption"
                sx={{ mb: 2, display: "block", color: "primary.main" }}
              >
                Admin: <strong>admin@materialize.com</strong> / Pass:{" "}
                <strong>admin</strong>
              </Typography>
              <Typography
                variant="caption"
                sx={{ mb: 2, display: "block", color: "primary.main" }}
              >
                Client: <strong>client@materialize.com</strong> / Pass:{" "}
                <strong>client</strong>
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "primary.main" }}
              >
                Test: <strong>test@gloding.com</strong> / Pass:{" "}
                <strong>gdev1000</strong>
              </Typography>
            </Alert> */}
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder="admin@coconutpudding.id"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="passwordId"
                  error={Boolean(errors.password)}
                >
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label="Password"
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
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  label="Remember me"
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeCheck}
                      label="Remember me"
                      id="remember"
                    />}
                  sx={{
                    "& .MuiFormControlLabel-label": { color: "text.primary" },
                  }}
                />
                <Link passHref href="/forgot-password">
                  <Typography
                    component={MuiLink}
                    variant="body2"
                    sx={{ color: "primary.main" }}
                  >
                    Forgot your password?
                  </Typography>
                </Link>
              </Box>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mb: 7 }}
              >
                Login
              </Button>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  );
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage

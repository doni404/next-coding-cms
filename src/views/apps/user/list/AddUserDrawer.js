// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  company: yup.string().required(),
  country: yup.string().required(),
  email: yup.string().email().required(),
  contact: yup
    .number()
    .typeError('Contact Number field is required')
    .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  fullName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  email: '',
  company: '',
  country: '',
  contact: '',
  fullName: '',
  username: ''
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Hooks
  const dispatch = useDispatch();

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(addUser({ ...data, role, currentPlan: plan }));
    toggle();
    reset();
  };

  const handleClose = () => {
    setPlan("basic");
    setRole("subscriber");
    setValue("contact", "");
    toggle();
    reset();
  };

  /////////// DINI ADD //////////

  // const [fullName, setFullName] = useState();
  // const [username, setUsername] = useState();
  // const [email, setEmail] = useState();
  // const [company, setCompany] = useState();
  // const [country, setCountry] = useState();
  // const [contact, setContact] = useState();


  const submitData = () => {
    // setFullName(fullNameID.value);
    // setUsername(usernameID.value);
    // setEmail(emailID.value);
    // setCompany(companyID.value);
    // setCountry(countryID.value);
    // setContact(contactID.value);

    // console.log("full name : ", fullNameID.value);
    // console.log("username : ", usernameID.value);
    // console.log("email : ", emailID.value);
    // console.log("company : ", companyID.value);
    // console.log("country : ", countryID.value);
    // console.log("contact : ", contactID.value);
    // console.log("role : ", role);
    // console.log("plan : ", plan);

    window.sessionStorage.setItem("fullName", fullNameID.value);
    window.sessionStorage.setItem("username", usernameID.value);
    window.sessionStorage.setItem("email", emailID.value);
    window.sessionStorage.setItem("company", companyID.value);
    window.sessionStorage.setItem("country", countryID.value);
    window.sessionStorage.setItem("contact", contactID.value);
    window.sessionStorage.setItem("role", role);
    window.sessionStorage.setItem("plan", plan);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">Add User</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="fullNameID"
                  value={value}
                  label="Full Name"
                  onChange={onChange}
                  placeholder="John Doe"
                  error={Boolean(errors.fullName)}
                />
              )}
            />
            {errors.fullName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.fullName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="usernameID"
                  value={value}
                  label="Username"
                  onChange={onChange}
                  placeholder="johndoe"
                  error={Boolean(errors.username)}
                />
              )}
            />
            {errors.username && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.username.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="emailID"
                  type="email"
                  value={value}
                  label="Email"
                  onChange={onChange}
                  placeholder="johndoe@email.com"
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="company"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="companyID"
                  value={value}
                  label="Company"
                  onChange={onChange}
                  placeholder="Company PVT LTD"
                  error={Boolean(errors.company)}
                />
              )}
            />
            {errors.company && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.company.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="countryID"
                  value={value}
                  label="Country"
                  onChange={onChange}
                  placeholder="Australia"
                  error={Boolean(errors.country)}
                />
              )}
            />
            {errors.country && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.country.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="contact"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="contactID"
                  type="number"
                  value={value}
                  label="Contact"
                  onChange={onChange}
                  placeholder="(397) 294-5153"
                  error={Boolean(errors.contact)}
                />
              )}
            />
            {errors.contact && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.contact.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="role-select">Select Role</InputLabel>
            <Select
              fullWidth
              value={role}
              id="roleID"
              label="Select Role"
              labelId="role-select"
              onChange={(e) => setRole(e.target.value)}
              inputProps={{ placeholder: "Select Role" }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="maintainer">Maintainer</MenuItem>
              <MenuItem value="subscriber">Subscriber</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="plan-select">Select Plan</InputLabel>
            <Select
              fullWidth
              value={plan}
              id="planID"
              label="Select Plan"
              labelId="plan-select"
              onChange={(e) => setPlan(e.target.value)}
              inputProps={{ placeholder: "Select Plan" }}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="company">Company</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
              <MenuItem value="team">Team</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
              onClick={submitData}
            >
              Submit
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
}

export default SidebarAddUser

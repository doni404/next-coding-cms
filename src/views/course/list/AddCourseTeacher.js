// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormLabel from '@mui/material/FormLabel'
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormHelperText from "@mui/material/FormHelperText";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Icons Imports
import Close from "mdi-material-ui/Close";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Actions Imports
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { EyeOffOutline, EyeOutline } from "mdi-material-ui";

import axios from "axios";
import { addCoursesTeacher } from "src/store/apps/course_teacher";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field}は入力必須項目です。`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${min}文字以上`;
  } else {
    return "";
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  teacher: yup.string().required("インストラクターの役割は入力必須項目です"),
});

const defaultValues = {
  teacher: "",
};

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const SidebarAddCourseTeacher = (props) => {
  console.log("props : ", props)
  const dataResponse = props.data
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [teacherData, setTeacherData] = useState([]);
  const [chargePoint, setChargePoint] = useState(null);
  const [priceHalfDay, setPriceHalfDay] = useState(null);
  const [priceFullDay, setPriceFullDay] = useState(null);
  const [priceTwoDay, setPriceTwoDay] = useState(null);
  const [priceThreeDay, setPriceThreeDay] = useState(null);
  const [priceFourDay, setPriceFourDay] = useState(null);
  const [type, setType] = useState(dataResponse.type);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");


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

  useEffect(() => {
    loadTeacherData();
  }, []);

  useEffect(() => {
    setType(dataResponse.type)
  }, [props]);

  const loadTeacherData = () => {
    const token = window.sessionStorage.getItem("token");
    axios
      .get(BASE_URL_API + "v1/cms/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("load teacher data: ", res);
        setTeacherData(res.data.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace("/401");
        }
      });
  };

  const onSubmit = (data) => {
    console.log("Data submit");
    
    var data = {
      course_id: dataResponse.id,
      circuit_id: dataResponse.id,
      charge_point: chargePoint ? chargePoint : 0,
      price_half_day: priceHalfDay,
      price_full_day: priceFullDay,
      price_two_day: priceTwoDay,
      price_three_day: priceThreeDay,
      price_four_day: priceFourDay,
      teacher_id: data.teacher,
    };

    console.log("Data submit : ", data);

    dispatch(addCoursesTeacher({ ...data }))
      .then(function (response) {
        if (!response.error) {
          setChargePoint("");
          toggle();
          reset();
          toast.success("インストラクターを登録しました。");
        } else {
          console.log(response.error);
          toast.error("インストラクターを登録しませんでした。");
        }
      })
      .catch(function (error) {
        console.log(error);
        toast.error("インストラクターを登録しませんでした。");
      });
  };

  const handleClose = () => {
    setChargePoint("");
    toggle();
    reset();
  };

  const onChangeNumberInput = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/; //this will admit letters and dashes
    if (value.match(regex) || value === "") {
      setError("");
      setChargePoint(value); // only set when successful
      // setValue('chargePoint', value, { shouldValidate: true })
    } else {
      setError("Forbidden character: %<>$'\"");
    }
  }

  const onChangeNumberInputHalf = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/; //this will admit letters and dashes
    if (value.match(regex) || value === "") {
      setError("");
      setPriceHalfDay(value); // only set when successful
    } else {
      setError("Forbidden character: %<>$'\"");
    }
  }

  const onChangeNumberInputFull = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/; //this will admit letters and dashes
    if (value.match(regex) || value === "") {
      setError("");
      setPriceFullDay(value); // only set when successful
    } else {
      setError("Forbidden character: %<>$'\"");
    }
  }

  const onChangeNumberInputTwo = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/; //this will admit letters and dashes
    if (value.match(regex) || value === "") {
      setError("");
      setPriceTwoDay(value); // only set when successful
    } else {
      setError("Forbidden character: %<>$'\"");
    }
  }

  const onChangeNumberInputThree = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/; //this will admit letters and dashes
    if (value.match(regex) || value === "") {
      setError("");
      setPriceThreeDay(value); // only set when successful
    } else {
      setError("Forbidden character: %<>$'\"");
    }
  }

  const onChangeNumberInputFour = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]+$/; //this will admit letters and dashes
    if (value.match(regex) || value === "") {
      console.log("exe four price", value)
      setError("");
      setPriceFourDay(value); // only set when successful
    } else {
      setError("Forbidden character: %<>$'\"");
    }
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 500 } } }}
    >
      <Header>
        <Typography variant="h6">インストラクター登録</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: "pointer" }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {type === "online" ? (
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="chargePoint"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={chargePoint}
                  label="チャージポイント"
                  onChange={onChangeNumberInput}
                  placeholder="チャージポイント"
                />
              )}
            />
          </FormControl> ) : null}

          {type === "offline" ? (<>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="priceHalfDay"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={priceHalfDay}
                  label="半日料金"
                  onChange={onChangeNumberInputHalf}
                  placeholder="半日料金"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="priceFullDay"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={priceFullDay}
                  label="一日料金"
                  onChange={onChangeNumberInputFull}
                  placeholder="一日料金"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="priceTwoDay"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={priceTwoDay}
                  label="2日分の料金"
                  onChange={onChangeNumberInputTwo}
                  placeholder="2日分の料金"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="priceThreeDay"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={priceThreeDay}
                  label="3日分の料金"
                  onChange={onChangeNumberInputThree}
                  placeholder="3日分の料金"
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="priceFourDay"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={priceFourDay}
                  label="4日分の料金"
                  onChange={onChangeNumberInputFour}
                  placeholder="4日分の料金"
                />
              )}
            />
          </FormControl> </>) : null}
          
          <FormControl required fullWidth sx={{ mb: 6 }}>
            <InputLabel id="teacher-select">インストラクター</InputLabel>
            <Controller
              name="teacher"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  fullWidth
                  label="インストラクター"
                  id="teacher"
                  value={value}
                  onChange={onChange}
                  inputProps={{ placeholder: "Select teacher" }}
                  error={Boolean(errors.teacher)}
                >
                  {teacherData.map(({ last_name, first_name, id }, index) => (
                    <MenuItem value={id}>{last_name} {first_name}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.teacher && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.teacher.message}
              </FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
            >
              登録
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              キャンセル
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddCourseTeacher;

// ** React Imports
import { useState } from "react";
import React from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// ** Store Imports
import { useDispatch } from 'react-redux'
import GuideImageListTable from './GuideImageListTable'

// ** Actions Imports
import { addGuideImage } from 'src/store/apps/guide_image' 


const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const GuideImage = ({ data, id }) => {
  // ** Hooks
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (e) => {
    console.log('onsubmit ')
    var request = {
      guide_id: parseInt(id),
      image: imgSrc,
      caption: e.caption,
      admin_created_id:  data.data.admin_created_id,
      admin_updated_id:  data.data.admin_created_id,
    }
    console.log(request)
    
    if (imgSrc != "") {
      dispatch(addGuideImage({ ...request }))
        .then(function (response) {
          console.log(response);
          if (!response.error) {
            setImgSrc("");
            toast.success("画像を登録しました。");
          } else {
            toast.error("画像を登録しませんでした。");
          }
        })
        .catch(function (error) {
          console.log(error);
          toast.error("画像を登録しませんでした。");
        });
      } else {
          toast.error("画像が空");
      }
  }
  const [imgSrc, setImgSrc] = useState("");
  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  }));
  const onChangeImage = (file) => {
    console.log(file)
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };
  const ImgStyled = styled("img")(({ theme }) => ({
    marginBottom: theme.spacing(3),
  }));

  return (
    <Box sx={{ p: 5, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
          ガイド画像
      </Typography>
      <Grid xs={12} md={6} sx={{ mt: 6, mb: 6 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 5 } }}>
            <Grid fullWidth container>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ pt: { xs: 4, sm: 2 }, pb: { xs: 4, sm: 2 } }}
              >
                <FormLabel>画像</FormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Grid fullWidth>
                  <ImgStyled
                    src={imgSrc}
                    alt="Guide Pic"
                    sx={{ maxWidth: "100%" }}
                  />
                </Grid>
                <ButtonStyled component="label" variant="outlined">
                  画像を選択
                  <input
                    hidden
                    type="file"
                    onChange={onChangeImage}
                    accept="image/png, image/jpeg"
                  />
                </ButtonStyled>
                <Typography sx={{ mt: 2 }} component="p" variant="caption">
                  画像はPNGまたはJPEGで、800k以内
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={3} sx={{ pt: 4, pb: 4 }}>
                <FormLabel>キャプション</FormLabel>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Controller
                  name="caption"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id="captionImg"
                      type="text"
                      fullWidth
                      value={value}
                      onChange={onChange}
                      placeholder="キャプション"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </FormControl>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 6 } }}>
            <Grid fullWidth container>
              <Grid item xs={12} sm={3} sx={{ pt: 4, pb: 4 }}></Grid>
              <Grid item xs={12} sm={9}>
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mr: 3 }}
                >
                  登録
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </form>
      </Grid>
      <GuideImageListTable guideId={id} />
    </Box>
  );
};

export default GuideImage;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch teacher
export const fetchData = createAsyncThunk("appTeacherVideo/fetchData", async  (id) => {
  const response = await axiosInstance.get(BASE_URL_API + "v1/cms/teacher-videos/teachers/" + id)
  console.log("video list  : ", response);

  return response.data;
});

// ** Add User
export const addTeacherVideo = createAsyncThunk("appTeacherVideo/addTeacherVideo", async (formData, { dispatch }) => {
    const response = await axiosInstance.post(BASE_URL_API + "v1/cms/teacher-videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }})
    dispatch(fetchData(formData.get("teacher_id")));

    return response.data;
  }
);

// ** Update User
export const updateTeacherVideo = createAsyncThunk("appTeacherVideo/updateTeacherVideo", async ({id, formData}, { dispatch }) => {
  const response = await axiosInstance.put(BASE_URL_API + "v1/cms/teacher-videos/" + id, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }})
  dispatch(fetchData(formData.get("teacher_id")));

  return response.data;
}
);

export const deleteTeacherVideo = createAsyncThunk("appTeacherVideo/deleteTeacherVideo", async (data, { dispatch }) => {
    console.log("data : ", data);
    const response = await axiosInstance.delete(BASE_URL_API + "v1/cms/teacher-videos/"+ data.id + "/permanent");
    dispatch(fetchData(data.teacher_id));

    return response.data;
  }
);

export const appTeacherVideoSlice = createSlice({
  name: "appTeacherVideo",
  initialState: {
    data: [],
    code: 200,
    message: "",
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
      state.status = action.payload.status;
    }).addCase(fetchData.rejected, (state, action) => {
      console.log(action)
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    });
  },
});

export default appTeacherVideoSlice.reducer;

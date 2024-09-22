import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch teacher
export const fetchData = createAsyncThunk("appTeacher/fetchData", async (params) => {
  const data = new URLSearchParams(params).toString();
  const endpoint = BASE_URL_API + "v1/cms/teachers?sort_by=created_at.desc" + (data ? `&${data}` : "");
  const response = await axiosInstance.get(endpoint);
  console.log("teacher : ", response.data);
  return response.data;
});

// ** Add Teacher
export const addTeacher = createAsyncThunk("appTeacher/addTeacher", async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(BASE_URL_API + "v1/cms/teachers",data);
    dispatch(fetchData());
    console.log("data ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in add Teacher:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

 // ** Update Student
  export const updateTeacher = createAsyncThunk("appStudent/updateTeacher",async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
     const response = await axiosInstance.put(BASE_URL_API + "v1/cms/teachers/"+ id, data);
     console.log("update res teacher : ",response.data);
     return response.data;
    } catch (error) {
      console.error("Error in updateTeacher:", error);
      // If there's an error, reject the promise with the error object
      return rejectWithValue(error);
     }
  });
  

// ** Delete Teacher
export const deleteTeacher = createAsyncThunk("appTeacher/deleteTeacher", async (id, { dispatch }) => {
    const response = await axiosInstance.delete(BASE_URL_API + "v1/cms/teachers/" + id);
    dispatch(fetchData());

    return response.data;
  }
);

export const appTeacherSlice = createSlice({
  name: "appTeacher",
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

export default appTeacherSlice.reducer;

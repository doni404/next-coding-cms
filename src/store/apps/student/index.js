import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tr } from 'date-fns/locale';

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Student
export const fetchData = createAsyncThunk('appStudent/fetchData', async params => {
  const data = new URLSearchParams(params).toString();
  const endpoint = BASE_URL_API + 'v1/cms/students?sort_by=created_at.desc' + (data ? `&${data}` : '')
  // console.log('endpoint ', endpoint)
  const response = await axiosInstance.get(endpoint)
  console.log("fetch res student : ", response.data)
  return response.data
})

// ** Add Student


export const addStudent = createAsyncThunk("appStudent/addStudent", async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(BASE_URL_API + "v1/cms/students", data);
    dispatch(fetchData());
    console.log("add res student:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in addStudent:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

// ** Update Student
export const updateStudent = createAsyncThunk("appStudent/updateStudent",async ({ id, formData }, { dispatch, rejectWithValue }) => {
  try {
  const response = await axiosInstance.put(BASE_URL_API + "v1/cms/students/"+ id, formData);
  console.log("update res student : ",response.data);
  return response.data;
  } catch (error) {
    console.error("Error in updateStudent:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

// ** Delete Student
export const deleteStudent = createAsyncThunk("appStudent/deleteStudent", async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + "v1/cms/students/" + id);
  dispatch(fetchData());
  return response.data;
  }
);

export const appStudentSlice = createSlice({
  name: 'appStudent',
  initialState: {
    data: [],
    code: 200,
    message: "",
    status: ""
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      console.log("action.payload.data", action)
      state.data = action.payload.data
      state.code = action.payload.code
      state.message = action.payload.message
      state.status = action.payload.status
    }).addCase(fetchData.rejected, (state, action) => {
      console.log("action.error", action)
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    });
  }
})

export default appStudentSlice.reducer

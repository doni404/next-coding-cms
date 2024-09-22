import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch News
export const fetchData = createAsyncThunk('appVideoNews/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/video-news')
  console.log('response ', response)
  return response.data
})

// ** Add User
export const addVideoNews = createAsyncThunk('appVideoNews/addVideoNews', async (data, { dispatch }) => {
  console.log('data ',data)
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/video-news', data)
  dispatch(fetchData())

  return response.data
})

// ** Update News
export const updateVideoNews = createAsyncThunk("appVideoNews/updateVideoNews",async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
  const response = await axiosInstance.put(BASE_URL_API + "v1/cms/video-news/"+ id, data);
  console.log("update res video news : ",response.data);
  return response.data;
  } catch (error) {
    console.error("Error in updateVideoNews:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

// ** Update Patch News
export const updateContentVideoNews = createAsyncThunk("appVideoNews/updateContentVideoNews",async ({ id, dataContent }, { dispatch, rejectWithValue }) => {
  console.log("update : ", dataContent)
  try {
  const response = await axiosInstance.patch(BASE_URL_API + "v1/cms/video-news/" + id + "/content", dataContent);
  console.log("update res content video news : ",response.data);
  return response.data;
  } catch (error) {
    console.error("Error in updateContentVideoNews:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

export const deleteVideoNews = createAsyncThunk('appVideoNews/deleteVideoNews', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/video-news/'+id)
  dispatch(fetchData())

  return response.data
})

export const appVideoNewsSlice = createSlice({
  name: 'appVideoNews',
  initialState: {
    data: [],
    code: 200,
    message: "",
    status: ""
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.code = action.payload.code
      state.message = action.payload.message
      state.status = action.payload.status
    }).addCase(fetchData.rejected, (state, action) => {
      console.log(action)
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    })
  }
})

export default appVideoNewsSlice.reducer

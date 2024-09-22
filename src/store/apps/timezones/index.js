import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Student
export const fetchData = createAsyncThunk('appTimezones/fetchData', async params => {
  const endpoint = BASE_URL_API + 'v1/cms/timezones?sort_by=id.asc'
  // console.log('endpoint ', endpoint)
  const response = await axiosInstance.get(endpoint)
  console.log("fetch timezones : ", response.data)
  return response.data
})

export const appTimezonesSlice = createSlice({
  name: 'appTimezones',
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
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    });
  }
})

export default appTimezonesSlice.reducer

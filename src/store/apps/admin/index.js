import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"
export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Users
export const fetchData = createAsyncThunk('appAdmins/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/admins')
  console.log(response.data)
  return response.data
})

// ** Add Admin
export const addAdmin = createAsyncThunk('appAdmin/addAdmin', async (data, { dispatch }) => {
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/admins', data)
  dispatch(fetchData())

  return response.data
})

// // ** Delete Admin
export const deleteAdmin = createAsyncThunk('appAdmin/deleteAdmin', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/admins/'+id)
  dispatch(fetchData())

  return response.data
})

export const appAdminSlice = createSlice({
  name: 'appAdmin',
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
    });
  }
})

export default appAdminSlice.reducer

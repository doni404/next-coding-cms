import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"
export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Users
export const fetchData = createAsyncThunk('appAdminRole/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/admin-roles')
  console.log(response.data)
  return response.data
})

// ** Add Admin
export const addAdminRole = createAsyncThunk('appAdminRole/addAdminRole', async (data, { dispatch }) => {
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/admin-roles', data)
  dispatch(fetchData())

  return response.data
})

// // ** Delete Admin
export const deleteAdminRole = createAsyncThunk('appAdminRole/deleteAdminRole', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/admin-roles/'+id)
  dispatch(fetchData())

  return response.data
})

export const appAdminRolesSlice = createSlice({
  name: 'appAdminRole',
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

export default appAdminRolesSlice.reducer

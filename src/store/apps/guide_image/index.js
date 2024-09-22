import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Guide
export const fetchData = createAsyncThunk('appGuideImage/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  console.log(params)
  const response = await axios.get(BASE_URL_API + 'v1/guides_image/guides/'+params, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log(response.data)
  return response.data
})

// ** Add User
export const addGuideImage = createAsyncThunk('appGuideImage/addGuideImage', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` },
  };
  console.log('data ',data)
  const response = await axios.post(BASE_URL_API + 'v1/guides_image',
    data,
    header)
  dispatch(fetchData(data.guide_id))

  return response.data
})


export const deleteGuideImage = createAsyncThunk('appGuideImage/deleteGuideImage', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.delete(BASE_URL_API + 'v1/guides_image/'+data.id,header)
  dispatch(fetchData(data.guide_id))

  return response.data
})


export const updateGuideImage = createAsyncThunk('appGuideImage/updateGuideImage', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const request = {
    "guide_id": data.guide_id,
    "image": data.image,
    "caption": data.caption,
    "admin_created_id": data.admin_created_id,
    "admin_updated_id": data.admin_updated_id
  }

  const response = await axios.put(BASE_URL_API + 'v1/guides_image/'+data.id,request,header)
  dispatch(fetchData(data.guide_id))

  return response.data
})

export const appGuideImageSlice = createSlice({
  name: 'appGuideImage',
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
    })
  }
})

export default appGuideImageSlice.reducer

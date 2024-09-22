import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch News
export const fetchData = createAsyncThunk('appGuideCategories/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  const response = await axios.get(BASE_URL_API + 'v1/guide_categories', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log('response ', response)
  return response.data
})

// ** Add User
export const addGuideCategories = createAsyncThunk('appGuideCategories/addGuideCategories', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` },
  };
  console.log('data ',data)
  const response = await axios.post(BASE_URL_API + 'v1/guide_categories',
    data,
    header)
  dispatch(fetchData())

  return response.data
})

export const deleteGuideCategories = createAsyncThunk('appGuideCategories/deleteGuideCategories', async (id, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.delete(BASE_URL_API + 'v1/guide_categories/'+id,header)
  dispatch(fetchData())

  return response.data
})

export const appGuideCategoriesSlice = createSlice({
  name: 'appGuideCategories',
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

export default appGuideCategoriesSlice.reducer

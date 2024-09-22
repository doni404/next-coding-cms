import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch guide
export const fetchData = createAsyncThunk('appDashboard/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  const response = await axios.get(BASE_URL_API + 'v1/cms/analytics/resources', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log('response dashboard : ', response)
  return response.data
})

export const appDashboardSlice = createSlice({
  name: 'appGuide',
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

export default appDashboardSlice.reducer

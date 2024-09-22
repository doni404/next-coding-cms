import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Mail Sends
export const fetchData = createAsyncThunk('appMailSend/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  const response = await axios.get(BASE_URL_API + 'v1/mail_sends', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log('response ', response)
  return response.data
})

// ** Add Mail Send
export const addMailSend = createAsyncThunk('appMailSend/addMailSend', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` },
  };
  console.log('data ',data)
  const response = await axios.post(BASE_URL_API + 'v1/mail_sends',
    data,
    header)
  dispatch(fetchData())

  return response.data
})


export const deleteMailSend = createAsyncThunk('appMailSend/deleteMailSend', async (id, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.delete(BASE_URL_API + 'v1/mail_sends/'+id,header)
  dispatch(fetchData())

  return response.data
})

export const appMailSendSlice = createSlice({
  name: 'appMailSend',
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

export default appMailSendSlice.reducer

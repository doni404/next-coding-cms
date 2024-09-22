import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch category
export const fetchData = createAsyncThunk('appStudentPointHistory/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  const response = await axios.get(BASE_URL_API + 'v1/cms/student-point-transactions/students/' + params + '?sort_by=id.desc', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log('response ', response)
  return response.data
})

// ** Add point history
export const addStudentPointHistory = createAsyncThunk('appStudentPointHistory/addStudentPointHistory', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` },
  };
  console.log('data ',data)
  const response = await axios.post(BASE_URL_API + 'v1/cms/student-point-transactions/adjust',
    data,
    header)
  dispatch(fetchData(data.student_id))

  return response.data
})

export const updateStudentPointHistory = createAsyncThunk('appStudentPointHistory/updateStudentPointHistory', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const request = {
    "note": data.note,
  }

  const response = await axios.patch(BASE_URL_API + 'v1/cms/student-point-transactions/'+ data.id +'/note' , request, header)
  dispatch(fetchData(data.student_id))

  return response.data
})

export const appStudentPointHistorySlice = createSlice({
  name: 'appStudentPointHistory',
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

export default appStudentPointHistorySlice.reducer

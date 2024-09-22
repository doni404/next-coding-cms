import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch
export const fetchData = createAsyncThunk('appTeacherLesson/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  const response = await axios.get(BASE_URL_API + 'v1/cms/reservations/teachers/' + params + '?situation=reserved,student_request_approved,cancelled_student,cancelled_admin,course_finished', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log('response ', response)
  return response.data
})

export const appTeacherLessonSlice = createSlice({
  name: 'appTeacherLesson',
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

export default appTeacherLessonSlice.reducer

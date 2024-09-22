import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch student certificate
export const fetchData = createAsyncThunk('appStudentCertificates/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/student-certificates/students/' + params)
  console.log('response certificate : ', response)
  return response.data
})

// ** Add student certificate
export const addStudentCertificates = createAsyncThunk('appStudentCertificates/addStudentCertificates', async (data, { dispatch }) => {
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/student-certificates', data)
  dispatch(fetchData(data.student_id))

  return response.data
})

// ** Update student certificate
export const updateStudentCertificates = createAsyncThunk('appStudentCertificates/updateStudentCertificates', async (data, { dispatch }) => {
  const request = {
    "note": data.note,
  }

  const response = await axiosInstance.patch(BASE_URL_API + 'v1/cms/student-certificates/'+ data.id +'/note' , request)
  dispatch(fetchData(data.student_id))

  return response.data
})

export const appStudentCertificatesSlice = createSlice({
  name: 'appStudentCertificates',
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

export default appStudentCertificatesSlice.reducer

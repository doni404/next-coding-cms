import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch category
export const fetchData = createAsyncThunk('appMailTemplate/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/mail-templates')
  console.log('response mail', response)
  return response.data
})

// ** Add course
export const addMailTemplate = createAsyncThunk('appMailTemplate/addMailTemplate', async (data, { dispatch }) => {
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/mail-templates', data)
  console.log('data response add',response)
  dispatch(fetchData())

  return response.data
})

export const updateMailTemplate = createAsyncThunk("appMailTemplate/updateMailTemplate",async ({ id, formData }, { dispatch, rejectWithValue }) => {
  try {
  const response = await axiosInstance.put(BASE_URL_API + "v1/cms/mail-templates/"+ id, formData);
  return response.data;
  } catch (error) {
    console.error("Error in updateStudent:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});


export const deleteMailTemplate = createAsyncThunk('appMailTemplate/deleteMailTemplate', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/mail-templates/'+id)
  console.log('data response delete',response)
  dispatch(fetchData())

  return response.data
})

export const appMailTemplateSlice = createSlice({
  name: 'appMailTemplate',
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

export default appMailTemplateSlice.reducer

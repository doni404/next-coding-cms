import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch News
export const fetchData = createAsyncThunk('appFaqs/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/faqs')
  console.log('response ', response)
  return response.data
})

// ** Add faq
export const addFaqs = createAsyncThunk('appFaqs/addFaqs', async (data, { dispatch }) => {
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/faqs', data)
  console.log('response faq : ',response)
  dispatch(fetchData())

  return response.data
})

// ** Update faq
export const updateFaqs = createAsyncThunk("appFaqs/updateFaqs",async ({ id, formData }, { dispatch, rejectWithValue }) => {
  try {
  const response = await axiosInstance.put(BASE_URL_API + "v1/cms/faqs/"+ id, formData);
  return response.data;
  } catch (error) {
    console.error("Error in updateFaqs:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

export const deleteFaqs = createAsyncThunk('appFaqs/deleteFaqs', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/faqs/'+id)
  dispatch(fetchData())

  return response.data
})

export const appFaqsSlice = createSlice({
  name: 'appFaqs',
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

export default appFaqsSlice.reducer

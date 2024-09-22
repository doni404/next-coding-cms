import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch faq category
export const fetchData = createAsyncThunk('appFaqsCategory/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/faq-categories')
  console.log('response ', response)
  return response.data
})

// ** Add faq category
export const addFaqsCategory = createAsyncThunk('appFaqsCategory/addFaqsCategory', async (data, { dispatch }) => {
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/faq-categories', data)
  dispatch(fetchData())

  return response.data
})

// ** Update faq category
export const updateFaqsCategory = createAsyncThunk("appFaqsCategory/updateFaqsCategory",async ({ id, formData }, { dispatch, rejectWithValue }) => {
  try {
  const response = await axiosInstance.put(BASE_URL_API + "v1/cms/faq-categories/"+ id, formData);
  return response.data;
  } catch (error) {
    console.error("Error in updateFaqsCategory:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});


export const deleteFaqsCategory = createAsyncThunk('appFaqsCategory/deleteFaqsCategory', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/faq-categories/'+id)
  dispatch(fetchData())

  return response.data
})

export const appFaqsCategorySlice = createSlice({
  name: 'appFaqsCategory',
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

export default appFaqsCategorySlice.reducer

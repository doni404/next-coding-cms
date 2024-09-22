import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// **import axios */
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch News
export const fetchData = createAsyncThunk('appVideoNewsMedia/fetchData', async params => {
  const response = await axiosInstance.get(BASE_URL_API + 'v1/cms/video-news-media/video-news/'+params)
  console.log(response.data)
  return response.data
})

// ** Add User
export const addVideoNewsMedia = createAsyncThunk('appVideoNewsMedia/addVideoNewsMedia', async (data, { dispatch }) => {
  console.log('data ',data)
  const response = await axiosInstance.post(BASE_URL_API + 'v1/cms/video-news-media',data)
  dispatch(fetchData(data.news_id))

  return response.data
})

export const deleteVideoNewsMedia = createAsyncThunk('appVideoNewsMedia/deleteVideoNewsMedia', async (data, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/video-news-media/'+data.id+'/permanent')
  dispatch(fetchData(data.news_id))

  return response.data
})

export const updateVideoNewsMedia = createAsyncThunk('appVideoNewsMedia/updateVideoNewsMedia', async (data, { dispatch }) => {
  console.log("update id : ", data.id)
  console.log("update video news id : ", data.news_id)
  const request = {
    "caption": data.caption,
  }

  const response = await axiosInstance.patch(BASE_URL_API + 'v1/cms/video-news-media/'+data.id+'/caption', request)
  dispatch(fetchData(data.news_id))

  return response.data
})

export const appVideoNewsMediaSlice = createSlice({
  name: 'appVideoNewsMedia',
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

export default appVideoNewsMediaSlice.reducer

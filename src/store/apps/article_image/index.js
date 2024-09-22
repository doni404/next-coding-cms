import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Article
export const fetchData = createAsyncThunk('appArticleImage/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  console.log(params)
  const response = await axios.get(BASE_URL_API + 'v1/articles_image/articles/'+params, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log(response.data)
  return response.data
})

// ** Add User
export const addArticleImage = createAsyncThunk('appArticleImage/addArticleImage', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` },
  };
  console.log('data ',data)
  const response = await axios.post(BASE_URL_API + 'v1/articles_image',
    data,
    header)
  dispatch(fetchData(data.article_id))

  return response.data
})


export const deleteArticleImage = createAsyncThunk('appArticleImage/deleteArticleImage', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.delete(BASE_URL_API + 'v1/articles_image/'+data.id,header)
  dispatch(fetchData(data.article_id))

  return response.data
})


export const updateArticleImage = createAsyncThunk('appArticleImage/updateArticleImage', async (data, { dispatch }) => {
  const token = window.sessionStorage.getItem('token')
  const header = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const request = {
    "article_id": data.article_id,
    "image": data.image,
    "caption": data.caption,
    "admin_created_id": data.admin_created_id,
    "admin_updated_id": data.admin_updated_id
  }

  const response = await axios.put(BASE_URL_API + 'v1/articles_image/'+data.id,request,header)
  dispatch(fetchData(data.article_id))

  return response.data
})

export const appArticleImageSlice = createSlice({
  name: 'appArticleImage',
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
    });
  }
})

export default appArticleImageSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { combineReducers } from '@reduxjs/toolkit';
export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Article
export const fetchData = createAsyncThunk("appArticle/fetchData", async (params) => {
  const token = window.sessionStorage.getItem("token");
  const response = await axios.get(BASE_URL_API + "v1/articles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
});

export const fetchDataBySeries = createAsyncThunk("appArticleBySeries/fetchDataBySeries", async (params) => {
  const token = window.sessionStorage.getItem("token");
  const response = await axios.get(BASE_URL_API + "v1/articles/series/" + params, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("response article by series : ",response.data);
  return response.data;
});

// ** Add Article
export const addArticle = createAsyncThunk(
  "appArticle/addArticle",
  async (data, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(
      BASE_URL_API + "v1/articles",
      data,
      header
    );
    dispatch(fetchData());

    return response.data;
  }
);

// // ** Delete Article
export const deleteArticle = createAsyncThunk(
  "appArticle/deleteArticle",
  async (id, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(
      BASE_URL_API + "v1/articles/" + id,
      header
    );
    dispatch(fetchData());

    return response.data;
  }
);

export const appArticleSlice = createSlice({
  name: "appArticle",
  initialState: {
    data: [],
    code: 200,
    message: "",
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
      state.status = action.payload.status;
    }).addCase(fetchData.rejected, (state, action) => {
      console.log(action)
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    });
  },
});

export const appArticleBySeriesSlice = createSlice({
  name: "appArticleBySeries",
  initialState: {
    data: [],
    code: 200,
    message: "",
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDataBySeries.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
      state.status = action.payload.status;
    }).addCase(fetchDataBySeries.rejected, (state, action) => {
      console.log(action)
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    });
  },
});

export default combineReducers({
  article: appArticleSlice.reducer,
  articleBySeries: appArticleBySeriesSlice.reducer
});

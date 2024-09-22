import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Notification Message
export const fetchMessage = createAsyncThunk(
  "appNotification/fetchMessage",
  async (params) => {
    const token = window.sessionStorage.getItem("token");
    const response = await axios.get(
      BASE_URL_API + "v1/messages",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// ** Fetch Notification Magazine
export const fetchMagazine = createAsyncThunk(
  "appNotification/fetchMagazine",
  async (params) => {
    const token = window.sessionStorage.getItem("token");
    const response = await axios.get(BASE_URL_API + "v1/news", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  }
);

// // ** Delete Notification Message
export const deleteMessage = createAsyncThunk(
  "appNotification/deleteMessage",
  async (id, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(
      BASE_URL_API + "v1/collections/" + id,
      header
    );
    dispatch(fetchData());

    return response.data;
  }
);

export const appNotificationSlice = createSlice({
  name: "appNotification",
  initialState: {
    data: [],
    code: 200,
    message: "",
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessage.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
      state.status = action.payload.status;
    });
    builder.addCase(fetchMagazine.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
      state.status = action.payload.status;
    });
  },
});

export default appNotificationSlice.reducer;

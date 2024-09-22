import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Item
export const fetchData = createAsyncThunk("appReservation/fetchData", async (params) => {
  const token = window.sessionStorage.getItem("token");
  const response = await axios.get(BASE_URL_API + "v1/cms/reservations/teachers?date=" + params, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  console.log("store log : ", response.data);
  return response.data;
});

// // ** Delete Item
export const deleteItem = createAsyncThunk(
  "appReservation/deleteItem",
  async (id, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(
      BASE_URL_API + "v1/assets/" + id,
      header
    );
    dispatch(fetchData());

    return response.data;
  }
);

export const appReservationSlice = createSlice({
  name: "appReservation",
  initialState: {
    data: [],
    code: 200,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      console.log("action payload : ",action.payload.data)
      state.data = action.payload.data;
      state.code = action.payload.code;
      state.message = action.payload.message;
    }).addCase(fetchData.rejected, (state, action) => {
      console.log(action)
      state.code= action.error.code
      state.name = action.error.name
      state.message = action.error.message
    });
  },
});

export default appReservationSlice.reducer;

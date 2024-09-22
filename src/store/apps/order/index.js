import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Order
export const fetchData = createAsyncThunk("appOrder/fetchData", async (params) => {
  const token = window.sessionStorage.getItem("token");
  const response = await axios.get(BASE_URL_API + "v1/nft_sales", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
});

// ** Delete Order
export const deleteOrder = createAsyncThunk(
  "appOrder/deleteOrder",
  async (id, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(
      BASE_URL_API + "v1/nft_sales/" + id,
      header
    );
    dispatch(fetchData());

    return response.data;
  }
);

export const appOrderSlice = createSlice({
  name: "appOrder",
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
    });
  },
});

export default appOrderSlice.reducer;

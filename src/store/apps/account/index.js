import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch Account
export const fetchData = createAsyncThunk('appAccount/fetchData', async params => {
  const token = window.sessionStorage.getItem('token')
  const response = await axios.get(BASE_URL_API + 'v1/accounts', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  console.log(response.data)
  return response.data
})

// ** Add Account
export const addAccount = createAsyncThunk("appAccount/addAccount",async (data, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log("data is", data)
    const response = await axios.post(
      BASE_URL_API + "v1/accounts",
      data,
      header
    );
    dispatch(fetchData());

    console.log("response",response.data);
    return response.data;
  }
);

// // ** Delete Account
export const deleteAccount = createAsyncThunk(
  "appAccount/deleteAccount",
  async (id, { dispatch }) => {
    const token = window.sessionStorage.getItem("token");
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(
      BASE_URL_API + "v1/accounts/" + id,
      header
    );
    dispatch(fetchData());

    return response.data;
  }
);

export const appAccountSlice = createSlice({
  name: 'appAccount',
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
    });
  }
})

export default appAccountSlice.reducer

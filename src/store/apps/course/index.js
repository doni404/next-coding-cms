import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosInstance from "src/helper/axiosInstance"

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Fetch course
export const fetchData = createAsyncThunk("appCourses/fetchData", async (params) => {
  const data = new URLSearchParams(params).toString();
  const endpoint = BASE_URL_API + "v1/cms/courses?sort_by=created_at.asc" + (data ? `&${data}` : "");
  const response = await axiosInstance.get(endpoint);
  console.log("course : ", response.data);
  return response.data;
});

// ** Add courses
export const addCourses = createAsyncThunk("appCourses/addCourse", async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(BASE_URL_API + "v1/cms/courses", data);
    dispatch(fetchData());
    console.log("add res courses:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in addCourses:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
  }
});

 // ** Update courses
 export const updateCourses = createAsyncThunk("appStudent/updateCourses",async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
   const response = await axiosInstance.put(BASE_URL_API + "v1/cms/courses/"+ id, data);
   console.log("update res courses : ",response.data);
   return response.data;
  } catch (error) {
    console.error("Error in updateCourses:", error);
    // If there's an error, reject the promise with the error object
    return rejectWithValue(error);
   }
});


export const deleteCourses = createAsyncThunk('appCourses/deleteCourses', async (id, { dispatch }) => {
  const response = await axiosInstance.delete(BASE_URL_API + 'v1/cms/courses/'+id)
  dispatch(fetchData())

  return response.data
})

export const appCoursesSlice = createSlice({
  name: 'appCourses',
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

export default appCoursesSlice.reducer

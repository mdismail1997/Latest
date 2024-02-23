import { fetchSignup } from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toasterr, toastr } from "../../utils/commonToast";
import authService from "../../api/auth";


export const forgetPasswordData = createAsyncThunk(
  "student/forgetPasswordData",
  async (data) => {
    try {
      const responseData= await authService.ForgetPassword(data);
      console.log("signup success",responseData.data);
      if (responseData.status === 200) {
        toastr.showToast(responseData.data.message);
      } else {
        toasterr.showToast(responseData.message);
      }

      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log("signup error",error.response.data.message);

      throw error;
    }
  }
);

const initialState = {
  forgetpassworddata: null,
  loading: false,
  error: null,
};

const forgetPasswordSlice = createSlice({
  name: "studentsignup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgetPasswordData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPasswordData.fulfilled, (state, action) => {
        state.loading = false;
        state.forgetpassworddata = action.payload || null;
      })
      .addCase(forgetPasswordData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred.";
      });
  },
});

export default forgetPasswordSlice.reducer;

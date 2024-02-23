import {fetchSignup} from '@/services/api';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../utils/commonToast';
import authService from '../../api/auth';

export const changePasswordData = createAsyncThunk(
  'student/changePasswordData',
  async data => {
    try {
      const responseData = await authService.ChangePassword(data);
      //console.log("signup success",responseData.data);
      if (responseData.status === 200) {
        toastr.showToast(responseData.data.message);
      } else {
        toasterr.showToast(responseData.message);
      }

      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      //console.log("signup error",error.response.data.message);

      throw error;
    }
  },
);

const initialState = {
  changepassworddata: null,
  loading: false,
  error: null,
};

const changePasswordSlice = createSlice({
  name: 'studentsignup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(changePasswordData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordData.fulfilled, (state, action) => {
        state.loading = false;
        state.changepassworddata = action.payload || null;
      })
      .addCase(changePasswordData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default changePasswordSlice.reducer;

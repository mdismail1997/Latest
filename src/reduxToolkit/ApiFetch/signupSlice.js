import {fetchSignup} from '@/services/api';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../utils/commonToast';
import authService from '../../api/auth';

export const signupData = createAsyncThunk('student/signupData', async data => {
  try {
    const responseData = await authService.Register(data);
    //console.log("signup success",responseData.data);
    if (responseData.status === 200) {
      toastr.showToast(responseData.data.message);
    } else {
      toasterr.showToast(responseData.message);
    }

    return responseData.data;
  } catch (error) {
    toasterr.showToast(error.response.data.message);
    console.log('signup error', error.response.data.message);

    throw error;
  }
});

const initialState = {
  registrationData: null,
  loading: false,
  error: null,
};

const signupSlice = createSlice({
  name: 'studentsignup',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(signupData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupData.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationData = action.payload || null;
      })
      .addCase(signupData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default signupSlice.reducer;

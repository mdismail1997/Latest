import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import authService from '../../api/auth';
import {toasterr, toastr} from '../../utils/commonToast';

export const loginData = createAsyncThunk('student/loginData', async data => {
  try {
    const responseData = await authService.Login(data);
    console.log('login success', responseData.data);
    if (responseData.status === 200) {
      console.log('===token====>', responseData.data.token);
      toastr.showToast(responseData.data.message);
    } else {
      toasterr.showToast(responseData.message);
    }
    return responseData.data;
  } catch (error) {
    toasterr.showToast(error.response.data.message);
    console.log('login error', error.response.data.message);

    throw error;
  }
});

const initialState = {
  loginData: null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'studentlogin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginData.fulfilled, (state, action) => {
        //  console.log("reducer from admin login slice example", action);
        state.loading = false;
        state.loginData = action.payload;
      })
      .addCase(loginData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default loginSlice.reducer;

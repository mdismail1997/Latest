import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const checkoutData = createAsyncThunk(
  'checkout/checkoutData',
  async data => {
    try {
      const responseData = await authService.checkout(data);
      console.log('checkout success', responseData.data);

      return responseData.data;
    } catch (error) {
      //   toasterr.showToast(error.response.data.message);
      console.log('checkout error', error.response.data.message);

      throw error;
    }
  },
);

const initialState = {
  checkoutData: null,
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(checkoutData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutData.fulfilled, (state, action) => {
        //  console.log("reducer from admin checkout slice example", action);
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(checkoutData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default checkoutSlice.reducer;

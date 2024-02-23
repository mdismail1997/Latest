// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  cartItemdata: null,
  loading: false,
  error: null,
};

export const getcartItemdata = createAsyncThunk(
  'api/getcartItemdata',
  async () => {
    try {
      const responseData = await authService.getCartItem();
      console.log('get cartItem success', responseData.data);
      // if (responseData.status === true) {
      //   console.log('===token====>', responseData.data.token);
      //   toastr.showToast(responseData.data.message);
      // } else {
      //   if (responseData.data.message == 'User not found') {
      //     toasterr.showToast(
      //       'For further processing, please log in or register',
      //     );
      //   } else {
      //     toasterr.showToast(responseData.data.message);
      //   }
      // }
      return responseData.data;
    } catch (error) {
      // toasterr.showToast(error.response.data.message);
      console.log('cartItem error', error.response);

      throw error;
    }
  },
);

const cartItemSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getcartItemdata.pending, state => {
        state.loading = true;
      })
      .addCase(getcartItemdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.cartItemdata = action.payload;
        state.error = null;
      })
      .addCase(getcartItemdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default cartItemSlice.reducer;

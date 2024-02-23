import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const cartItemData = createAsyncThunk(
  'cart/cartItemData',
  async ({id, quantity}) => {
    try {
      const responseData = await authService.cartItem(id, quantity);
      console.log(
        'cartItem success',
        Object.values(responseData.data.notices)[0][0],
      );

      if (responseData.data.message == 'User not found') {
        toasterr.showToast('For further processing, please log in or register');
      } else {
        toastr.showToast(Object.values(responseData.data.notices)[0][0]);
      }

      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('cartItem error', error.response);

      throw error;
    }
  },
);

const initialState = {
  cartItemData: null,
  loading: false,
  error: null,
};

const cartItemSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(cartItemData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cartItemData.fulfilled, (state, action) => {
        //  console.log("reducer from admin cartItem slice example", action);
        state.loading = false;
        state.cartItemData = action.payload;
      })
      .addCase(cartItemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default cartItemSlice.reducer;

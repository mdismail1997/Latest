import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const updateCartData = createAsyncThunk(
  'updateCart/updateCartData',
  async ({item_key, quantity}) => {
    try {
      const responseData = await authService.updateCartItem(item_key, quantity);
      console.log('updateCart success', responseData.data);
      if (responseData.status === true) {
        console.log('===token====>', responseData.data);
        toastr.showToast(responseData.data.message);
      } else {
        if (responseData.data.message == 'User not found') {
          toasterr.showToast(
            'For further processing, please log in or register',
          );
        } else {
          // toasterr.showToast(responseData.data.message);
        }
      }
      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('updateCart error', error.response);

      throw error;
    }
  },
);

const initialState = {
  updateCartData: null,
  loading: false,
  error: null,
};

const updateCartSlice = createSlice({
  name: 'updateCart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateCartData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartData.fulfilled, (state, action) => {
        //  console.log("reducer from admin updateCart slice example", action);
        state.loading = false;
        state.updateCartData = action.payload;
      })
      .addCase(updateCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default updateCartSlice.reducer;

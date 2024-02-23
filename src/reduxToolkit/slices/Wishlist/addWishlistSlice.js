import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const WishlistItemData = createAsyncThunk(
  'Wishlist/WishlistItemData',
  async ({id}) => {
    try {
      const responseData = await authService.addWishlist(id);
      console.log('WishlistItem success', responseData.status);

      if (responseData.data.message == 'User not found') {
        toasterr.showToast('For further processing, please log in or register');
      } else {
        toastr.showToast(responseData.data.message);
      }

      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('WishlistItem error', error.response);

      throw error;
    }
  },
);

const initialState = {
  wishlistItemData: null,
  loading: false,
  error: null,
};

const WishlistItemSlice = createSlice({
  name: 'Wishlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(WishlistItemData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(WishlistItemData.fulfilled, (state, action) => {
        //  console.log("reducer from admin WishlistItem slice example", action);
        state.loading = false;
        state.wishlistItemData = action.payload;
      })
      .addCase(WishlistItemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default WishlistItemSlice.reducer;

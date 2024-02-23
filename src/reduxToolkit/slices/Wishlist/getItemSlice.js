// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  wishlistItemdata: null,
  loading: false,
  error: null,
};

export const getWishlistItemdata = createAsyncThunk(
  'api/getWishlistItemdata',
  async () => {
    try {
      const responseData = await authService.getWishlist();
      console.log('get WishlistItem success', responseData.data);
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
      console.log('WishlistItem error', error.response);

      throw error;
    }
  },
);

const WishlistItemSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getWishlistItemdata.pending, state => {
        state.loading = true;
      })
      .addCase(getWishlistItemdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.wishlistItemdata = action.payload;
        state.error = null;
      })
      .addCase(getWishlistItemdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default WishlistItemSlice.reducer;

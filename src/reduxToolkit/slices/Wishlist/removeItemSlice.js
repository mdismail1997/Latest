import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const removeItemData = createAsyncThunk(
  'remove/removeItemData',
  async ({id}) => {
    try {
      const responseData = await authService.removeItemWishlist(id);
      console.log('removeItem success', responseData.data);

      if (responseData.data.message == 'User not found') {
        toasterr.showToast('For further processing, please log in or register');
      } else {
        toastr.showToast(responseData.data.message);
      }

      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('removeItem error', error.response);

      throw error;
    }
  },
);

const initialState = {
  removeData: null,
  loading: false,
  error: null,
};

const removeItemSlice = createSlice({
  name: 'remove',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(removeItemData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemData.fulfilled, (state, action) => {
        //  console.log("reducer from admin removeItem slice example", action);
        state.loading = false;
        state.removeData = action.payload;
      })
      .addCase(removeItemData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default removeItemSlice.reducer;

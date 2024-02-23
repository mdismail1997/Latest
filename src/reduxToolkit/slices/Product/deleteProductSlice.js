import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const deleteProductData = createAsyncThunk(
  'delete/deleteProductData',
  async ({id}) => {
    try {
      const responseData = await authService.deleteProduct(id);
      console.log('deleteProduct success', responseData.data);

      if (responseData.data.message == 'User not found') {
        toasterr.showToast('For further processing, please log in or register');
      } else {
        toastr.showToast(responseData.data.message);
      }

      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('deleteProduct error', error.response);

      throw error;
    }
  },
);

const initialState = {
  deleteData: null,
  loading: false,
  error: null,
};

const deleteProductSlice = createSlice({
  name: 'delete',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(deleteProductData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductData.fulfilled, (state, action) => {
        //  console.log("reducer from admin deleteProduct slice example", action);
        state.loading = false;
        state.deleteData = action.payload;
      })
      .addCase(deleteProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default deleteProductSlice.reducer;

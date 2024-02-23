import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const editProductData = createAsyncThunk(
  'editProduct/editProductData',
  async data => {
    try {
      const responseData = await authService.editProduct(data);
      console.log('editProduct success', responseData.data);
      if (responseData.data.status === true) {
        toastr.showToast(responseData.data.response);
      } else {
        toasterr.showToast(responseData.data.response);
      }
      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('editProduct error', error.response);

      throw error;
    }
  },
);

const initialState = {
  editProductdata: null,
  loading: false,
  error: null,
};

const editProductSlice = createSlice({
  name: 'editProduct',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(editProductData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProductData.fulfilled, (state, action) => {
        //  console.log("reducer from admin addProduct slice example", action);
        state.loading = false;
        state.editProductdata = action.payload;
      })
      .addCase(editProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default editProductSlice.reducer;

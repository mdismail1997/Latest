import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const addProductData = createAsyncThunk(
  'addProduct/addProductData',
  async data => {
    try {
      const responseData = await authService.addProduct(data);
      console.log('addProduct success', responseData.data);
      if (responseData.data.status === true) {
        toastr.showToast(responseData.data.response);
      } else {
        toasterr.showToast(responseData.data.response);
      }
      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('addProduct error', error.response);

      throw error;
    }
  },
);

const initialState = {
  addProductdata: null,
  loading: false,
  error: null,
};

const addProductSlice = createSlice({
  name: 'addProduct',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addProductData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductData.fulfilled, (state, action) => {
        //  console.log("reducer from admin addProduct slice example", action);
        state.loading = false;
        state.addProductdata = action.payload;
      })
      .addCase(addProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default addProductSlice.reducer;

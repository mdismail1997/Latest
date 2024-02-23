// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  productList: null,
  loading: false,
  error: null,
};

export const getProductList = createAsyncThunk(
  'api/getproductList',
  async () => {
    const response = await authService.myProductList();
    console.log(response.data, 'all product data');
    return response.data;
  },
);

const productListSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProductList.pending, state => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.productList = action.payload;
        state.error = null;
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default productListSlice.reducer;

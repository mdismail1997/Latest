// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  productdata: null,
  loading: false,
  error: null,
};

export const getProductdata = createAsyncThunk(
  'api/getProductdata',
  async () => {
    const response = await authService.Products();
    console.log(response.data, 'all language data products');
    return response.data;
  },
);

const productSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProductdata.pending, state => {
        state.loading = true;
      })
      .addCase(getProductdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.productdata = action.payload;
        state.error = null;
      })
      .addCase(getProductdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default productSlice.reducer;

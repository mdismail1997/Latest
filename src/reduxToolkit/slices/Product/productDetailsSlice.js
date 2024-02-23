// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  productDetailsdata: null,
  loading: false,
  error: null,
};

export const getProductDetailsdata = createAsyncThunk(
  'api/getProductDetailsdata',
  async data => {
    const response = await authService.productDetails(data);
    // console.log(response, "all language data");
    return response.data;
  },
);

const productDetailsSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProductDetailsdata.pending, state => {
        state.loading = true;
      })
      .addCase(getProductDetailsdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.productDetailsdata = action.payload;
        state.error = null;
      })
      .addCase(getProductDetailsdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default productDetailsSlice.reducer;

// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  productSearchsdata: null,
  loading: false,
  error: null,
};

export const getProductSearchdata = createAsyncThunk(
  'api/getProductSearchdata',
  async data => {
    const response = await authService.productSearch(data);
    // console.log(response, "all language data");
    return response.data;
  },
);

const productSearchSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProductSearchdata.pending, state => {
        state.loading = true;
      })
      .addCase(getProductSearchdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.productSearchdata = action.payload;
        state.error = null;
      })
      .addCase(getProductSearchdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default productSearchSlice.reducer;

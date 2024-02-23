// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../api/auth';

const initialState = {
  orderdata: null,
  loading: false,
  error: null,
};

export const getorderdata = createAsyncThunk('api/getorderdata', async () => {
  const response = await authService.getOrderList();
  console.log(response.data, 'all language data orders');
  return response.data;
});

const orderSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getorderdata.pending, state => {
        state.loading = true;
      })
      .addCase(getorderdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.orderdata = action.payload;
        state.error = null;
      })
      .addCase(getorderdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default orderSlice.reducer;

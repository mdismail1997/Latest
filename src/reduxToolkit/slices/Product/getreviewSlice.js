// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  reviewdata: null,
  loading: false,
  error: null,
};

export const getreviewdata = createAsyncThunk(
  'api/getreviewdata',
  async data => {
    const response = await authService.getReviewData(data);
    console.log(response.data, 'all language data');
    return response.data;
  },
);

const reviewSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getreviewdata.pending, state => {
        state.loading = true;
      })
      .addCase(getreviewdata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.reviewdata = action.payload;
        state.error = null;
      })
      .addCase(getreviewdata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default reviewSlice.reducer;

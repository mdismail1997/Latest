// apiSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from '../../../api/auth';

const initialState = {
  categorydata: null,
  loading: false,
  error: null,
};

export const getcategorydata = createAsyncThunk(
  'api/getcategorydata',
  async () => {
    const response = await authService.Category();
    // console.log(response, 'all language data');
    return response.data;
  },
);

const categorySlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getcategorydata.pending, state => {
        state.loading = true;
      })
      .addCase(getcategorydata.fulfilled, (state, action) => {
        // console.log("reducer from slice example", action);
        state.loading = false;
        state.categorydata = action.payload;
        state.error = null;
      })
      .addCase(getcategorydata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default categorySlice.reducer;

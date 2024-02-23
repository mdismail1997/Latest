import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {toasterr, toastr} from '../../../utils/commonToast';
import authService from '../../../api/auth';

export const ratingReviewData = createAsyncThunk(
  'student/ratingReviewData',
  async ({id, content, rating}) => {
    try {
      const responseData = await authService.RatingandReview(
        id,
        content,
        rating,
      );
      console.log('ratingReview success', responseData.data);
      if (responseData.status === true) {
        console.log('===token====>', responseData.data.token);
        toastr.showToast(responseData.data.message);
      } else {
        if (responseData.data.message == 'User not found') {
          toasterr.showToast(
            'For further processing, please log in or register',
          );
        } else {
          toasterr.showToast(responseData.data.message);
        }
      }
      return responseData.data;
    } catch (error) {
      toasterr.showToast(error.response.data.message);
      console.log('ratingReview error', error.response.data.message);

      throw error;
    }
  },
);

const initialState = {
  ratingReviewData: null,
  loading: false,
  error: null,
};

const ratingReviewSlice = createSlice({
  name: 'studentratingReview',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(ratingReviewData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ratingReviewData.fulfilled, (state, action) => {
        //  console.log("reducer from admin ratingReview slice example", action);
        state.loading = false;
        state.ratingReviewData = action.payload;
      })
      .addCase(ratingReviewData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred.';
      });
  },
});

export default ratingReviewSlice.reducer;

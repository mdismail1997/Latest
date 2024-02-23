import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from '../api/auth';
import { getCategory, getProduct } from './slices/Product/productSlice';

const initialState = {
  category: {},
  product:{},
  isLoading: false,
  hasError: false
};


const Slice = createSlice({
  name: 'List',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getCategory.pending, (state, action)=> {
      state.isLoading = true;
      state.hasError = false
    }).addCase(getCategory.fulfilled, (state, action)=> {
      state.category= action.payload
      state.isLoading = false;
      state.hasError = false
    }).addCase(getCategory.rejected, (state, action)=> {
      state.isLoading = false;
      state.hasError = true
    })
 .addCase(getProduct.pending, (state, action)=> {
        state.isLoading = true;
        state.hasError= false;
    })
    .addCase(getProduct.fulfilled, (state, action)=> {
        state.product= action.payload
        state.isLoading = false;
        state.hasError =false;
    }).addCase(getProduct.rejected, (state, action)=> {
        state.isLoading = false;
        state.hasError= true;
    })
 }
});

export const {getCategories, getProducts} = Slice.actions;

export const Listreducer = Slice.reducer


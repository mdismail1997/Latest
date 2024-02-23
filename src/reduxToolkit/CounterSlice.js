import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from '../api/auth';
// import {Login, Register} from './ApiFetch/Auth';
import {setMessage} from './slices/message';

const user = '';

const initialState = user
  ? {isLoggedIn: true, user}
  : {isLoggedIn: false, user: null};

export const Login = createAsyncThunk('User/login', async (data, thunkAPI) => {
  try {
    const res = await authService.Login(data);
    console.log('bdfb', res);
    const message = res.data.message;
    thunkAPI.dispatch(setMessage(message));
    return res;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue();
  }
});


const CounterSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    [Login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [Login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
   
  },
});

const {reducer} = CounterSlice;

export default reducer;

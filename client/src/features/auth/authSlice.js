import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isSeller: false,
  showUserLogin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsSeller: (state, action) => {
      state.isSeller = action.payload;
    },
    setShowUserLogin: (state, action) => {
      state.showUserLogin = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isSeller = false;
    },
  },
});

export const { setUser, setIsSeller, setShowUserLogin, logout } = authSlice.actions;
export const selectAuthUser = (state) => state.auth.user;
export const selectIsSeller = (state) => state.auth.isSeller;
export const selectAuthLoading = (state) => state.auth.loading;
export default authSlice.reducer;

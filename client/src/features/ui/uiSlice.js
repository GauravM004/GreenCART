import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showUserLogin: false,
    searchQuery: '',
  },
  reducers: {
    setShowUserLogin: (state, action) => {
      state.showUserLogin = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setShowUserLogin, setSearchQuery } = uiSlice.actions;
export const selectShowUserLogin = (state) => state.ui.showUserLogin;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export default uiSlice.reducer;
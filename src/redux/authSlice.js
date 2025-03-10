import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Persist user
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Persist login
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user'); // Remove on logout
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

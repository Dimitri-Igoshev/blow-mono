// app/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken?: string;
}

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | undefined>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.accessToken = undefined;
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
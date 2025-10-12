import type { User } from '../authApi';

import { createSlice } from '@reduxjs/toolkit';

import { authStorage } from './storage';
import { userApi } from '../userApi'

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      authStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.fetchMe.matchPending, (state) => {
      state.loading = true;
    });
    builder.addMatcher(userApi.endpoints.fetchMe.matchFulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addMatcher(userApi.endpoints.fetchMe.matchRejected, (state) => {
      state.user = null;
      state.loading = false;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

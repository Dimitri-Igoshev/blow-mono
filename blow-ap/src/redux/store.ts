import { configureStore } from '@reduxjs/toolkit';

import { transactionApi } from './services/transactionApi';
import { topupApi } from './services/topupApi';
import { messageApi } from './services/messageApi';
import { claimApi } from './services/claimApi';
import { userApi } from './services/userApi';
import { serviceApi } from './services/serviceApi';

import { externalApi } from '@/generator/externalApi';
import projectReducer from '@/generator/projectSlice';
import authReducer from '@/redux/services/auth/authSlice';
import { authApi } from '@/redux/services/authApi';
import { cityApi } from './services/cityApi'
import { sessionApi } from './services/sessionsApi'
import { mailingApi } from './services/mailingApi'
import { withdrawalApi } from './services/withdrawalApi'
import { saleApi } from './services/saleApe'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [externalApi.reducerPath]: externalApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [topupApi.reducerPath]: topupApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [claimApi.reducerPath]: claimApi.reducer,
    [cityApi.reducerPath]: cityApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [mailingApi.reducerPath]: mailingApi.reducer,
    [withdrawalApi.reducerPath]: withdrawalApi.reducer,
    [saleApi.reducerPath]: saleApi.reducer,
    auth: authReducer,
    project: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      serviceApi.middleware,
      authApi.middleware,
      externalApi.middleware,
      transactionApi.middleware,
      topupApi.middleware,
      messageApi.middleware,
      claimApi.middleware,
      cityApi.middleware,
      sessionApi.middleware,
      mailingApi.middleware,
      withdrawalApi.middleware,
      saleApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

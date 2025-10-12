import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '../authApi';

import { logout } from './authSlice';

import { AppDispatch, RootState } from '@/redux/store';
import { useFetchMeQuery } from '../userApi'

export const useAuth = () => useSelector((state: RootState) => state.auth);

// export const useLogin = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [loginMutation] = useLoginMutation();

//   const login = async (data: { email: string; password: string }) => {
//     try {
//       const res = await loginMutation(data).unwrap();

//       if (res.access_token) {
//         authStorage.setToken(res.access_token);

//         // Дождаться получения пользователя
//         await dispatch(authApi.endpoints.fetchMe.initiate()).unwrap();

//         // Только после получения пользователя — навигация
//         // navigate('/', { replace: true });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return { login };
// };

export const useRegister = useRegisterMutation;
export const useForgotPassword = useForgotPasswordMutation;
export const useResetPassword = useResetPasswordMutation;

export function useLogout() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };
}

export const useMe = () => {
  return useFetchMeQuery();
};

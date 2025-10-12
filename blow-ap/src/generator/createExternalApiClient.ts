import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export function createExternalApiClient(projectConfig: any): AxiosInstance {
  const tokenCache: any = {
    accessToken: null,
  };

  const client = axios.create({
    baseURL: projectConfig.apiUrl,
  });

  // ⬅️ Устанавливаем accessToken перед каждым запросом
  //@ts-ignore
  client.interceptors.request.use((config: AxiosRequestConfig) => {
    if (tokenCache.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokenCache.accessToken}`;
    }

    return config;
  });

  // ⬅️ Перехват 401 → авто-логин → повтор запроса
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const authResponse = await axios.post(`${projectConfig.apiUrl}/auth/login`, {
            email: projectConfig.token.email,
            password: projectConfig.token.password,
          });

          const newToken = authResponse.data.accessToken;

          tokenCache.accessToken = newToken;

          // повтор запроса с новым токеном
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return client(originalRequest); // 🔁 retry
        } catch (authErr) {
          console.error('❌ Ошибка авто-логина для проекта:', projectConfig.apiUrl);

          return Promise.reject(authErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

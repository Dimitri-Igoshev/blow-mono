import type { AxiosInstance } from 'axios';
import type { RootState } from '@/redux/store';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { createExternalApiClient } from '../createExternalApiClient';

export const useProjectApi = (): AxiosInstance | null => {
  const { project, loading } = useSelector((state: RootState) => state.project);

  const api = useMemo(() => {
    if (!loading && project && project.apiUrl && project.token?.email && project.token?.password) {
      return createExternalApiClient({
        apiUrl: project.apiUrl,
        token: {
          email: project.token.email,
          password: project.token.password,
        },
      });
    }

    return null;
  }, [project, loading]);

  return api;
};

import { useSelector } from 'react-redux'; // путь к твоему store типу

import { RootState } from '@/redux/store';

export function useProject() {
  return useSelector((state: RootState) => state.project.project);
}

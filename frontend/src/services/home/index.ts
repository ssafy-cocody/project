import { api } from '@/services';
import { IFetchGetMyCodyResponse } from '@/services/home/type';

/**
 * 내가 만든 코디
 * @returns 최대 코디 6개 반환
 */
export const fetchGetMyCody = async () => {
  const size = 6;
  const data = await api.get<IFetchGetMyCodyResponse>(`/cody?size=${size}`);
  return data;
};

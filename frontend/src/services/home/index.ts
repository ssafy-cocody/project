import { api } from '@/services';
import { IFetchGetMyCodyResponse } from '@/services/home/type';

/**
 * 내가 만든 코디
 * @returns 최대 코디 8개 반환
 */
export const fetchGetMyCody = async () => {
  const data = await api.get<IFetchGetMyCodyResponse>('/cody');
  return data;
};

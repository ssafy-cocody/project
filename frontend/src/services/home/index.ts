import { api } from '@/services';
import { IFetchCreateCodyRequest, IFetchGetMyCodyResponse, IFetchPostOOTDCodyRequest } from '@/services/home/type';

/**
 * 내가 만든 코디
 * @returns 최대 코디 6개 반환
 */
export const fetchGetMyCody = async () => {
  const size = 6;
  const data = await api.get<IFetchGetMyCodyResponse>(`/cody?size=${size}`);
  return data;
};

export const fetchPostRecommendCodyToOOTD = async ({ date, codyId }: IFetchPostOOTDCodyRequest) => {
  const data = await api.post('/ootd/cody', { date, codyId });
  return data;
};

export const fetchPostCreateCody = async ({ codyId, name }: IFetchCreateCodyRequest) => {
  const data = await api.post(`/cody/create?&codyId=${codyId}&name=${name}`);
  return data;
};

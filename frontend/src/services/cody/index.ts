import { api } from '@/services';
import { IFetchGetCodyRequest, IFetchGetCodyResponse } from '@/services/cody/type';

export const fetchGetCody = async ({ page = 0, size = 8 }: IFetchGetCodyRequest): Promise<IFetchGetCodyResponse> => {
  const data: IFetchGetCodyResponse = await api.get<IFetchGetCodyResponse>(`/cody?page=${page}&size=${size}`);
  return data;
};

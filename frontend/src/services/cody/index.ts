import { api } from '@/services';
import {
  IFetchDeleteCodyRequest,
  IFetchGetCodyRequest,
  IFetchGetCodyResponse,
  IFetchPostOOTDCodyRequest,
} from '@/services/cody/type';

const CODY_PATH = '/cody';

export const fetchGetCody = async ({ page = 0, size = 8 }: IFetchGetCodyRequest): Promise<IFetchGetCodyResponse> => {
  const data: IFetchGetCodyResponse = await api.get<IFetchGetCodyResponse>(`/cody?page=${page}&size=${size}`);
  return data;
};

export const fetchDeleteCody = async ({ codyId }: IFetchDeleteCodyRequest) => {
  const data = await api.delete(`${CODY_PATH}/${codyId}`);
  return data;
};

export const fetchPostOOTDCody = async ({ date, codyId }: IFetchPostOOTDCodyRequest) => {
  const data = await api.post(`/ootd${CODY_PATH}`, { date, codyId });
  return data;
};

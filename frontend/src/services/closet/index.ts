import { api } from '@/services';

import { IFetchGetClosetRequest, IFetchGetClosetResponse } from './type';

export const fetchGetClothes = async ({
  page,
  size,
  category,
}: IFetchGetClosetRequest): Promise<IFetchGetClosetResponse> => {
  const data: IFetchGetClosetResponse = await api.get<IFetchGetClosetResponse>(
    `/closet?page=${page}&size=${size}&category=${category || ''}`,
  );
  return data;
};

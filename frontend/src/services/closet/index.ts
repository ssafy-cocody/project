import { api } from '@/services';

import { IFetchGetClosetRequest, IFetchGetClosetResponse } from './type';

export const fetchGetClothes = async ({
  page,
  size,
  sort = 'string',
  category,
}: IFetchGetClosetRequest): Promise<IFetchGetClosetResponse> => {
  const data: IFetchGetClosetResponse = await api.get<IFetchGetClosetResponse>(
    `/closet?page=${page}&size=${size}&sort=${sort}&category=${category || ''}`,
  );
  return data;
};

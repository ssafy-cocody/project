import { api, BASE_URL, getAccessToken } from '@/services';
import {
  IFetchGetCalendarRequest,
  IFetchGetCalendarResponse,
  IFetchGetOotdImageRequest,
} from '@/services/calendar/type';

export const fetchGetCalendar = async ({
  year,
  month,
}: IFetchGetCalendarRequest): Promise<IFetchGetCalendarResponse> => {
  const data: IFetchGetCalendarResponse = await api.get<IFetchGetCalendarResponse>(`/ootd?year=${year}&month=${month}`);
  return data;
};

/**
 * 내 코디 올리기
 * @return SSE 통신
 */
export const fetchGetOotdImage = async ({ formData }: IFetchGetOotdImageRequest) => {
  const response = await fetch(`${BASE_URL}/auth/v1/ootd/image`, {
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response;
};

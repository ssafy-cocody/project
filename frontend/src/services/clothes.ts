import { IFetchGetCalendarRequest, IFetchGetCalendarResponse } from '@/containers/calendar/Calendar/type';
import { api } from '@/services';

export const fetchGetCalendar = async ({
  year,
  month,
}: IFetchGetCalendarRequest): Promise<IFetchGetCalendarResponse> => {
  const data: IFetchGetCalendarResponse = await api.get<IFetchGetCalendarResponse>(`/ootd?year=${year}&month=${month}`);
  return data;
};

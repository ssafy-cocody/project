import { api } from '@/services';
import { IFetchGetCalendarRequest, IFetchGetCalendarResponse } from '@/services/calendar/type';

export const fetchGetCalendar = async ({
  year,
  month,
}: IFetchGetCalendarRequest): Promise<IFetchGetCalendarResponse> => {
  const data: IFetchGetCalendarResponse = await api.get<IFetchGetCalendarResponse>(`/ootd?year=${year}&month=${month}`);
  return data;
};

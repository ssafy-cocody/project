import { ICalendar } from '@/containers/calendar/Calendar/type';

interface IFetchGetCalendarRequest {
  year: string;
  month: string;
}

type IFetchGetCalendarResponse = ICalendar[];

export type { IFetchGetCalendarRequest, IFetchGetCalendarResponse };

interface IFetchGetCalendarRequest {
  year: string;
  month: string;
}

interface ICalendar {
  ootdId: number;
  day: number;
  image: string;
}

type IFetchGetCalendarResponse = ICalendar[];

export type { ICalendar, IFetchGetCalendarRequest, IFetchGetCalendarResponse };

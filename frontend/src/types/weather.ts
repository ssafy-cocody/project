interface ILatLon {
  latitude: number;
  longtitude: number;
}

interface ILocXY {
  X: number;
  Y: number;
}

const DATE_DIFF_VALUES = {
  TODAY: 0,
  TOMORROW: 1,
  DAYAFTERTOMORROW: 2,
} as const;

const DATE_TEXT = {
  [DATE_DIFF_VALUES.TODAY]: '오늘',
  [DATE_DIFF_VALUES.TOMORROW]: '내일',
  [DATE_DIFF_VALUES.DAYAFTERTOMORROW]: '모레',
} as const;

interface weatherCodes {
  [index: string]: string | undefined;
  TMP?: string; // 현재 기온
  TMN?: string; // 일 최저기온
  TMX?: string; // 일 최고기온
  SKY?: string; // 하늘상태 코드: 맑음(1), 구름많음(3), 흐림(4)
  PTY?: string; // 강수형태 코드: 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
}

interface IWeatherInfo {
  [DATE_DIFF_VALUES.TODAY]: weatherCodes;
  [DATE_DIFF_VALUES.TOMORROW]: weatherCodes;
  [DATE_DIFF_VALUES.DAYAFTERTOMORROW]: weatherCodes;
}

interface IWeatherResponse {
  fcstDate: string;
  fcstTime: string;
  category: string;
  fcstValue: string;
}

export { DATE_DIFF_VALUES, DATE_TEXT };
export type { ILatLon, ILocXY, IWeatherInfo, IWeatherResponse };

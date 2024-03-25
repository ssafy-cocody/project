interface ITemperatures {
  lowestTemperature: Number;
  hightestTemperature: Number;
  weather: Number;
}

const Time = {
  Today: 0,
  Tomorrow: 1,
  DayAfterTomorrow: 2,
} as const;

type TTime = number;

export { Time };
export type { ITemperatures, TTime };

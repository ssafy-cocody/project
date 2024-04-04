import { ILocXY } from '@/types/weather';

const fetchWeatherInfo = async (date: string, { X, Y }: ILocXY) => {
  const url = process.env.NEXT_PUBLIC_WEATHER_SERVICE_URL;
  let queryParams = `?serviceKey=${process.env.NEXT_PUBLIC_WEATHER_SERVICE_KEY}`;
  queryParams += `&pageNo=1`;
  queryParams += `&numOfRows=1000`;
  queryParams += `&dataType=JSON`;
  queryParams += `&base_date=${date}`;
  queryParams += `&base_time=0200`;
  queryParams += `&nx=${X!}`;
  queryParams += `&ny=${Y!}`;

  const response = await fetch(`${url}${queryParams}`, {
    method: 'GET',
  });

  if (!response.ok) throw new Error(response.statusText);

  return response.json();
};

export { fetchWeatherInfo };

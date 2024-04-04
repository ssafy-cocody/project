import { paddingDigit } from './date';

/**
 * 공공 데이터 날씨 API의 시간 포맷으로 변환하는 함수
 * 2시부터 3시간 간격의 시간 중 가장 최근 시간으로 지정
 * @returns HH00
 */
export const getTimeForWeather = () => {
  const today = new Date();
  const currentHours = Number(today.getHours());
  const currentMinutes = Number(today.getMinutes());
  const currentTime = currentHours * 60 + currentMinutes;

  let closestHours = 2;

  for (let i = 2; i < 24; i += 3) {
    if (i * 60 + 10 < currentTime) {
      closestHours = i;
    } else {
      break;
    }
  }

  return `${paddingDigit(closestHours)}00`;
};

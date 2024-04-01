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
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response?.body) return Promise.reject(new Error('response가 없습니다.'));

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let data = '';
  let isDone = false;

  // FIXME 반복문 개선
  while (!isDone) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done } = await reader.read();
    isDone = done;
    if (done) break;

    const res = value?.split('\n'); // value 리턴타입: "event: message|remove \n data: '' "
    const eventTypeMatchResult = res[0].match(/[^event: ].+/);
    const eventType = eventTypeMatchResult ? eventTypeMatchResult[0] : '';
    if (eventType === 'remove') {
      // eslint-disable-next-line no-await-in-loop
      await reader.closed;
      break;
    }

    data = res[1].split(':')[1];
  }

  // TODO data타입 확인
  if (data) return data;
  return Promise.reject(new Error('upload error'));
};

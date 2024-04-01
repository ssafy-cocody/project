import { api, BASE_URL, getAccessToken } from '@/services';
import {
  IFetchGetOotdImageRequest,
  IFetchGetOotdImageResponse,
  IFetchPostOotdImageRequest,
  IFetchPostOotdImageResponse,
} from '@/services/calendar/outfit/type';

/**
 * 내 코디 올리기
 * @return SSE 통신
 */
export const fetchGetOotdImage = async ({
  formData,
}: IFetchGetOotdImageRequest): Promise<IFetchGetOotdImageResponse> => {
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

/**
 * 내 코디 등록
 * TODO: 파라미터 넘기기
 */
export const fetchPostOotdImage = async ({ formData, clothesRequest, date }: IFetchGetOotdImageRequest) => {
  const response = await fetch(`${BASE_URL}/v1/auth/ootd/image`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  return response;
};

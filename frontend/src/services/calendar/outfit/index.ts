import { BASE_URL, getAccessToken } from '@/services';
import { IFetchGetOotdImageRequest, IFetchGetOotdImageResponse } from '@/services/calendar/outfit/type';
import { IClothes } from '@/types/clothes';

/**
 * 내 코디 올리기
 * @return SSE 통신
 */
// FIXME  closed 되는지 확인 필요
export const fetchPostOotdImageSearch = async ({
  formData,
}: IFetchGetOotdImageRequest): Promise<IFetchGetOotdImageResponse> => {
  const response = await fetch(`${BASE_URL}/auth/v1/ootd/imageSearch`, {
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
    if (done) {
      // eslint-disable-next-line no-await-in-loop
      await reader.closed;
      break;
    }
    const res = value?.split('\n'); // value 리턴타입: "event: message|remove \n data: '' "
    const eventTypeMatchResult = res[0].match(/[^event: ].+/);
    const eventType = eventTypeMatchResult ? eventTypeMatchResult[0] : '';
    if (eventType === 'remove') {
      // eslint-disable-next-line no-await-in-loop
      await reader.closed;
      break;
    }

    data = res[1].slice(5);
  }

  try {
    data = JSON.parse(data);
  } catch (e) {
    throw Error('json parsing');
  }

  if (data) return { data: data as unknown as IClothes[] };
  return Promise.reject(new Error('upload error'));
};

/**
 * 내 코디 등록
 */
export const fetchPostOotdImage = async ({ formData }: IFetchGetOotdImageRequest) => {
  const response = await fetch(`${BASE_URL}/auth/v1/ootd/image`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) return new Error(response.statusText);

  return response;
};

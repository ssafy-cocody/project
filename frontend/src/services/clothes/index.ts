import { BASE_URL, getAccessToken } from '@/services/';
import {
  IFetchGetClothesInfoRequest,
  IFetchGetClothesInfoResponse,
  IFetchPostClothesImageRequest,
  IFetchPostClothesImageResponse,
} from '@/services/clothes/type';

/**
 * 옷 이미지 등록
 */
const fetchPostClothesImage = async ({
  formData,
}: IFetchPostClothesImageRequest): Promise<IFetchPostClothesImageResponse> => {
  // FIXME 엔드포인트 수정
  const response = await fetch(`${BASE_URL}/public/v1/clothes/image`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response?.body) return Promise.reject(new Error('response가 없습니다.'));

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let uuid = '';
  let isDone = false;

  // FIXME 반복문 개선, eslint
  while (!isDone) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done } = await reader.read();
    isDone = done;
    if (done) break;

    const res = value?.split('\n'); // value 리턴타입: "event: message|remove \n data: '' "
    const eventType = res[0].match(/[^event: ].+/)[0];
    if (eventType === 'remove') {
      // eslint-disable-next-line no-await-in-loop
      await reader.closed;
      break; // TODO stream 읽기 종료
    }

    const data = res[1].match(/[^data: ].+/)[0];
    uuid = data;
  }

  if (uuid) return { uuid };
  return Promise.reject(new Error('upload error'));
};

/**
 * UUID로 유사한 옷 검색
 */
const fetchGetClothesInfo = async ({ uuid }: IFetchGetClothesInfoRequest): Promise<IFetchGetClothesInfoResponse> => {
  const response = await fetch(`${BASE_URL}/auth/v1/clothes/temp/info/${uuid}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.json();
};

export { fetchGetClothesInfo, fetchPostClothesImage };

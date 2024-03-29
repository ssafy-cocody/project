import { api, BASE_URL, getAccessToken } from '@/services/';
import {
  IFetchGetClothesInfoRequest,
  IFetchGetClothesInfoResponse,
  IFetchPostClothesImageRequest,
  IFetchPostClothesImageResponse,
  IFetchPostSaveClothesRequest,
} from '@/services/clothes/type';

/**
 * 옷 이미지 등록
 */
const fetchPostClothesImage = async ({
  formData,
}: IFetchPostClothesImageRequest): Promise<IFetchPostClothesImageResponse> => {
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

    const dataMatchResult = res[1].match(/[^data: ].+/);
    const data = dataMatchResult ? dataMatchResult[0] : '';
    uuid = data;
  }

  if (uuid) return { uuid };
  return Promise.reject(new Error('upload error'));
};

/**
 * UUID로 유사한 옷 검색
 */
const fetchGetClothesInfo = async ({ uuid }: IFetchGetClothesInfoRequest) => {
  const response = await api.get<IFetchGetClothesInfoResponse>(`/clothes/temp/info/${uuid}`);

  return response;
};

/**
 * 옷 등록
 */
const fetchPostSaveClothes = async ({ uuid, clothes }: IFetchPostSaveClothesRequest) => {
  // FIXME api 모듈로 formData 보내기
  const response = await fetch(`${BASE_URL}/auth/v1/clothes/temp/save/${uuid}`, {
    method: 'POST',
    body: clothes,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  return response.json();
};

export { fetchGetClothesInfo, fetchPostClothesImage, fetchPostSaveClothes };

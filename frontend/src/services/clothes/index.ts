import { BASE_URL, getAccessToken } from '@/services/';
import { IFetchPostClothesImageRequest } from '@/services/clothes/type';

/**
 * 옷 이미지 등록
 */
const fetchPostClothesImage = async ({ formData }: IFetchPostClothesImageRequest) => {
  const response = await fetch(`${BASE_URL}/public/v1/clothes/image`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response?.body) return Promise.reject(new Error('response가 없습니다.'));

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  let clothesId = '';
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
    clothesId = data;
  }

  if (clothesId) return clothesId;
  return new Error('upload error');
};

export { fetchPostClothesImage };

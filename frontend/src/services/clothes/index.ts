import { BASE_URL, getAccessToken } from '@/services/';
import { IFetchPostClothesImageRequest } from '@/services/clothes/type';

/**
 * 옷 누끼 추출
 */
const fetchPostClothesImage = async ({ formData }: IFetchPostClothesImageRequest) => {
  const result = await fetch(`${BASE_URL}/auth/v1/clothes/image`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.json();
};

export { fetchPostClothesImage };

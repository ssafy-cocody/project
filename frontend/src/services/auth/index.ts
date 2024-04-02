import { IFetchUserInfoResponse } from '@/services/auth/type';

/**
 * 로그인한 사용자 정보 조회
 */
const fetchUserInfo = async (): Promise<IFetchUserInfoResponse> => {
  const endpoint = process.env.NEXT_PUBLIC_API_PUBLIC_ENDPOINT;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
    credentials: 'include',
    cache: 'no-store', // TODO access token이 유효한 시간동안만 캐싱해도 좋을 것 같음
  });

  if (!response.ok) {
    const error = new Error(`${response.status} headers${response.headers}`);
    return Promise.reject(error);
  }

  const data = await response.json();

  const bearerRegexp = /^Bearer\s+(.*)$/;
  const accessToken = response.headers.get('Authorization');
  const matches = accessToken!.match(bearerRegexp);

  if (matches) return Object.assign(data, { accessToken: matches[1] });

  return data;
};
export { fetchUserInfo };

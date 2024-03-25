import { BASE_URL, getAccessToken } from '@/services';
import { IFetchCreateMember, IFetchUserInfoResponse } from '@/services/auth/type';

/**
 * 로그인한 사용자 정보 조회
 */
const fetchUserInfo = async () => {
  const endpoint = process.env.NEXT_PUBLIC_API_PUBLIC_ENDPOINT;

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    credentials: 'include',
  });
  const data: IFetchUserInfoResponse = await response.json();

  if (response.ok) {
    const bearerRegexp = /^Bearer\s+(.*)$/;
    const accessToken = response.headers.get('Authorization');
    const matches = accessToken!.match(bearerRegexp);

    if (matches) return Object.assign(data, { accessToken: matches[1] });
  }

  // TODO error 처리
  const error = new Error('error');
  return Promise.reject(error);
};

/**
 * 회원가입
 */
const fetchCreateMember = async (params: IFetchCreateMember) => {
  console.log('token', getAccessToken());
  const response = await fetch(`${BASE_URL}/auth/v1/member`, {
    method: 'PATCH',
    body: JSON.stringify(params),
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  return response.json();
};

export { fetchCreateMember, fetchUserInfo };

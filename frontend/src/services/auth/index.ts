import { IFetchCreateMemberRequest, IFetchUserInfoResponse } from '@/services/auth/type';

/**
 * 로그인한 사용자 정보 조회
 */
const fetchUserInfo = async () => {
  const endpoint = process.env.NEXT_PUBLIC_API_PUBLIC_ENDPOINT;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
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
const fetchCreateMember = async (params: IFetchCreateMemberRequest) => {
  const { accessToken } = await fetchUserInfo();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/v1/member`, {
    method: 'PATCH',
    body: JSON.stringify(params),
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });
  return response.json();
};

export { fetchCreateMember, fetchUserInfo };

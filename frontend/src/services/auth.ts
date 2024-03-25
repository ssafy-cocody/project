import { BASE_URL } from '@/services';

enum userRole {
  GUEST = 'GUEST',
  USER = 'USER',
}

type TGender = 'MALE' | 'FEMALE';

interface IUser {
  nickname?: string;
  role?: userRole;
  gender?: TGender;
  birth?: string; // yyyyMMdd
  accessToken?: string;
}

type IFetchUserInfoResponse = IUser;

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
    const accessToken = response.headers.get('Authorization');

    if (accessToken) return Object.assign(data, { accessToken });
  }

  // TODO error 처리
  const error = new Error('error');
  return Promise.reject(error);
};

type IFetchCreateMember = Pick<IUser, 'birth' | 'gender' | 'nickname'>;
/**
 * 회원가입
 */
const fetchCreateMember = async (params: IFetchCreateMember) => {
  const response = await fetch(`${BASE_URL}/auth/v1/member`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return response.json();
};

export { fetchCreateMember, fetchUserInfo, userRole };
export type { IUser, TGender };

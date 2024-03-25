import { BASE_URL } from '@/services';

interface IUser {
  accesstoken: string;
  role?: 'guest' | '';
}

interface IFetchUserInfoResponse {
  data?: IUser;
  errors?: Array<{ message: string }>;
}

/**
 * 로그인한 사용자 정보 조회
 * cookie refresh token으로 조회
 */
const fetchUserInfo = async () => {
  const response = await fetch(`${BASE_URL}/public`, {
    credentials: 'include',
  });
  const { data, errors }: IFetchUserInfoResponse = await response.json();

  if (response.ok) {
    const accesstoken = data?.accesstoken;

    if (accesstoken) return data;
  }

  const error = new Error(errors?.map((e) => e.message).join('\n') ?? 'unknown');
  return Promise.reject(error);
};

/**
 * 회원가입
 * PETCH /auth/v1/member
 * MALE | FEMALE
 * "19980925" 8자리
 */

export { fetchUserInfo };
export type { IUser };

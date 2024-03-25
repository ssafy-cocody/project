import { BASE_URL } from '@/services';

interface IUser {
  nickname?: string;
  role?: 'guest' | 'user';
  gender?: 'MALE' | 'FEMALE';
  birth?: string; // yyyyMMdd
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
  const endpoint = process.env.NEXT_PUBLIC_API_PUBLIC_ENDPOINT;

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
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

export { fetchCreateMember, fetchUserInfo };
export type { IUser };

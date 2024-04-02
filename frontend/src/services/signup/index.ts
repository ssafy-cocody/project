import { BASE_URL, getAccessToken } from '@/services';
import { IFetchCreateMemberRequest, IFetchUpdateMemberRequest } from '@/services/signup/type';

/**
 * 회원가입
 * @param birth string,
 * @param gender, TGender
 * @param nickname, string
 */
async function fetchCreateMember({ formData }: IFetchCreateMemberRequest) {
  const response = await fetch(`${BASE_URL}/auth/v1/member`, {
    method: 'PATCH',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) throw new Error(response.statusText);

  return response;
}

/**
 * 회원 정보 수정
 * @param birth string,
 * @param gender, TGender
 * @param nickname, string
 * @param profile, string
 */
const fetchUpdateMember = async ({ formData }: IFetchUpdateMemberRequest) => {
  const response = await fetch(`${BASE_URL}/auth/v1/member`, {
    method: 'PATCH',
    body: formData,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) throw new Error(response.statusText);

  return response;
};

export { fetchCreateMember, fetchUpdateMember };

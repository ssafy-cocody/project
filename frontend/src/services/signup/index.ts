import { api, BASE_URL, getAccessToken } from '@/services';
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

  if (!response.ok) return new Error(response.statusText);

  const data = await response.json();

  return data;
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

  if (!response.ok) return new Error(response.statusText);

  const data = await response.json();

  return data;
};

export { fetchCreateMember, fetchUpdateMember };

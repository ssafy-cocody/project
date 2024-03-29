import { api } from '@/services';
import { IFetchCreateMemberRequest } from '@/services/auth/type';

/**
 * 회원가입
 */
const fetchCreateMember = async (params: IFetchCreateMemberRequest) => {
  const response = await api.patch<IFetchCreateMemberRequest>('/auth/v1/member', {
    ...params,
  });

  return response;
};

export { fetchCreateMember };

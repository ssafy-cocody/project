import { api } from '@/services';
import { IFetchCreateMemberRequest, IFetchUpdateMemberRequest } from '@/services/signup/type';

/**
 * 회원가입
 * TODO formdata
 */
const fetchCreateMember = async (params: IFetchCreateMemberRequest) => {
  const response = await api.patch('/member', {
    ...params,
  });

  return response;
};

/**
 * 회원 정보 수정
 * @param birth string,
 * @param gender, TGender
 * @param nickname, string
 * @param profile, string
 */
const fetchUpdateMember = async (params: IFetchUpdateMemberRequest) => {
  const response = await api.patch('/member', {
    ...params,
  });

  return response;
};

export { fetchCreateMember, fetchUpdateMember };

import { IUser } from '@/types/user';

type IFetchCreateMemberRequest = Pick<IUser, 'birth' | 'gender' | 'nickname'>;

interface IFetchUpdateMemberRequest {
  formData: FormData; // birth, gender, nickname, profile
}

export type { IFetchCreateMemberRequest, IFetchUpdateMemberRequest };

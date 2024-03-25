import { IUser } from '@/types/user';

type IFetchUserInfoResponse = IUser;

type IFetchCreateMemberRequest = Pick<IUser, 'birth' | 'gender' | 'nickname'>;

export type { IFetchCreateMemberRequest, IFetchUserInfoResponse };

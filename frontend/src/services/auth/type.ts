import { IUser } from '@/types/user';

type IFetchUserInfoResponse = IUser;

type IFetchCreateMember = Pick<IUser, 'birth' | 'gender' | 'nickname'>;

export type { IFetchCreateMember, IFetchUserInfoResponse };

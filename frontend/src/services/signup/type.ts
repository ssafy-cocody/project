import { IUser } from '@/types/user';

type IFetchCreateMemberRequest = Pick<IUser, 'birth' | 'gender' | 'nickname'>;

export type { IFetchCreateMemberRequest };

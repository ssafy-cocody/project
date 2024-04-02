enum userRole {
  GUEST = 'GUEST',
  USER = 'USER',
}

type TGender = 'MALE' | 'FEMALE';

interface IUser {
  nickname?: string;
  role?: userRole;
  gender?: TGender;
  birth?: string; // yyyyMMdd
  accessToken?: string;
}

export { userRole };
export type { IUser, TGender };

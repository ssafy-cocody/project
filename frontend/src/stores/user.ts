import { atom } from 'jotai';

import { IUser } from '@/types/user';

const userAtom = atom<IUser | undefined>(undefined);

export { userAtom };

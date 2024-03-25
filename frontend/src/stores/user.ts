import { atom } from 'jotai';

import { IUser } from '@/types/user';

const initUser = {};
const userAtom = atom<IUser>(initUser);

export { initUser, userAtom };

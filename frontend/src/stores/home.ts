import { atom } from 'jotai';

const todayTempAtom = atom<number | undefined>(undefined);

export { todayTempAtom };

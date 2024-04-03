import { atom } from 'jotai';

import { DATE_DIFF_VALUES } from '@/types/weather';

const defaultDateDiff = DATE_DIFF_VALUES.TODAY;
const dateDiffAtom = atom<(typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]>(defaultDateDiff);

export { dateDiffAtom };

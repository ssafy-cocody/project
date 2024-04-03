import { atom } from 'jotai';

import { IRecommendCody } from '@/types/recommend';
import { DATE_DIFF_VALUES } from '@/types/weather';

const defaultDateDiff = DATE_DIFF_VALUES.TODAY;
const dateDiffAtom = atom<(typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]>(defaultDateDiff);

const defaultRecommendCody: IRecommendCody[] = [];
const recommendCodyAtom = atom<IRecommendCody[]>(defaultRecommendCody);

export { dateDiffAtom, recommendCodyAtom };

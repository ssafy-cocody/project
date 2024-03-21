import { atom } from 'jotai';

import { IRecommendCody } from '@/containers/home/type';

const initRecommend: IRecommendCody = { id: 0, image: '' };
const selectedCodyAtom = atom<IRecommendCody>(initRecommend);

export { selectedCodyAtom };

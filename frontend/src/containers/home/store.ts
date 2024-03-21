import { atom } from 'jotai';

import { IRecommendCody } from '@/containers/home/type';

// TODO: data fetch할 때 첫 번째 코디를 초기 추천으로 지정
const initRecommend: IRecommendCody = { id: 0, image: '' };
const selectedCodyAtom = atom<IRecommendCody>(initRecommend);

export { selectedCodyAtom };

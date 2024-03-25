import { atom } from 'jotai';

import { Step } from '@/types/clothes';

const initStep = Step.SEARCH_WITH_CAMERA;
const stepAtom = atom<Step>(initStep);

const initHistory = [Step.SEARCH_WITH_CAMERA];
const historyAtom = atom<Step[]>(initHistory);

export { historyAtom, initHistory, initStep, stepAtom };

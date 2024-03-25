import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

import { historyAtom, initHistory, initStep, stepAtom } from '@/stores/clothesStep';
import { DONE, Step } from '@/types/clothes';

// TODO 새로 고침시 step 유지
const useClothesStep = () => {
  const router = useRouter();
  const [step, setStep] = [useAtomValue(stepAtom), useSetAtom(stepAtom)];
  const [history, setHistory] = [useAtomValue(historyAtom), useSetAtom(historyAtom)];

  /**
   * 이전 스텝으로 뒤로가기
   */
  const goBackStep = () => {
    const isIndex = step === Step.SEARCH_WITH_CAMERA;

    // 첫 페이지인 경우 옷장으로 뒤로가기
    if (isIndex) {
      router.push('/closet');
      return;
    }

    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    setStep(newHistory.slice(-1)[0]);
  };

  /**
   * 다음 스텝으로 이동
   */
  const goNextStep = (nextStep: Step | '') => {
    // 등록 완료시 /closet으로 이동
    if (nextStep === DONE) {
      router.push('/closet');
      return;
    }
    const newHistory = [...history, nextStep];
    setHistory(newHistory);
    setStep(newHistory.slice(-1)[0]);
  };

  /**
   * 다른 스텝으로 점프
   */
  const jumpStep = (nextStep: Step) => {
    const newHistory = [...history, nextStep];
    setHistory(newHistory);
    setStep(newHistory.slice(-1)[0]);
  };

  const initClothesStep = () => {
    setHistory(initHistory);
    setStep(initStep);
  };

  return { step, history, goBackStep, goNextStep, jumpStep, initClothesStep };
};

export default useClothesStep;

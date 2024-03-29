'use client';

import { useEffect, useState } from 'react';

import Background from '@/components/Background';
import Header from '@/components/Header';
import AdditionalForm from '@/containers/clothes/AdditionalForm';
import BasicForm from '@/containers/clothes/BasicForm';
import styles from '@/containers/clothes/ClothesLayout.module.scss';
import SearchWithCode from '@/containers/clothes/SearchWithCode';
import SearchWithImage from '@/containers/clothes/SearchWithImage';
import useClothesStep from '@/hooks/useClothesStep';
import { DONE, INewClothes, Step } from '@/types/clothes';

const Page = () => {
  const { step, goBackStep, goNextStep, initClothesStep } = useClothesStep();
  const [clothes, setClothes] = useState<INewClothes>();

  useEffect(() => {
    // 페이지 첫 렌더시 초기화
    initClothesStep();
  }, []);

  /**
   * 인풋 값이 바뀔때마다 clothes 상태 업데이트
   */
  const handleChangeInput = ({ key, value }: { key: string; value: string | number }) => {
    setClothes((prev) => ({ ...prev, [key]: value }));
  };

  const handleSumbit = () => {
    console.log('clothes', clothes);
  };

  const uploadStep = {
    // 사진 검색 플로우
    [Step.SEARCH_WITH_CAMERA]: {
      title: '사진 검색',
      renderStep: (nextStep: Step | '') => <SearchWithImage onClickButton={() => goNextStep(nextStep)} />,
      nextStep: Step.SEARCH_WITH_CAMERA_BASIC_FORM,
    },
    [Step.SEARCH_WITH_CAMERA_BASIC_FORM]: {
      title: '기본 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <BasicForm onChange={handleChangeInput} onClickButton={() => goNextStep(nextStep)} />
      ),
      nextStep: Step.SEARCH_WITH_CAMERA_ADDITIONAL_FORM,
    },
    [Step.SEARCH_WITH_CAMERA_ADDITIONAL_FORM]: {
      title: '추가 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <AdditionalForm
          onChange={handleChangeInput}
          onClickButton={() => {
            goNextStep(nextStep);
            handleSumbit();
          }}
        />
      ),
      nextStep: DONE,
    },
    // 품번 검색 플로우
    [Step.SEARCH_WITH_CODE]: {
      title: '품번 검색',
      renderStep: (nextStep: Step | '') => <SearchWithCode onClickButton={() => goNextStep(nextStep)} />,
      nextStep: Step.SEARCH_WITH_CODE_BASIC_FORM,
    },
    [Step.SEARCH_WITH_CODE_BASIC_FORM]: {
      title: '기본 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <BasicForm onChange={handleChangeInput} onClickButton={() => goNextStep(nextStep)} />
      ),
      nextStep: Step.SEARCH_WITH_CODE_ADDITIONAL_FORM,
    },
    [Step.SEARCH_WITH_CODE_ADDITIONAL_FORM]: {
      title: '추가 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <AdditionalForm
          onChange={handleChangeInput}
          onClickButton={() => {
            goNextStep(nextStep);
            handleSumbit();
          }}
        />
      ),
      nextStep: DONE,
    },
    // 직접 등록 플로우
    [Step.SELF_BASIC_FORM]: {
      title: '기본 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <BasicForm onChange={handleChangeInput} onClickButton={() => goNextStep(nextStep)} />
      ),
      nextStep: Step.SELF_ADDITIONAL_FORM,
    },
    [Step.SELF_ADDITIONAL_FORM]: {
      title: '추가 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <AdditionalForm
          onChange={handleChangeInput}
          onClickButton={() => {
            goNextStep(nextStep);
            handleSumbit();
          }}
        />
      ),
      nextStep: DONE,
    },
  } as const;

  const stepInfo = uploadStep[step];
  const { renderStep, title, nextStep } = stepInfo;

  return (
    <>
      <Header onClickPreviousButton={goBackStep} title={title} />
      <div className={styles.container}>{renderStep(nextStep)}</div>
      <Background $backgroundColor="yellow" />
    </>
  );
};

export default Page;

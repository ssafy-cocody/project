'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import Background from '@/components/Background';
import Header from '@/components/Header';
import AdditionalForm from '@/containers/clothes/AdditionalForm';
import BasicForm from '@/containers/clothes/BasicForm';
import styles from '@/containers/clothes/ClothesLayout.module.scss';
import SearchWithCode from '@/containers/clothes/SearchWithCode';
import SearchWithImage from '@/containers/clothes/SearchWithImage';
import useClothesStep from '@/hooks/useClothesStep';
import { fetchGetClothesTempImg, fetchPostClothes, fetchPostSaveClothes } from '@/services/clothes';
import { DONE, INewClothes, Step } from '@/types/clothes';

const initClothes = {
  uuid: '',
  image: '',
};

const Page = () => {
  const { step, goBackStep, goNextStep, initClothesStep, jumpStep } = useClothesStep();
  const [clothes, setClothes] = useState<INewClothes>(initClothes);
  // 옷 등록 폼 뮤테이션
  const clothesMutation = useMutation({
    mutationFn: fetchPostSaveClothes,
    onSuccess: () => {
      // TODO closet 업데이트
    },
  });
  // 이미지 검색 후 등록 폼 뮤테이션
  const clothesWithCameraSearchMutation = useMutation({
    mutationFn: fetchPostClothes,
  });

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

  /**
   * 사진으로 옷 검색 후 등록 핸들러
   */
  const handleSubmitSearchWithCamera = ({ success }: { success: () => void }) => {
    if (clothesWithCameraSearchMutation.isPending) return;

    const { clothesId } = clothes;
    if (!clothesId) return;

    clothesWithCameraSearchMutation.mutate(
      { clothesId: Number(clothesId) },
      {
        onSuccess: () => {
          success();
        },
      },
    );
  };

  /**
   * 옷 등록 핸들러
   */
  const handleSumbit = ({ success }: { success: () => void }) => {
    if (clothesMutation.isPending) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uuid, image, ...data } = clothes;
    if (!uuid) return;

    const formdata = new FormData();
    formdata.append('category', data.category!);
    formdata.append('name', data.name!);
    formdata.append('color', data.color!);
    formdata.append('brand', data.brand || '');
    formdata.append('productNo', data.productNo || '');
    formdata.append('price', data.price && Number(data.price) > 0 ? data.price.toString() : '');
    formdata.append('link', data.link || '');

    clothesMutation.mutate(
      {
        uuid,
        clothes: formdata,
      },
      {
        onSuccess: () => {
          success();
        },
      },
    );
  };

  const uploadStep = {
    // 사진 검색 플로우
    [Step.SEARCH_WITH_CAMERA]: {
      title: '사진 검색',
      renderStep: (nextStep: Step | '') => (
        <SearchWithImage
          onSelectResult={({ clothesId, uuid, category, name, color, brand, productNo, price, image }) => {
            const newItem = { ...clothes, category, name, color, brand, productNo, price, image, uuid, clothesId };

            setClothes(newItem);
            goNextStep(nextStep);
          }}
          onClickSelfBasicForm={({ uuid }) => {
            const setClothesImage = async () => {
              const res = await fetchGetClothesTempImg(uuid);
              setClothes({
                uuid,
                image: res?.toString(),
              });
            };
            setClothesImage();
            jumpStep(Step.SELF_BASIC_FORM);
          }}
        />
      ),
      nextStep: Step.SEARCH_WITH_CAMERA_BASIC_FORM,
    },
    [Step.SEARCH_WITH_CAMERA_BASIC_FORM]: {
      title: '기본 정보 입력',
      renderStep: () => (
        <BasicForm
          readOnly
          onChange={handleChangeInput}
          onClickButton={() => {
            handleSubmitSearchWithCamera({
              // 옷 성공 후 /closet 로 이동
              success: () => goNextStep(DONE),
            });
          }}
          {...clothes}
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
        <BasicForm onChange={handleChangeInput} onClickButton={() => goNextStep(nextStep)} {...clothes} />
      ),
      nextStep: Step.SEARCH_WITH_CODE_ADDITIONAL_FORM,
    },
    [Step.SEARCH_WITH_CODE_ADDITIONAL_FORM]: {
      title: '추가 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <AdditionalForm
          onChange={handleChangeInput}
          onClickButton={() => {
            handleSumbit({
              // 옷 성공 후 /closet 로 이동
              success: () => goNextStep(nextStep),
            });
          }}
          {...clothes}
        />
      ),
      nextStep: DONE,
    },
    // 직접 등록 플로우
    [Step.SELF_BASIC_FORM]: {
      title: '기본 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <BasicForm onChange={handleChangeInput} onClickButton={() => goNextStep(nextStep)} {...clothes} />
      ),
      nextStep: Step.SELF_ADDITIONAL_FORM,
    },
    [Step.SELF_ADDITIONAL_FORM]: {
      title: '추가 정보 입력',
      renderStep: (nextStep: Step | '') => (
        <AdditionalForm
          onChange={handleChangeInput}
          onClickButton={() => {
            handleSumbit({
              // 옷 성공 후 /closet 로 이동
              success: () => goNextStep(nextStep),
            });
          }}
          {...clothes}
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

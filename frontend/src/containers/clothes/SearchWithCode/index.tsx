'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import TextInputWithSearchButton from '@/components/TextInputWithSearchButton';
import useClothesStep from '@/hooks/useClothesStep';
import useModal from '@/hooks/useModal';
import { Step } from '@/types/clothes';

// TODO 검색 완료 시 다음 스텝으로 이동
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchWithCode = ({ onClickButton }: { onClickButton: () => void }) => {
  const { Modal, openModal } = useModal();
  const { jumpStep } = useClothesStep();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSucces] = useState(false);

  // TODO 개발 완료 후 주석 삭제
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = (text: string) => {
    setIsLoading(true);
    openModal();

    // 임의 실패 코드
    setTimeout(() => {
      setIsLoading(false);
      setIsSucces(false);
    }, 3000);
  };

  useEffect(() => {
    if (isSuccess) onClickButton();
  }, [isSuccess, onClickButton]);

  const modalTitle = () => {
    if (isLoading) return '검색 중 입니다.';
    if (!isSuccess) return '옷을 찾는데에 실패했어요. 😥';
    return '옷을 선택해 주세요.';
  };

  const modalContent = () => {
    if (isLoading) return '';

    return (
      <Button
        variant="white"
        onClick={() => {
          jumpStep(Step.SELF_BASIC_FORM);
        }}
      >
        직접 등록하기
      </Button>
    );
  };

  return (
    <>
      <TextInputWithSearchButton
        label="품번"
        onClickSearchButton={({ text }) => {
          handleSearch(text);
        }}
      />

      <div id="modal">
        <Modal title={modalTitle()}>{modalContent()}</Modal>
      </div>
    </>
  );
};

export default SearchWithCode;

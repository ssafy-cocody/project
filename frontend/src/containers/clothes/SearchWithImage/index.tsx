'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import SearchResult from '@/containers/clothes/SearchResult';
import style from '@/containers/clothes/SearchWithImage/SearchWithImage.module.scss';
import useClothesStep from '@/hooks/useClothesStep';
import useModal from '@/hooks/useModal';
import { fetchPostClothesImage } from '@/services/clothes';
import { Step } from '@/types/clothes';

const SearchWithImage = ({ onClickButton }: { onClickButton: () => void }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Modal, openModal } = useModal();
  const { jumpStep } = useClothesStep();
  const [multipartFile, setMultipartFile] = useState<File>();

  const isValid = true;
  const isLoading = false;
  const isSuccess = false;

  const modalTitle = () => {
    if (isLoading) return '검색 중 입니다.';
    if (!isSuccess) return '옷을 찾는데에 실패했어요. 😥';
    return '옷을 선택해 주세요.';
  };

  const modalContent = () => {
    if (isLoading) return '';
    if (isSuccess) return <SearchResult onClick={onClickButton} />;

    return (
      <>
        <Button onClick={() => jumpStep(Step.SEARCH_WITH_CODE)}>품번으로 검색하기</Button>
        <Button variant="white" onClick={() => jumpStep(Step.SELF_BASIC_FORM)}>
          직접 등록하기
        </Button>
      </>
    );
  };

  const handleImageChange = (file: File) => {
    setMultipartFile(file);
  };

  const handleSearch = async () => {
    if (!multipartFile) return;

    const formData = new FormData();
    formData.append('multipartFile', multipartFile);

    try {
      const result = await fetchPostClothesImage({ formData });
      console.log(result);
    } catch (e) {
      // TODO 실패시 모달 오픈
      // openModal();
    }
  };

  return (
    <>
      <form className={style.form}>
        <ImageInput name="clotehs" id="clothes" onChange={handleImageChange} />
        <div className={style['tip-wrapper']}>
          <p className={style.tip}>💡 TIP. 옷을 가지런히 찍을수록 정확도가 높아집니다.</p>
        </div>
        <Button type="button" disabled={!isValid} onClick={handleSearch}>
          검색
        </Button>
      </form>

      <div id="modal">
        <Modal title={modalTitle()}>{modalContent()}</Modal>
      </div>
    </>
  );
};

export default SearchWithImage;

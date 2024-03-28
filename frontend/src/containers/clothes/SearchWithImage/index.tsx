'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import SearchResult from '@/containers/clothes/SearchResult';
import style from '@/containers/clothes/SearchWithImage/SearchWithImage.module.scss';
import useClothesStep from '@/hooks/useClothesStep';
import useModal from '@/hooks/useModal';
import { fetchGetClothesInfo, fetchPostClothesImage } from '@/services/clothes';
import { Step } from '@/types/clothes';

const SearchWithImage = ({ onClickButton }: { onClickButton: () => void }) => {
  const { Modal, openModal } = useModal();
  const { jumpStep } = useClothesStep();
  const [multipartFile, setMultipartFile] = useState<File>();
  const [clothesUuid, setClothesUuid] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const clothesSearchItemQuery = useQuery({
    queryKey: [''], // 캐싱할 필요가 없음
    queryFn: () => fetchGetClothesInfo({ uuid: clothesUuid }),
    enabled: !!clothesUuid,
  });

  const postClothesImage = useMutation({
    mutationFn: fetchPostClothesImage,
    onSuccess: (data) => {
      setClothesUuid(data.uuid);
    },
  });

  const isSuccess = clothesSearchItemQuery.isSuccess && !!clothesSearchItemQuery.data.length;
  const isSearching = postClothesImage.isPending || clothesSearchItemQuery.isPending; // 유사한 옷 검색 중

  const modalTitle = () => {
    if (isSearching) return '검색 중 입니다.';
    if (isSuccess) return '옷을 선택해 주세요.';
    return '옷을 찾는데에 실패했어요. 😥';
  };

  const modalContent = () => {
    if (isSearching) return '';
    if (isSuccess) return <SearchResult onClick={onClickButton} clothesList={clothesSearchItemQuery.data} />;
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
    setIsFormValid((prev) => !prev);
    setMultipartFile(file);
  };

  const handleSearch = async () => {
    if (!multipartFile || postClothesImage.isPending) return;

    const formData = new FormData();
    formData.append('multipartFile', multipartFile);

    postClothesImage.mutate({ formData });
    openModal();
  };

  return (
    <>
      <form className={style.form}>
        <ImageInput name="clotehs" id="clothes" onChange={handleImageChange} />
        <div className={style['tip-wrapper']}>
          <p className={style.tip}>💡 TIP. 옷을 가지런히 찍을수록 정확도가 높아집니다.</p>
        </div>
        <Button type="button" disabled={!isFormValid} onClick={handleSearch}>
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

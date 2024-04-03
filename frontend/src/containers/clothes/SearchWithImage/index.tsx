'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import LoadingFullScreen from '@/containers/clothes/LoadingFullScreen';
import SearchResult from '@/containers/clothes/SearchResult';
import style from '@/containers/clothes/SearchWithImage/SearchWithImage.module.scss';
import useClothesStep from '@/hooks/useClothesStep';
import useModal from '@/hooks/useModal';
import { fetchGetClothesInfo, fetchPostClothesImage } from '@/services/clothes';
import { IClothes, Step } from '@/types/clothes';

interface SearchWithImageProps {
  onSelectResult: (clothes: IClothes & { uuid: string }) => void;
  onClickSelfBasicForm: ({ uuid }: { uuid: string }) => void;
}

const getLoadingText = ({ isSearching, isPreparing }: { isSearching: boolean; isPreparing: boolean }) => {
  if (isPreparing || isSearching)
    return (
      <>
        옷 검색 중입니다. <br /> 잠시만 기다려주세요.
      </>
    );
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
};

const SearchWithImage = ({ onSelectResult, onClickSelfBasicForm }: SearchWithImageProps) => {
  const { Modal, openModal } = useModal();
  const { jumpStep } = useClothesStep();
  const [multipartFile, setMultipartFile] = useState<File>();
  const [clothesUuid, setClothesUuid] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const clothesSearchItemQuery = useQuery({
    queryKey: [{ clothesUuid }], // TODO uuid는 30분만 유효
    queryFn: () => fetchGetClothesInfo({ uuid: clothesUuid }),
    enabled: !!clothesUuid,
    retry: false,
  });

  const postClothesImage = useMutation({
    mutationFn: fetchPostClothesImage,
    onSuccess: (data) => {
      setClothesUuid(data.uuid);
    },
  });

  const isSuccess = clothesSearchItemQuery.isSuccess && !!clothesSearchItemQuery.data.length;
  const isPreparing = postClothesImage.isPending; // 옷 uuid 생성 중
  const isSearching = clothesSearchItemQuery.isLoading; // 유사한 옷 검색 중
  const isLoading = isPreparing || isSearching;
  const isFailSearching = isSearching && !isSuccess;

  const modalTitle = () => {
    if (isSuccess) return '옷을 선택해 주세요.';
    if (isFailSearching) return '옷을 찾는데에 실패했어요. 😥';
    return '';
  };

  const modalContent = () => {
    if (isSuccess)
      return (
        <SearchResult
          onSelect={(clothes) => onSelectResult({ ...clothes, uuid: clothesUuid })}
          onClickSelfBasicForm={() => onClickSelfBasicForm({ uuid: clothesUuid })}
          clothesList={clothesSearchItemQuery.data}
        />
      );
    if (isFailSearching)
      return (
        <>
          <Button onClick={() => jumpStep(Step.SEARCH_WITH_CODE)}>품번으로 검색하기</Button>
          <Button
            variant="white"
            onClick={() => {
              onClickSelfBasicForm({ uuid: clothesUuid });
            }}
          >
            직접 등록하기
          </Button>
        </>
      );
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
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
  };

  useEffect(() => {
    if (isSuccess || isFailSearching) {
      openModal();
    }
  }, [isSuccess, isFailSearching]);

  return (
    <>
      <LoadingFullScreen isLoading={isLoading} text={getLoadingText({ isSearching, isPreparing })} />

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

'use client';

import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import SearchResult from '@/containers/clothes/SearchResult';
import style from '@/containers/clothes/SearchWithImage/SearchWithImage.module.scss';
import useModal from '@/hooks/useModal';

const SearchWithImage = () => {
  const { Modal, openModal } = useModal();

  const isValid = true;
  const isSearching = false;

  const handleUpload = () => openModal();

  const modalTitle = isSearching ? '검색 중 입니다.' : '옷을 선택해 주세요.';
  const modalContent = isSearching ? '' : <SearchResult />;

  return (
    <>
      <form className={style.form}>
        <ImageInput name="clotehs" id="clothes" />
        <div className={style['tip-wrapper']}>
          <p className={style.tip}>💡 TIP. 옷을 가지런히 찍을수록 정확도가 높아집니다.</p>
        </div>
        <Button type="button" disabled={!isValid} onClick={handleUpload}>
          검색
        </Button>
      </form>

      <div id="modal">
        <Modal title={modalTitle}>{modalContent}</Modal>
      </div>
    </>
  );
};

export default SearchWithImage;

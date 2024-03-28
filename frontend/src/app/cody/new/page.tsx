/* eslint-disable no-template-curly-in-string */

'use client';

import { useState } from 'react';

import Background from '@/components/Background';
import Button from '@/components/Button';
import ClothesList from '@/components/ClothesList';
import ClothesTap from '@/components/ClothesTab';
import Header from '@/components/Header';
import SaveButton from '@/components/SaveButton';
import TostMessage from '@/components/TostMessage';
import CodyBoard from '@/containers/cody/new/CodyBoard';
import styles from '@/containers/cody/new/NewCody.module.scss';
import useModal from '@/hooks/useModal';
import { Category, IClothes, ISelectedClothes, TCategory } from '@/types/clothes';

const categoryOrder: (keyof TCategory)[] = [Category.TOP, Category.OUTER, Category.BOTTOM, Category.SHOES];

const Page = () => {
  const { Modal, openModal, closeModal } = useModal();
  const [selectedClothes, setSelectedClothes] = useState<ISelectedClothes>({});
  const [deleteClothes, setDeleteClothes] = useState<IClothes>();
  const [duplicatedCategory, setDuplicatedCategory] = useState<string | null>(null);

  const handleTostMessage = (category: string) => {
    setDuplicatedCategory(category);
    setTimeout(() => setDuplicatedCategory(null), 1000);
  };

  const handleSelectedClothes = (newlyClickedClothes: IClothes) => {
    const { category } = newlyClickedClothes;
    if (Object.keys(selectedClothes).filter((key) => key === category).length) {
      handleTostMessage(category!);
    } else {
      const newSelectedClothes = { ...selectedClothes, [category!]: newlyClickedClothes };
      setSelectedClothes(
        categoryOrder.reduce((sortedClothes: ISelectedClothes, key) => {
          if (newSelectedClothes[key]) {
            sortedClothes[key] = newSelectedClothes[key];
          }
          return sortedClothes;
        }, {}),
      );
    }
  };

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header previousLink="/cody" title="내 코디 만들기" RightComponent={<SaveButton />} />
      <main className={styles['main-container']}>
        <CodyBoard
          onClickDeleteClothes={openModal}
          selectedClothes={selectedClothes}
          setDeleteClothes={setDeleteClothes}
        />
        <ClothesTap />
        <ClothesList className={`${styles.overflow}`} onSelectClothes={handleSelectedClothes} />
      </main>
      {duplicatedCategory && <TostMessage tostMessage={`${duplicatedCategory}는 하나만 등록할 수 있어요`} />}
      <div id="modal">
        <Modal title="보드에서 삭제하시겠습니까?">
          <div className={styles['modal-button']}>
            <Button
              onClick={() => {
                const { category } = deleteClothes || {};
                setSelectedClothes(
                  Object.keys(selectedClothes).reduce((result: ISelectedClothes, key: string) => {
                    if (key !== category) {
                      result[key] = selectedClothes[key];
                    }
                    return result;
                  }, {}),
                );
                setDeleteClothes(undefined);
                closeModal();
              }}
            >
              네
            </Button>
            <Button
              onClick={() => {
                setDeleteClothes(undefined);
                closeModal();
              }}
              variant="white"
            >
              아니오
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Page;

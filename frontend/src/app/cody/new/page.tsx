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
import { ClosetCategory, CLOTHES_TAB, ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';

const categoryOrder: (keyof typeof ClothesCategory)[] = [
  ClothesCategory.TOP,
  ClothesCategory.OUTER,
  ClothesCategory.BOTTOM,
  ClothesCategory.SHOES,
];

const Page = () => {
  const { Modal, openModal, closeModal } = useModal();
  const [selectedClothes, setSelectedClothes] = useState<ISelectedClothes>({});
  const [deleteClothes, setDeleteClothes] = useState<IClothes>();
  const [duplicatedCategory, setDuplicatedCategory] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<keyof typeof ClosetCategory>(CLOTHES_TAB.ALL);

  const handleTostMessage = (category: string) => {
    setDuplicatedCategory(category);
    setTimeout(() => setDuplicatedCategory(null), 1000);
  };

  const filterCategory = (category: keyof typeof ClothesCategory) => {
    if (category === 'ONEPIECE') return 'TOP';
    return category;
  };

  const handleSelectedClothes = (newlyClickedClothes: IClothes) => {
    const category = filterCategory(newlyClickedClothes.category!);
    if (Object.keys(selectedClothes).filter((key) => key === category).length) {
      if (category === 'TOP') {
        handleTostMessage('상의/원피스');
      } else {
        handleTostMessage(ClosetCategory[category]!);
      }
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
      <Header hasPreviousLink title="내 코디 만들기" RightComponent={<SaveButton />} />
      <main className={styles['main-container']}>
        <CodyBoard
          onClickDeleteClothes={openModal}
          selectedClothes={selectedClothes}
          setDeleteClothes={setDeleteClothes}
        />
        <ClothesTap currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
        <ClothesList
          className={`${styles.overflow}`}
          onSelectClothes={handleSelectedClothes}
          currentCategory={currentCategory}
        />
      </main>
      {duplicatedCategory && <TostMessage tostMessage={`${duplicatedCategory}는 하나만 등록할 수 있어요`} />}
      <div id="modal">
        <Modal title="보드에서 삭제하시겠습니까?">
          <div className={styles['modal-button']}>
            <Button
              onClick={() => {
                const category = filterCategory(deleteClothes?.category!);
                setSelectedClothes(
                  Object.keys(selectedClothes).reduce((result, key) => {
                    if (key !== category) {
                      const newResult = { ...result, [key]: { ...selectedClothes[key as keyof ISelectedClothes] } };
                      return newResult;
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

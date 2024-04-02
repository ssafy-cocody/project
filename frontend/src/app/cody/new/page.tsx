/* eslint-disable no-template-curly-in-string */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
import { fetchPostCody } from '@/services/cody';
import { ClosetCategory, CLOTHES_TAB, ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';
import { NewCodyKey } from '@/types/cody';

const categoryOrder: (keyof typeof ClothesCategory)[] = [
  ClothesCategory.TOP,
  ClothesCategory.OUTER,
  ClothesCategory.BOTTOM,
  ClothesCategory.SHOES,
];

const Page = () => {
  const router = useRouter();
  const { Modal, openModal, closeModal } = useModal();
  const [selectedClothes, setSelectedClothes] = useState<ISelectedClothes>({});
  const [removeClothes, setRemoveClothes] = useState<IClothes>();
  const [currentCategory, setCurrentCategory] = useState<keyof typeof ClosetCategory>(CLOTHES_TAB.ALL);
  const [codyName, setCodyName] = useState<string>('');
  const [tostMessage, setTostMessage] = useState('');

  const handleTostMessage = (message: string) => {
    setTostMessage(message);
    setTimeout(() => setTostMessage(''), 1000);
  };

  const filterCategory = (category: keyof typeof ClothesCategory) => {
    if (category === 'ONEPIECE') return 'TOP';
    return category;
  };

  const handleSelectedClothes = (newlyClickedClothes: IClothes) => {
    const category = filterCategory(newlyClickedClothes.category!);
    if (Object.keys(selectedClothes).filter((key) => key === category).length) {
      if (category === 'TOP') {
        handleTostMessage('상의/원피스는 하나만 등록할 수 있어요');
      } else {
        handleTostMessage(`${ClosetCategory[category]!}는 하나만 등록할 수 있어요`);
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

  const selectedClothesToClothesRequest = () => {
    return Object.keys(selectedClothes).reduce((clothesRequest, category) => {
      const categoryKey = NewCodyKey[category as keyof typeof ClothesCategory];
      return { ...clothesRequest, [categoryKey]: selectedClothes[category as keyof typeof ClothesCategory]?.clothesId };
    }, {});
  };

  const queryClient = useQueryClient();
  const codyMutation = useMutation({
    mutationFn: () => fetchPostCody({ clothesPythonRequest: selectedClothesToClothesRequest(), name: codyName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['CodyListQueryKey'] });
      router.push('/cody');
    },
  });

  const handleSaveButton = () => {
    if (!Object.keys(selectedClothes).length) {
      handleTostMessage('옷을 선택해주세요');
    } else if (!codyName) {
      handleTostMessage('코디명을 입력해주세요');
    }
    if (codyName && Object.keys(selectedClothes).length) {
      codyMutation.mutate();
    }
  };

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header
        hasPreviousLink
        title="내 코디 만들기"
        RightComponent={<SaveButton onClick={handleSaveButton}>저장</SaveButton>}
      />
      <main className={styles['main-container']}>
        <CodyBoard
          onClickRemoveClothes={openModal}
          selectedClothes={selectedClothes}
          setRemoveClothes={setRemoveClothes}
          codyName={codyName}
          setCodyName={setCodyName}
        />
        <ClothesTap currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
        <ClothesList
          className={`${styles.overflow}`}
          onSelectClothes={handleSelectedClothes}
          currentCategory={currentCategory}
        />
      </main>
      {tostMessage && <TostMessage tostMessage={tostMessage} />}
      <div id="modal">
        <Modal title="보드에서 삭제하시겠습니까?">
          <div className={styles['modal-button']}>
            <Button
              onClick={() => {
                const category = filterCategory(removeClothes?.category!);
                setSelectedClothes(
                  Object.keys(selectedClothes).reduce((result, key) => {
                    if (key !== category) {
                      const newResult = { ...result, [key]: { ...selectedClothes[key as keyof ISelectedClothes] } };
                      return newResult;
                    }
                    return result;
                  }, {}),
                );
                setRemoveClothes(undefined);
                closeModal();
              }}
            >
              네
            </Button>
            <Button
              onClick={() => {
                setRemoveClothes(undefined);
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

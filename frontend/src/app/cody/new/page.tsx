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
import { ISelectedClothes } from '@/containers/cody/new/type';
import useModal from '@/hooks/useModal';
import { IClothes } from '@/types/clothes';

const Page = () => {
  const { Modal, openModal, closeModal } = useModal();
  const [selectedClothes, setSelectedClothes] = useState<ISelectedClothes>({});
  const [deleteClothes, setDeleteClothes] = useState<IClothes>();

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
        <ClothesList
          className={`${styles.overflow}`}
          selectedClothes={selectedClothes}
          setSelectedClothes={setSelectedClothes}
        />
      </main>
      <TostMessage tostMessage="상의는 하나만 등록할 수 있어요" />
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

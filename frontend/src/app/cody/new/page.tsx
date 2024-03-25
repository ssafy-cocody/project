/* eslint-disable no-template-curly-in-string */

'use client';

import { useEffect, useState } from 'react';

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
  const { Modal, openModal } = useModal();
  const [selectedClothes, setSelectedClothes] = useState<ISelectedClothes>({});
  const [deleteClothes, setDeleteClothes] = useState<IClothes>();

  useEffect(() => {
    if (deleteClothes) {
      // console.log(selectedClothes['상의']);
      console.log(deleteClothes.category);
      console.log(selectedClothes[deleteClothes.category]);
    }

    console.log(
      Object.keys(selectedClothes).reduce((remainClothes, category) => {
        return { ...remainClothes, category };
      }, {}),
    );
  }, [selectedClothes]);

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header previousLink="/cody" title="내 코디 만들기" RightComponent={<SaveButton />} />
      <main className={styles['main-container']}>
        <CodyBoard handleModal={openModal} selectedClothes={selectedClothes} setDeleteClothes={setDeleteClothes} />
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
            <Button onClick={() => {}}>네</Button>
            <Button variant="white">아니오</Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Page;

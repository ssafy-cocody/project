/* eslint-disable no-template-curly-in-string */

'use client';

import Background from '@/components/background';
import ClothesList from '@/components/ClothesList';
import ClothesTap from '@/components/ClothesList/ClothesTab';
import Header from '@/components/Header';
import SaveButton from '@/components/SaveButton';
import TostMessage from '@/components/TostMessage';
import CodyBoard from '@/containers/cody/new/CodyBoard';
import styles from '@/containers/cody/new/NewCody.module.scss';
import useModal from '@/hooks/useModal';

const Page = () => {
  const { Modal, openModal } = useModal();

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header previousLink="/cody" title="내 코디 만들기" RightComponent={<SaveButton />} />
      <main className={styles['main-container']}>
        <CodyBoard handleModal={openModal} />
        <ClothesTap />
        <ClothesList className={`${styles.overflow}`} />
      </main>
      <TostMessage tostMessage="상의는 하나만 등록할 수 있어요" />
      <div id="modal">
        <Modal title="보드에서 삭제하시겠습니까?" />
      </div>
    </>
  );
};

export default Page;

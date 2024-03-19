'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Background from '@/components/background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import styles from '@/containers/cody/Cody.module.scss';
import useModal from '@/hooks/useModal';

import { PlusIcon } from '../../../public/svgs';

const Page = () => {
  const [codies] = useState(['/images/test1.jpg', '/images/test2.jpg', '/images/test3.jpg', '/images/test4.jpg']);
  const { Modal, openModal } = useModal();

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header title="나의 코디" previousLink="/closet" />
      <main className={styles['main-container']}>
        <div className={styles['cody-container']}>
          <Link href="/cody/new" className={styles['new-cody']}>
            <PlusIcon stroke="black" />
          </Link>
          <div className={styles['cody-name']}>새 코디 등록</div>
        </div>
        {codies.map((cody) => {
          return (
            <button type="button" onClick={openModal} key={cody} className={styles['cody-container']}>
              <div className={styles['cody-image-container']}>
                <Image src={cody} alt="코디" fill className={styles['cody-image']} />
              </div>
              <div className={styles['cody-name']}>새 코디 등록</div>
            </button>
          );
        })}
      </main>
      <div id="modal">
        <Modal>
          <div className={styles['modal-container']}>
            <div className={styles['selected-clothes']}>
              <Image src="/images/test1.jpg" alt="옷" fill />
            </div>
            <div className={styles['modal-button']}>
              <Button>
                <span className={styles['button-text']}>내일의 OOTD로 등록</span>
              </Button>
              <Button variant="white">
                <span className={styles['button-text']}>코디 삭제</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Page;

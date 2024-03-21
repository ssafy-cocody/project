/* eslint-disable react/no-unused-prop-types */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import Background from '@/components/Background';
import Button from '@/components/Button';
import ClothesList from '@/components/ClothesList';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import styles from '@/containers/closet/Closet.module.scss';
import useModal from '@/hooks/useModal';
import useScrollDirection from '@/hooks/useScrollDirection';

import { PlusIcon, RightArrow } from '../../../public/svgs';

interface ICody {
  codyUrl: string;
  codyName: string;
}

const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToTop, setScrolled] = useState<boolean>(false);
  const [isNavShow, setNavShow] = useState<boolean>(true);

  useScrollDirection(
    scrollRef,
    () => {
      setScrolled(false);
      setTimeout(() => setNavShow(false), 500);
    },
    () => {
      setNavShow(true);
      setScrolled(true);
    },
  );

  const { Modal, openModal } = useModal();
  const [codies] = useState<ICody[]>([
    {
      codyUrl: '/images/test1.jpg',
      codyName: '데이트룩1',
    },
    {
      codyUrl: '/images/test2.jpg',
      codyName: '데이트룩2',
    },
    {
      codyUrl: '/images/test3.jpg',
      codyName: '출근룩1',
    },
    {
      codyUrl: '/images/test4.jpg',
      codyName: '집앞마실룩1',
    },
  ]);

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header title="옷장" />
      <main ref={scrollRef} className={styles['main-container']}>
        <div className={styles['cody-container']}>
          <div className={styles['cody-title-container']}>
            <h1 className={styles['cody-title']}>나의 코디</h1>
            <Link href="/cody" className={styles['show-all-button']}>
              <span className={styles['button-text']}>전체보기</span>
              <div className={styles['arrow-wrapper']}>
                <RightArrow />
              </div>
            </Link>
          </div>
          <div className={styles['cody-scroll']}>
            {codies.map(({ codyUrl, codyName }: ICody) => {
              return (
                <div key={codyName} className={styles.cody}>
                  <div className={styles['cody-image-container']}>
                    <Image src={codyUrl} alt={codyName} fill className={styles['cody-image']} />
                  </div>
                  <div className={styles['cody-name']}>{codyName}</div>
                </div>
              );
            })}
          </div>
        </div>
        <ClothesList handleClick={openModal} />
        <Link href="/clothes" className={styles['upload-button']}>
          <PlusIcon stroke="#EDEDED" />
        </Link>
      </main>
      {isNavShow && <Nav className={`${isScrolledToTop ? styles.scrollToTop : styles.scrollToBottom}`} />}
      <div id="modal">
        <Modal title="이 아이템을 삭제하시겠습니까?">
          <div className={styles['modal-container']}>
            <div className={styles['delete-clothes']}>
              <Image src="/images/test1.jpg" alt="옷" fill />
            </div>
            <div className={styles['delete-button']}>
              <Button>
                <span className={styles['button-text']}>네</span>
              </Button>
              <Button variant="white">
                <span className={styles['button-text']}>아니오</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Page;

/* eslint-disable react/no-unused-prop-types */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import Background from '@/components/background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Nav from '@/components/nav';
import styles from '@/containers/closet/Closet.module.scss';
import useModal from '@/hooks/useModal';

import { PlusIcon, RightArrow } from '../../../public/svgs';

interface ICody {
  codyUrl: string;
  codyName: string;
}

interface IClothes {
  clothesId: Number;
  image: string;
}

const Page = () => {
  const tabs = useRef(['전체', '상의', '하의', '원피스', '아우터', '신발']);
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
  const [clothes] = useState<IClothes[]>([
    { clothesId: 0, image: '/images/test1.jpg' },
    { clothesId: 2, image: '/images/test2.jpg' },
    { clothesId: 3, image: '/images/test3.jpg' },
    { clothesId: 4, image: '/images/test4.jpg' },
    { clothesId: 5, image: '/images/test1.jpg' },
    { clothesId: 6, image: '/images/test2.jpg' },
    { clothesId: 7, image: '/images/test3.jpg' },
    { clothesId: 8, image: '/images/test4.jpg' },
    { clothesId: 9, image: '/images/test1.jpg' },
    { clothesId: 10, image: '/images/test2.jpg' },
    { clothesId: 11, image: '/images/test3.jpg' },
    { clothesId: 12, image: '/images/test4.jpg' },
    { clothesId: 110, image: '/images/test1.jpg' },
    { clothesId: 112, image: '/images/test2.jpg' },
    { clothesId: 113, image: '/images/test3.jpg' },
    { clothesId: 114, image: '/images/test4.jpg' },
    { clothesId: 115, image: '/images/test1.jpg' },
    { clothesId: 116, image: '/images/test2.jpg' },
    { clothesId: 117, image: '/images/test3.jpg' },
    { clothesId: 118, image: '/images/test4.jpg' },
    { clothesId: 119, image: '/images/test1.jpg' },
    { clothesId: 1110, image: '/images/test2.jpg' },
    { clothesId: 1111, image: '/images/test3.jpg' },
    { clothesId: 1112, image: '/images/test4.jpg' },
  ]);
  const [selectedCategory] = useState<string>('전체');
  const { Modal, openModal } = useModal();

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header title="옷장" />
      <main className={styles['main-container']}>
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
        <div className={styles['tab-container']}>
          {tabs.current.map((category) => {
            return (
              <div
                key={category}
                className={`${styles.tab} ${selectedCategory === category ? styles['selected-category'] : ''}`}
              >
                {category}
              </div>
            );
          })}
        </div>
        <div className={styles['closet-container']}>
          <div className={styles['clothes-container']}>
            {clothes.map(({ clothesId, image }: IClothes) => {
              return (
                <button
                  type="button"
                  className={styles['clothes-image-container']}
                  key={clothesId.toString()}
                  onClick={openModal}
                >
                  <Image src={image} alt={clothesId.toString()} fill className={styles.clothes} />
                </button>
              );
            })}
          </div>
        </div>
        <Link href="/clothes" className={styles['upload-button']}>
          <PlusIcon />
        </Link>
      </main>
      <Nav />
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

/* eslint-disable react/no-unused-prop-types */

'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

import { PlusIcon, RightArrow } from '@/../public/svgs';
import Background from '@/components/Background';
import Button from '@/components/Button';
import ClothesList from '@/components/ClothesList';
import ClothesTap from '@/components/ClothesTab';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import styles from '@/containers/closet/Closet.module.scss';
import useModal from '@/hooks/useModal';
import { fetchGetCody } from '@/services/cody';
import { ICody } from '@/types/cody';

const Page = () => {
  const { Modal, openModal } = useModal();
  const { data } = useQuery({
    queryKey: ['CodyQueryKey'],
    queryFn: () => fetchGetCody({}),
  });

  return (
    <>
      <main className={styles['main-container']}>
        <Background $backgroundColor="purple" />
        <Header title="옷장" />
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
            {data?.content.map(({ image, name }: ICody) => {
              return (
                <div key={name} className={styles.cody}>
                  <div className={styles['cody-image-container']}>
                    <Image src={image} alt={name} fill className={styles['cody-image']} />
                  </div>
                  <div className={styles['cody-name']}>{name}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles['closet-tab-container']}>
          <ClothesTap />
        </div>
        <div className={styles['list-padding']}>
          <ClothesList handleModal={openModal} />
        </div>
        <Link href="/clothes" className={styles['upload-button']}>
          <PlusIcon stroke="#EDEDED" />
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

/* eslint-disable react/no-unused-prop-types */

'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PlusIcon, RightArrow } from '@/../public/svgs';
import Background from '@/components/Background';
import Button from '@/components/Button';
import ClothesList from '@/components/ClothesList';
import ClothesTap from '@/components/ClothesTab';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import styles from '@/containers/closet/Closet.module.scss';
import useModal from '@/hooks/useModal';
import { fetchDeleteClothes } from '@/services/closet';
import { fetchGetCody } from '@/services/cody';
import { ClosetCategory, CLOTHES_TAB, IClothes } from '@/types/clothes';
import { ICody } from '@/types/cody';

const Page = () => {
  const [currentCategory, setCurrentCategory] = useState<keyof typeof ClosetCategory>(CLOTHES_TAB.ALL);
  const { Modal, openModal, closeModal } = useModal();
  const [closet, setCloset] = useState<ICody[]>([]);
  const { data, refetch } = useQuery({
    queryKey: ['CodyQueryKey'],
    queryFn: () => fetchGetCody({}),
  });

  const [deleteClothes, setDeleteClothes] = useState<IClothes>();
  const mutation = useMutation({
    mutationFn: () => fetchDeleteClothes({ clothesId: deleteClothes!.clothesId }),
  });

  const handleSelectClothes = (item: IClothes) => {
    setDeleteClothes(item);
  };
  const handleClothesDelete = async () => {
    await mutation.mutateAsync();
    refetch();
  };

  useEffect(() => {
    if (data?.content) {
      setCloset(data.content);
    }
  }, [data]);

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
            {closet.length &&
              closet.map(({ image, name }: ICody) => {
                return (
                  <div key={name} className={styles.cody}>
                    <div className={styles['cody-image-container']}>
                      <Image src={image} alt={name} fill className={styles['cody-image']} />
                    </div>
                    <div className={styles['cody-name']}>{name}</div>
                  </div>
                );
              })}
            {!closet.length && (
              <Link href="/cody/new" className={styles['empty-cody']}>
                코디 채우러 가기
                <Image src="/images/magicWand.png" width={25} height={25} alt="코디채우러가기" />
              </Link>
            )}
          </div>
        </div>
        <div className={styles['closet-tab-container']}>
          <ClothesTap currentCategory={currentCategory || CLOTHES_TAB.ALL} setCurrentCategory={setCurrentCategory} />
        </div>
        <div className={styles['list-padding']}>
          <ClothesList
            handleModal={openModal}
            onSelectClothes={handleSelectClothes}
            currentCategory={currentCategory}
          />
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
              <Image src={deleteClothes?.image || ''} alt={deleteClothes?.name || ''} fill />
            </div>
            <div className={styles['delete-button']}>
              <Button onClick={handleClothesDelete}>
                <span className={styles['button-text']}>네</span>
              </Button>
              <Button variant="white" onClick={closeModal}>
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

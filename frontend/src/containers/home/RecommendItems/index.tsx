'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// import { RightArrow } from '@/../public/svgs';
import Button from '@/components/Button';
import styles from '@/containers/home/RecommendItems/Items.module.scss';
import useModal from '@/hooks/useModal';
import { BASE_URL, getAccessToken } from '@/services';
import { fetchPostClothes } from '@/services/home';
import { todayTempAtom } from '@/stores/home';
import { IRecommendItem } from '@/types/clothes';

const RecommendItems = () => {
  const todayTemp = useAtomValue(todayTempAtom);

  const [recommendItems, setRecommendItems] = useState<IRecommendItem[]>([]); // TODO: 현재 1개만 추천 받음. 추천 받을 떄마다 새로운 요청
  const [currentItem] = useState(0);
  const [isToggled, toggle] = useState<boolean>(false);
  const { Modal, openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const clothesMutation = useMutation({
    mutationFn: fetchPostClothes,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['ClothesQueryKey'] }); // 아이템 구매 후 옷장 업데이트
    },
  });

  const handleBuyItem = () => {
    openModal();
  };

  /**
   * 구매 확정
   */
  const handleConfirmBuyItem = (clothesId: number) => {
    if (clothesMutation.isPending) return;

    clothesMutation.mutate({ clothesId });
  };

  useEffect(() => {
    if (!todayTemp) return;

    const eventSource = new EventSourcePolyfill(`${BASE_URL}/auth/v1/cody/recommend/item?temp=${todayTemp}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as Record<string, IRecommendItem>;
      setRecommendItems((prev) => [...prev, data]);
      eventSource.close();
    };
  }, [todayTemp]);

  const isLoading = recommendItems.length === 0;

  return (
    <>
      <div className={styles['recommend-items-container']}>
        <h1 className={styles.title}>코코디가 추천하는 아이템</h1>
        {/** TODO: 다음 아이템 보여주기 <button
          type="button"
          onClick={() => setCurrentItem((currentItem + 1) % recommendItems.length)}
          className={styles['next-button']}
          <RightArrow />
        </button>
  > */}
        <div className={styles['items-info']}>
          <button
            type="button"
            onClick={() => toggle(false)}
            className={`${styles.info} ${styles.item} ${isToggled ? styles.under : styles.over}`}
          >
            {isLoading && <>추천 아이템 준비중 ₊⁺</>}
            {!isLoading && (
              <>
                <div className={styles['item-image']}>
                  <Image src={recommendItems[currentItem].recommendClothesImage!} alt="추천 상품 이미지" fill />
                </div>
                <div className={styles['brand-name']}>{recommendItems[currentItem].brand}</div>
                <div className={styles['item-name']}>{recommendItems[currentItem].name}</div>
                <div className={styles.price}>{recommendItems[currentItem].price!}원</div>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => toggle(true)}
            className={`${styles.info} ${styles.cody} ${isToggled ? styles.over : styles.under}`}
          >
            {isLoading && <>추천 아이템 준비중 ₊⁺</>}
            {!isLoading && (
              <div className={styles['cody-image']}>
                <Image src={recommendItems[currentItem].image!} alt="추천 상품 코디 이미지" fill />
              </div>
            )}
          </button>
        </div>
        <div className={styles['buy-button']}>
          {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
          {isLoading && <></>}
          {!isLoading && (
            <Link href={recommendItems[currentItem].link!} target="_blank">
              <Button onClick={handleBuyItem}>
                <span className={styles['button-text']}>아이템 사러 가기</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div id="modal">
        <Modal title="이 옷 구매하셨나요?">
          <div className={styles['modal-container']}>
            <div className={styles['recommend-item-image']}>
              {!isLoading && (
                <Image src={recommendItems[currentItem].recommendClothesImage!} alt="추천 상품 이미지" fill />
              )}
            </div>
            <div className={styles['button-container']}>
              <Button
                onClick={() => {
                  if (!recommendItems[currentItem]?.recommendId) return;

                  const recommendId = Number(recommendItems[currentItem].recommendId!);
                  handleConfirmBuyItem(recommendId);
                }}
              >
                <span className={styles['button-text']}>네</span>
              </Button>
              <Button variant="white" onClick={() => closeModal()}>
                <span className={styles['button-text']}>아니오</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RecommendItems;

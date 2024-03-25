'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { RightArrow } from '@/../public/svgs';
import Button from '@/components/Button';
import styles from '@/containers/home/RecommendItems/Items.module.scss';
import useModal from '@/hooks/useModal';

const RecommendItems = () => {
  const [recommendItems] = useState([
    {
      itemUrl: '/images/test1.jpg',
      brandName: '폴로 랄프 로렌',
      itemName: '페어 아일 코튼 블렌드 스웨터 베스트',
      price: 536928,
      codyUrl: '/images/test1.jpg',
      buyUrl: 'https://google.com',
    },
    {
      itemUrl: '/images/test2.jpg',
      brandName: '폴로 랄프 로렌',
      itemName: '페어 아일 코튼 블렌드 스웨터 베스트',
      price: 536928,
      codyUrl: '/images/test2.jpg',
      buyUrl: 'https://google.com',
    },
    {
      itemUrl: '/images/test3.jpg',
      brandName: '폴로 랄프 로렌',
      itemName: '페어 아일 코튼 블렌드 스웨터 베스트',
      price: 536928,
      codyUrl: '/images/test3.jpg',
      buyUrl: 'https://google.com',
    },
    {
      itemUrl: '/images/test4.jpg',
      brandName: '폴로 랄프 로렌',
      itemName: '페어 아일 코튼 블렌드 스웨터 베스트',
      price: 536928,
      codyUrl: '/images/test4.jpg',
      buyUrl: 'https://google.com',
    },
    {
      itemUrl: '/images/test5.jpg',
      brandName: '폴로 랄프 로렌',
      itemName: '페어 아일 코튼 블렌드 스웨터 베스트',
      price: 536928,
      codyUrl: '/images/test5.jpg',
      buyUrl: 'https://google.com',
    },
  ]);
  const [currentItem, setCurrentItem] = useState(0);
  const [isToggled, toggle] = useState<boolean>(false);
  const { Modal, openModal } = useModal();

  const handleBuyItem = () => {
    openModal();
  };

  return (
    <>
      <div className={styles['recommend-items-container']}>
        <h1 className={styles.title}>코코디가 추천하는 아이템</h1>
        <button
          type="button"
          onClick={() => setCurrentItem((currentItem + 1) % recommendItems.length)}
          className={styles['next-button']}
        >
          <RightArrow />
        </button>
        <div className={styles['items-info']}>
          <button
            type="button"
            onClick={() => toggle(false)}
            className={`${styles.info} ${styles.item} ${isToggled ? styles.under : styles.over}`}
          >
            <div className={styles['item-image']}>
              <Image src={recommendItems[currentItem].itemUrl} alt="추천 상품 이미지" fill />
            </div>
            <div className={styles['brand-name']}>{recommendItems[currentItem].brandName}</div>
            <div className={styles['item-name']}>{recommendItems[currentItem].itemName}</div>
            <div className={styles.price}>{recommendItems[currentItem].price.toLocaleString()}원</div>
          </button>
          <button
            type="button"
            onClick={() => toggle(true)}
            className={`${styles.info} ${styles.cody} ${isToggled ? styles.over : styles.under}`}
          >
            <div className={styles['cody-image']}>
              <Image src={recommendItems[currentItem].codyUrl} alt="추천 상품 코디 이미지" fill />
            </div>
          </button>
        </div>
        <div className={styles['buy-button']}>
          <Link href={recommendItems[currentItem].buyUrl} target="_blank">
            <Button onClick={handleBuyItem}>
              <span className={styles['button-text']}>아이템 사러 가기</span>
            </Button>
          </Link>
        </div>
      </div>
      <div id="modal">
        <Modal title="이 옷 구매하셨나요?">
          <div className={styles['modal-container']}>
            <div className={styles['recommend-item-image']}>
              <Image src={recommendItems[currentItem].itemUrl} alt="추천 상품 이미지" fill />
            </div>
            <div className={styles['button-container']}>
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

export default RecommendItems;

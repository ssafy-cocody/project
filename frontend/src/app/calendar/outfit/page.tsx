/* eslint-disable no-nested-ternary */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

import { CheckIcon } from '@/../public/svgs';
import Background from '@/components/Background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import styles from '@/containers/calendar/Outfit/Outfit.module.scss';
import { ClosetCategory, ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';

const Page = () => {
  const [clothesByCategory] = useState({
    [ClothesCategory.OUTER]: [
      { image: '/images/test2.jpg', clothesId: 11, category: ClothesCategory.OUTER },
      { image: '/images/test4.jpg', clothesId: 12, category: ClothesCategory.OUTER },
      { image: '/images/test3.jpg', clothesId: 13, category: ClothesCategory.OUTER },
    ],
    [ClothesCategory.TOP]: [
      { image: '/images/test1.jpg', clothesId: 1, category: ClothesCategory.TOP },
      { image: '/images/test2.jpg', clothesId: 2, category: ClothesCategory.TOP },
      { image: '/images/test3.jpg', clothesId: 3, category: ClothesCategory.TOP },
    ],
    [ClothesCategory.BOTTOM]: [
      { image: '/images/test2.jpg', clothesId: 4, category: ClothesCategory.BOTTOM },
      { image: '/images/test4.jpg', clothesId: 5, category: ClothesCategory.BOTTOM },
      { image: '/images/test3.jpg', clothesId: 6, category: ClothesCategory.BOTTOM },
    ],
    [ClothesCategory.SHOES]: [
      { image: '/images/test2.jpg', clothesId: 8, category: ClothesCategory.SHOES },
      { image: '/images/test4.jpg', clothesId: 9, category: ClothesCategory.SHOES },
      { image: '/images/test3.jpg', clothesId: 10, category: ClothesCategory.SHOES },
    ],
  });

  const [categories] = useState([
    ClothesCategory.OUTER,
    ClothesCategory.TOP,
    ClothesCategory.BOTTOM,
    ClothesCategory.SHOES,
  ]);

  const [selected, setSelected] = useState<ISelectedClothes>({});

  const handleClickItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newSelected = { ...selected, [e.target.value]: { clothesId: Number(e.target.id) } };
    setSelected(newSelected);
  };

  return (
    <>
      <Background $backgroundColor="skyBlue" />
      <Header title="내 코디 올리기" hasPreviousLink />
      <main className={styles['main-container']}>
        <div className={styles['taken-image-container']}>
          <Image src="/images/test3.jpg" alt="내가 올린 코디 사진" fill className={styles['taken-image']} />
        </div>
        <div className={styles['clothes-picker']}>
          {categories.map((category) => {
            return (
              <div key={category} className={styles['clothes-by-category']}>
                <div className={styles.category}>{ClosetCategory[category]}</div>
                <div className={styles.clothes}>
                  {clothesByCategory[category].map(({ image, clothesId }: IClothes, index) => {
                    return (
                      <div className={styles['clothes-image-container']} key={clothesId}>
                        <label htmlFor={clothesId.toString()}>
                          <Image
                            src={image!}
                            alt={`${category}${index + 1}`}
                            fill
                            className={styles['clothes-image']}
                          />
                          <div
                            className={`${styles['checked-icon-overlay']} ${selected[category]?.clothesId === clothesId ? styles.visible : ''}`}
                          />
                          <div
                            className={`${styles['checked-icon']} ${selected[category]?.clothesId === clothesId ? styles.visible : ''}`}
                          >
                            <CheckIcon />
                          </div>
                        </label>
                        <input
                          type="radio"
                          id={clothesId.toString()}
                          value={category}
                          radioGroup={category}
                          onChange={handleClickItem}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles['regist-button-container']}>
          <div className={styles['regist-button']}>
            <Link href="/calendar">
              <Button>등록</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;

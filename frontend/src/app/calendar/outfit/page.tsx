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
import { Category, IClothes, ISelectedClothes } from '@/types/clothes';

const Page = () => {
  const [clothesByCategory] = useState<Record<string, IClothes[]>>({
    [Category.TOP]: [
      { clothesImage: '/images/test1.jpg', clothesId: 1, category: Category.TOP },
      { clothesImage: '/images/test2.jpg', clothesId: 2, category: Category.TOP },
      { clothesImage: '/images/test3.jpg', clothesId: 3, category: Category.TOP },
    ],
    [Category.BOTTOM]: [
      { clothesImage: '/images/test2.jpg', clothesId: 4, category: Category.BOTTOM },
      { clothesImage: '/images/test4.jpg', clothesId: 5, category: Category.BOTTOM },
      { clothesImage: '/images/test3.jpg', clothesId: 6, category: Category.BOTTOM },
    ],
    [Category.SHOES]: [
      { clothesImage: '/images/test2.jpg', clothesId: 8, category: Category.SHOES },
      { clothesImage: '/images/test4.jpg', clothesId: 9, category: Category.SHOES },
      { clothesImage: '/images/test3.jpg', clothesId: 10, category: Category.SHOES },
    ],
  });
  const [categories] = useState<string[]>([Category.TOP, Category.BOTTOM, Category.SHOES]);
  const [selected, setSelected] = useState<ISelectedClothes>({});

  const handleClickItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newSelected: ISelectedClothes = { ...selected };
    newSelected[e.target.value] = { clothesId: Number(e.target.id) };
    setSelected(newSelected);
  };

  return (
    <>
      <Background $backgroundColor="skyBlue" />
      <Header title="내 코디 올리기" previousLink="/calendar" />
      <main className={styles['main-container']}>
        <div className={styles['taken-image-container']}>
          <Image src="/images/test3.jpg" alt="내가 올린 코디 사진" fill className={styles['taken-image']} />
        </div>
        <div className={styles['clothes-picker']}>
          {categories.map((category) => {
            return (
              <div key={category} className={styles['clothes-by-category']}>
                <div className={styles.category}>{category}</div>
                <div className={styles.clothes}>
                  {clothesByCategory[category].map(({ clothesImage, clothesId }: IClothes, index) => {
                    return (
                      <div className={styles['clothes-image-container']} key={clothesId}>
                        <label htmlFor={clothesId.toString()}>
                          <Image
                            src={clothesImage!}
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
                          value={category.toString()}
                          radioGroup={category.toString()}
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

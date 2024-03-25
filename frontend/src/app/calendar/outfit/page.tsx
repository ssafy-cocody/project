/* eslint-disable no-nested-ternary */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';

import { CheckIcon } from '@/../public/svgs';
import Background from '@/components/background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import styles from '@/containers/calendar/Outfit/Outfit.module.scss';
import { Category, CategoryKo, IClothes, RClothesByCategory, TCategory } from '@/containers/calendar/Outfit/type';

const Page = () => {
  const [clothesByCategory] = useState<RClothesByCategory>({
    [Category.TOP]: [
      { image: '/images/test1.jpg', id: 1 },
      { image: '/images/test2.jpg', id: 2 },
      { image: '/images/test3.jpg', id: 3 },
    ],
    [Category.BOTTOM]: [
      { image: '/images/test2.jpg', id: 4 },
      { image: '/images/test4.jpg', id: 5 },
      { image: '/images/test3.jpg', id: 6 },
    ],
    [Category.SHOES]: [
      { image: '/images/test2.jpg', id: 8 },
      { image: '/images/test4.jpg', id: 9 },
      { image: '/images/test3.jpg', id: 10 },
    ],
  });
  const [categories] = useState<TCategory[]>([Category.TOP, Category.BOTTOM, Category.SHOES]);
  const [selected, setSelected] = useState<number[]>(Array.from({ length: Object.keys(Category).length }, () => 0));

  const handleClickItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newSelected: number[] = [...selected];
    newSelected[Number(e.target.value)] = Number(e.target.id);
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
                <div className={styles.category}>{CategoryKo[category]}</div>
                <div className={styles.clothes}>
                  {clothesByCategory[category].map(({ image, id }: IClothes, index) => {
                    return (
                      <div className={styles['clothes-image-container']} key={id}>
                        <label htmlFor={id.toString()}>
                          <Image src={image} alt={`${category}${index + 1}`} fill className={styles['clothes-image']} />
                          <div
                            className={`${styles['checked-icon-overlay']} ${selected[category] === id ? styles.visible : ''}`}
                          />
                          <div
                            className={`${styles['checked-icon']} ${selected[category] === id ? styles.visible : ''}`}
                          >
                            <CheckIcon />
                          </div>
                        </label>
                        <input
                          type="radio"
                          id={id.toString()}
                          value={category.toString()}
                          radioGroup={category.toString()}
                          onChange={(e) => handleClickItem(e)}
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

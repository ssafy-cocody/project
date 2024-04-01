/* eslint-disable no-nested-ternary */

'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';

import { CheckIcon } from '@/../public/svgs';
import Background from '@/components/Background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { OUTFIT_QUERY_KEY } from '@/containers/calendar/Calendar';
import styles from '@/containers/calendar/Outfit/Outfit.module.scss';
import { fetchPostOotdImage } from '@/services/calendar/outfit';
import { ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';
import { yearMonthDateFormatter } from '@/utils/date';
import { queryClient } from '@/utils/Provider';

const Page = () => {
  const router = useRouter();
  const [year, month, date] = [2024, 4, 1];
  const data = queryClient.getQueryData(OUTFIT_QUERY_KEY);
  const outfitMutation = useMutation({
    mutationFn: fetchPostOotdImage,
  });

  const [categories] = useState<string[]>([ClothesCategory.TOP, ClothesCategory.BOTTOM, ClothesCategory.SHOES]);
  const [selected, setSelected] = useState<ISelectedClothes>({});

  const handleClickItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newSelected: ISelectedClothes = { ...selected };
    newSelected[e.target.value] = { clothesId: Number(e.target.id) };
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    if (outfitMutation.isPending) return;

    const clothesRequestKey = {
      [ClothesCategory.TOP]: 'topId',
      [ClothesCategory.BOTTOM]: 'bottomId',
      [ClothesCategory.OUTER]: 'outerId',
      [ClothesCategory.SHOES]: 'shoesId',
      [ClothesCategory.ONEPIECE]: 'onepieceId',
    };

    const clothesRequest = {};
    Object.entries(selected).forEach(([category, clothes]) => {
      const categoryKey = category as keyof typeof ClothesCategory;
      const mappedData = { [clothesRequestKey[categoryKey]]: clothes?.clothesId };
      Object.assign(clothesRequest, mappedData);
    });

    const params = {
      clothesRequest,
      date: yearMonthDateFormatter(year, month, date),
    };

    // outfitMutation.mutate();
    // router.replace('/calendar'); // 뒤로가기시 /outfit으로 이동하지 않도록 replace
  };

  const clothesByCategory = {
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
  }; // (data as Record<string, IClothes[]>) || {};

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
                  {Object.hasOwn(clothesByCategory, category) &&
                    clothesByCategory[category].map(({ image, clothesId }: IClothes, index) => {
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
            <Button onClick={handleSubmit}>등록</Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;

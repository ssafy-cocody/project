/* eslint-disable no-nested-ternary */

'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { OUTFIT_QUERY_KEY } from '@/containers/calendar/Calendar';
import ClothesPicker from '@/containers/calendar/Outfit/ClothesPicker';
import styles from '@/containers/calendar/Outfit/Outfit.module.scss';
import { fetchPostOotdImage } from '@/services/calendar/outfit';
import { ClothesCategory, ISelectedClothes } from '@/types/clothes';
import { yearMonthDateFormatter } from '@/utils/date';
import { queryClient } from '@/utils/Provider';

const clothesRequestKey = {
  [ClothesCategory.TOP]: 'topId',
  [ClothesCategory.BOTTOM]: 'bottomId',
  [ClothesCategory.OUTER]: 'outerId',
  [ClothesCategory.SHOES]: 'shoesId',
  [ClothesCategory.ONEPIECE]: 'onepieceId',
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [year, month, date] = [searchParams.get('year'), searchParams.get('month'), searchParams.get('date')]; // TODO: year, month, date 모두 있어야 함

  const data = queryClient.getQueryData(OUTFIT_QUERY_KEY);
  const outfitMutation = useMutation({
    mutationFn: fetchPostOotdImage,
  });

  const [selected, setSelected] = useState<ISelectedClothes>({});

  const handleSubmit = () => {
    if (outfitMutation.isPending) return;

    const clothesRequest = {};
    Object.entries(selected).forEach(([category, clothes]) => {
      const categoryKey = category as keyof typeof ClothesCategory;
      const mappedData = { [clothesRequestKey[categoryKey]]: clothes?.clothesId };
      Object.assign(clothesRequest, mappedData);
    });

    const params = {
      clothesRequest,
      date: yearMonthDateFormatter(Number(year), Number(month), Number(date)),
    };

    // outfitMutation.mutate();
    // router.replace('/calendar'); // 뒤로가기시 /outfit으로 이동하지 않도록 replace
  };

  const isLoading = false;

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

        {/** TODO: 로딩 스피너 */}
        {isLoading && <div>로딩 중 입니다...</div>}
        {!isLoading && Object.keys(clothesByCategory).length === 0 && <div>일치하는 옷이 없어요.</div>}
        {!isLoading && Object.keys(clothesByCategory).length > 0 && (
          <ClothesPicker
            clothesByCategory={clothesByCategory}
            onSelectClothes={(selected_) => setSelected(selected_)}
          />
        )}
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

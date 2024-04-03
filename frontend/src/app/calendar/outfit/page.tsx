/* eslint-disable no-nested-ternary */

'use client';

import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Background from '@/components/Background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { OUTFIT_QUERY_KEY } from '@/containers/calendar/Calendar';
import ClothesPicker from '@/containers/calendar/Outfit/ClothesPicker';
import styles from '@/containers/calendar/Outfit/Outfit.module.scss';
import { fetchPostOotdImage } from '@/services/calendar/outfit';
import { outfitAtom } from '@/stores/outfit';
import { ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';
import { yearMonthDateFormatter } from '@/utils/date';
import { queryClient } from '@/utils/Provider';

const clothesRequestKey = {
  [ClothesCategory.TOP]: 'top',
  [ClothesCategory.BOTTOM]: 'bottom',
  [ClothesCategory.OUTER]: 'outer',
  [ClothesCategory.SHOES]: 'shoes',
  [ClothesCategory.ONEPIECE]: 'onepiece',
};

const Page = () => {
  const router = useRouter();
  const [outfit, setOutfit] = useAtom(outfitAtom);
  const data = queryClient.getQueryData(OUTFIT_QUERY_KEY) as { data: Record<string, IClothes[]> };

  const outfitMutation = useMutation({
    mutationFn: fetchPostOotdImage,
  });

  const [selected, setSelected] = useState<ISelectedClothes>({});

  const handleSubmit = () => {
    if (outfitMutation.isPending) return;

    const formData = new FormData();

    Object.entries(selected).forEach(([category, clothes]) => {
      const categoryKey = category as keyof typeof ClothesCategory;
      formData.append(`${clothesRequestKey[categoryKey]}`, clothes?.clothesId!.toString());
    });
    const { year, month, date, ootdImage } = outfit!;
    formData.append('date', yearMonthDateFormatter(year, month, date));
    formData.append('ootdImage', ootdImage);

    outfitMutation.mutate(
      { formData },
      {
        onSuccess: () => {
          setOutfit(undefined); // 등록 완료 후 데이터 초기화
          router.replace('/calendar'); // 뒤로가기시 /outfit으로 이동하지 않도록 replace
        },
      },
    );
  };

  const isLoading = !data?.data;
  const clothesByCategory = (data?.data || {}) as Record<string, IClothes[]>;
  const ootdImageSrc = outfit?.ootdImage ? URL.createObjectURL(outfit?.ootdImage) : '';

  // TODO 새로고침시 등록을 취소하겠습니까?
  useEffect(() => {
    if (!outfit || Object.values(outfit).some((v) => v === '')) {
      window.alert('잘못된 접근입니다.');
      router.replace('/calendar');
    }
  }, [outfit]);

  return (
    <>
      <Background $backgroundColor="skyBlue" />
      <Header title="내 코디 올리기" hasPreviousLink />
      <main className={styles['main-container']}>
        <div className={styles['taken-image-container']}>
          <Image src={ootdImageSrc} alt="내가 올린 코디 사진" fill className={styles['taken-image']} />
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

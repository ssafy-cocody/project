/* eslint-disable no-unused-expressions */
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';

import styles from '@/components/ClothesList/ClothesList.module.scss';
import { useInfinityScroll } from '@/hooks/useInfinityScroll';
import { fetchGetClothes } from '@/services/closet';
import { IFetchGetClosetResponse } from '@/services/closet/type';
import { ClosetCategory, CLOTHES_TAB, IClothes } from '@/types/clothes';

interface Props {
  currentCategory?: keyof typeof ClosetCategory;
  className?: string;
  handleModal?: () => void;
  onSelectClothes?: (newlyClickedClothes: IClothes) => void;
}

const PAGE_SIZE = 9;

const ClothesList = ({ handleModal, className, onSelectClothes, currentCategory }: Props) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<IFetchGetClosetResponse>({
    queryKey: ['ClothesQueryKey', currentCategory],
    queryFn: ({ pageParam }) =>
      fetchGetClothes({
        page: pageParam as number,
        size: PAGE_SIZE,
        category: currentCategory === 'ALL' ? undefined : currentCategory,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  });

  const refLast = useInfinityScroll({ hasNextPage, fetchNextPage }).ref;

  return (
    <div className={`${styles['list-container']} ${className}`}>
      <div className={styles['closet-container']}>
        <div className={styles['clothes-container']}>
          {data?.pages.map(({ content }: { content: IClothes[] }) => {
            return content.map((item: IClothes) => {
              const { clothesId, image, category } = item;
              if (currentCategory === CLOTHES_TAB.ALL || currentCategory === category) {
                return (
                  <button
                    type="button"
                    className={styles['clothes-image-container']}
                    key={clothesId!.toString()}
                    onClick={() => {
                      handleModal ? handleModal() : '';
                      onSelectClothes ? onSelectClothes(item) : '';
                    }}
                  >
                    <Image src={image!} alt={clothesId!.toString()} fill className={styles.clothes} />
                  </button>
                );
              }
              return '';
            });
          })}
          {hasNextPage ? (
            <div ref={refLast} className={styles['page-end']} />
          ) : (
            <div className={styles['page-end']}>⋆₊ 옷을 더 담아주세요! ₊⁺</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothesList;

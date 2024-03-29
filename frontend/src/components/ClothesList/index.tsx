/* eslint-disable no-unused-expressions */
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';

import styles from '@/components/ClothesList/ClothesList.module.scss';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { fetchGetClothes } from '@/services/closet';
import { IFetchGetClosetResponse } from '@/services/closet/type';
import { IClothes } from '@/types/clothes';

interface Props {
  handleModal?: () => void;
  className?: string;
  onSelectClothes?: (newlyClickedClothes: IClothes) => void;
}

const PAGE_SIZE = 9;

const ClothesList = ({ handleModal, className, onSelectClothes }: Props) => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<IFetchGetClosetResponse>({
    queryKey: ['ClothesQueryKey'],
    queryFn: ({ pageParam }) => fetchGetClothes({ page: pageParam as number, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  });

  const refLast = useIntersectionObserver({ hasNextPage, fetchNextPage }).ref;

  return (
    <div className={`${styles['list-container']} ${className}`}>
      <div className={styles['closet-container']}>
        <div className={styles['clothes-container']}>
          {data?.pages.map(({ content }: { content: IClothes[] }) => {
            return content.map((item: IClothes) => {
              const { clothesId, image } = item;
              return (
                <button
                  type="button"
                  className={styles['clothes-image-container']}
                  key={clothesId.toString()}
                  onClick={() => {
                    handleModal ? handleModal() : '';
                    onSelectClothes ? onSelectClothes(item) : '';
                  }}
                >
                  <Image src={image!} alt={clothesId.toString()} fill className={styles.clothes} />
                </button>
              );
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

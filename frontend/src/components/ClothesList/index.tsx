import Image from 'next/image';
import { useRef, useState } from 'react';

import styles from '@/components/ClothesList/ClothesList.module.scss';

interface IClothes {
  // eslint-disable-next-line react/no-unused-prop-types
  clothesId: Number;
  // eslint-disable-next-line react/no-unused-prop-types
  image: string;
}

interface Props {
  handleClick?: () => void;
  className?: string;
}

const ClothesList = ({ handleClick, className }: Props) => {
  const tabs = useRef(['전체', '상의', '하의', '원피스', '아우터', '신발']);
  const [clothes] = useState<IClothes[]>([
    { clothesId: 0, image: '/images/test1.jpg' },
    { clothesId: 2, image: '/images/test2.jpg' },
    { clothesId: 3, image: '/images/test3.jpg' },
    { clothesId: 4, image: '/images/test4.jpg' },
    { clothesId: 5, image: '/images/test1.jpg' },
    { clothesId: 6, image: '/images/test2.jpg' },
    { clothesId: 7, image: '/images/test3.jpg' },
    { clothesId: 8, image: '/images/test4.jpg' },
    { clothesId: 9, image: '/images/test1.jpg' },
    { clothesId: 10, image: '/images/test2.jpg' },
    { clothesId: 11, image: '/images/test3.jpg' },
    { clothesId: 12, image: '/images/test4.jpg' },
    { clothesId: 110, image: '/images/test1.jpg' },
    { clothesId: 112, image: '/images/test2.jpg' },
    { clothesId: 113, image: '/images/test3.jpg' },
    { clothesId: 114, image: '/images/test4.jpg' },
    { clothesId: 115, image: '/images/test1.jpg' },
    { clothesId: 116, image: '/images/test2.jpg' },
    { clothesId: 117, image: '/images/test3.jpg' },
    { clothesId: 118, image: '/images/test4.jpg' },
    { clothesId: 119, image: '/images/test1.jpg' },
    { clothesId: 1110, image: '/images/test2.jpg' },
    { clothesId: 1111, image: '/images/test3.jpg' },
    { clothesId: 1112, image: '/images/test4.jpg' },
  ]);
  const [selectedCategory] = useState<string>('전체');

  return (
    <div className={`${styles['list-container']} ${className}`}>
      <div className={styles['tab-container']}>
        {tabs.current.map((category) => {
          return (
            <div
              key={category}
              className={`${styles.tab} ${selectedCategory === category ? styles['selected-category'] : ''}`}
            >
              {category}
            </div>
          );
        })}
      </div>
      <div className={styles['closet-container']}>
        <div className={styles['clothes-container']}>
          {clothes.map(({ clothesId, image }: IClothes) => {
            return (
              <button
                type="button"
                className={styles['clothes-image-container']}
                key={clothesId.toString()}
                onClick={handleClick}
              >
                <Image src={image} alt={clothesId.toString()} fill className={styles.clothes} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClothesList;

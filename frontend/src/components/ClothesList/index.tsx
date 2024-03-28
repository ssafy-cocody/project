/* eslint-disable no-unused-expressions */
import Image from 'next/image';
import { useState } from 'react';

import styles from '@/components/ClothesList/ClothesList.module.scss';
import { Category, IClothes } from '@/types/clothes';

interface Props {
  handleModal?: () => void;
  className?: string;
  onSelectClothes?: (newlyClickedClothes: IClothes) => void;
}

const ClothesList = ({ handleModal, className, onSelectClothes }: Props) => {
  const [clothes] = useState<IClothes[]>([
    { clothesId: 0, category: Category.TOP, clothesImage: '/images/clothes/top.png' },
    { clothesId: 1, category: Category.TOP, clothesImage: '/images/clothes/top.png' },
    { clothesId: 2, category: Category.TOP, clothesImage: '/images/clothes/top.png' },
    { clothesId: 3, category: Category.OUTER, clothesImage: '/images/clothes/cardigan.png' },
    { clothesId: 4, category: Category.OUTER, clothesImage: '/images/clothes/cardigan.png' },
    { clothesId: 5, category: Category.OUTER, clothesImage: '/images/clothes/cardigan.png' },
    { clothesId: 6, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 7, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 8, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 9, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 10, category: Category.SHOES, clothesImage: '/images/clothes/shoes.png' },
  ]);

  return (
    <div className={`${styles['list-container']} ${className}`}>
      <div className={styles['closet-container']}>
        <div className={styles['clothes-container']}>
          {clothes.map((item: IClothes) => {
            const { clothesId, clothesImage } = item;
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
                <Image src={clothesImage!} alt={clothesId.toString()} fill className={styles.clothes} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClothesList;

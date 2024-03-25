/* eslint-disable no-unused-expressions */
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

import styles from '@/components/ClothesList/ClothesList.module.scss';
import { ISelectedClothes } from '@/containers/cody/new/type';
import { Category, IClothes } from '@/types/clothes';

interface Props {
  handleModal?: () => void;
  className?: string;
  selectedClothes?: ISelectedClothes;
  setSelectedClothes?: Dispatch<SetStateAction<ISelectedClothes>>;
}

const ClothesList = ({ handleModal, className, selectedClothes, setSelectedClothes }: Props) => {
  const [clothes] = useState<IClothes[]>([
    { clothesId: 0, category: Category.TOP, clothesImage: '/images/clothes/top.png' },
    { clothesId: 1, category: Category.TOP, clothesImage: '/images/clothes/top.png' },
    { clothesId: 2, category: Category.TOP, clothesImage: '/images/clothes/top.png' },
    { clothesId: 3, category: Category.OUTER, clothesImage: '/images/clothes/cardigan.png' },
    { clothesId: 3, category: Category.OUTER, clothesImage: '/images/clothes/cardigan.png' },
    { clothesId: 3, category: Category.OUTER, clothesImage: '/images/clothes/cardigan.png' },
    { clothesId: 3, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 3, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 3, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 3, category: Category.BOTTOM, clothesImage: '/images/clothes/pants.png' },
    { clothesId: 3, category: Category.SHOES, clothesImage: '/images/clothes/shoes.png' },
  ]);

  return (
    <div className={`${styles['list-container']} ${className}`}>
      <div className={styles['closet-container']}>
        <div className={styles['clothes-container']}>
          {clothes.map((item: IClothes) => {
            const { clothesId, category, clothesImage } = item;
            return (
              <button
                type="button"
                className={styles['clothes-image-container']}
                key={clothesId.toString()}
                onClick={() => {
                  handleModal ? handleModal() : '';
                  selectedClothes && setSelectedClothes
                    ? setSelectedClothes({ ...selectedClothes, [category]: item })
                    : '';
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

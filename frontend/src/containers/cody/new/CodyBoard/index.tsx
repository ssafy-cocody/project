'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/cody/new/CodyBoard/Board.module.scss';
import { ISelectedClothes } from '@/containers/cody/new/type';
import { Category, IClothes, TCategory } from '@/types/clothes';

interface Props {
  onClickDeleteClothes: () => void;
  selectedClothes: ISelectedClothes;
  setDeleteClothes: Dispatch<SetStateAction<IClothes | undefined>>;
}

const CodyBoard = ({ onClickDeleteClothes, selectedClothes, setDeleteClothes }: Props) => {
  const handleDeleteClothes = (category: string) => {
    onClickDeleteClothes();
    setDeleteClothes(selectedClothes[category]);
  };

  const categoryOrder: (keyof TCategory)[] = [Category.TOP, Category.OUTER, Category.BOTTOM, Category.SHOES];
  const sortedSelectedClothes = categoryOrder.reduce((sortedClothes: ISelectedClothes, category) => {
    if (selectedClothes[category]) {
      sortedClothes[category] = selectedClothes[category];
    }
    return sortedClothes;
  }, {});

  return (
    <div className={styles['board-container']}>
      <TextInputWithUnderLine label="새로운 코디명" />
      <div className={styles.board}>
        {Object.keys(sortedSelectedClothes).map((category) => {
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleDeleteClothes(category)}
              className={styles['image-container']}
            >
              <Image src={selectedClothes[category]?.clothesImage!} alt="" fill className={styles.clothes} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CodyBoard;

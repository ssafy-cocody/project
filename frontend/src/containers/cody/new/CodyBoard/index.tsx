'use client';

import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/cody/new/CodyBoard/Board.module.scss';
import { ISelectedClothes } from '@/containers/cody/new/type';
import { Category, IClothes } from '@/types/clothes';
import { getValidCodyName } from '@/utils/getValidCodyName';

interface Props {
  onClickDeleteClothes: () => void;
  selectedClothes: ISelectedClothes;
  setDeleteClothes: Dispatch<SetStateAction<IClothes | undefined>>;
}

const CodyBoard = ({ onClickDeleteClothes, selectedClothes, setDeleteClothes }: Props) => {
  const [classNameBySelectedCount, setClassNameBySelectedCount] = useState<string>();
  const [codyName, setCodyName] = useState<string>();

  const handleDeleteClothes = (category: string) => {
    onClickDeleteClothes();
    setDeleteClothes(selectedClothes[category]);
  };

  const handleCodyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCodyName(getValidCodyName(e.target.value));
  };

  useEffect(() => {
    if (Object.keys(selectedClothes).length === 1) {
      setClassNameBySelectedCount('selectedOne');
    }
    if (Object.keys(selectedClothes).length === 2) {
      if (JSON.stringify(Object.keys(selectedClothes)) === JSON.stringify([Category.TOP, Category.OUTER])) {
        setClassNameBySelectedCount('selectedTwoHorizon');
      } else {
        setClassNameBySelectedCount('selectedTwoVertical');
      }
    }
    if (Object.keys(selectedClothes).length === 3) {
      if (
        JSON.stringify(Object.keys(selectedClothes)) ===
          JSON.stringify([Category.TOP, Category.OUTER, Category.BOTTOM]) ||
        JSON.stringify(Object.keys(selectedClothes)) === JSON.stringify([Category.TOP, Category.OUTER, Category.SHOES])
      ) {
        setClassNameBySelectedCount('selectedThreeHorizon');
      } else {
        setClassNameBySelectedCount('selectedThreeVertical');
      }
    }
    if (Object.keys(selectedClothes).length === 4) {
      setClassNameBySelectedCount('selectedAll');
    }
  }, [selectedClothes]);

  return (
    <div className={styles['board-container']}>
      <TextInputWithUnderLine label="새로운 코디명" onChange={handleCodyNameChange} value={codyName} />
      <div className={`${styles.board} ${classNameBySelectedCount ? styles[classNameBySelectedCount] : ''}`}>
        {Object.keys(selectedClothes).map((category) => {
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

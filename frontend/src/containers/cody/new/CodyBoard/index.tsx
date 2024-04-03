'use client';

import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';

import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/cody/new/CodyBoard/Board.module.scss';
import { ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';
import { getValidCodyName } from '@/utils/getValidCodyName';

interface Props {
  onClickRemoveClothes: () => void;
  selectedClothes: ISelectedClothes;
  setRemoveClothes: Dispatch<SetStateAction<IClothes | undefined>>;
  codyName: string;
  setCodyName: Dispatch<SetStateAction<string>>;
}

const CodyBoard = ({ onClickRemoveClothes, selectedClothes, setRemoveClothes, codyName, setCodyName }: Props) => {
  const [classNameBySelectedCount, setClassNameBySelectedCount] = useState<string>();

  const handleRemoveClothes = (category: string) => {
    onClickRemoveClothes();
    setRemoveClothes(selectedClothes[category as keyof ISelectedClothes]);
  };

  const handleCodyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCodyName(getValidCodyName(e.target.value));
  };

  useEffect(() => {
    if (Object.keys(selectedClothes).length === 1) {
      setClassNameBySelectedCount('selectedOne');
    }
    if (Object.keys(selectedClothes).length === 2) {
      if (
        JSON.stringify(Object.keys(selectedClothes)) === JSON.stringify([ClothesCategory.TOP, ClothesCategory.OUTER])
      ) {
        setClassNameBySelectedCount('selectedTwoHorizon');
      } else {
        setClassNameBySelectedCount('selectedTwoVertical');
      }
    }
    if (Object.keys(selectedClothes).length === 3) {
      if (
        JSON.stringify(Object.keys(selectedClothes)) ===
          JSON.stringify([ClothesCategory.TOP, ClothesCategory.OUTER, ClothesCategory.BOTTOM]) ||
        JSON.stringify(Object.keys(selectedClothes)) ===
          JSON.stringify([ClothesCategory.TOP, ClothesCategory.OUTER, ClothesCategory.SHOES])
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
      <TextInputWithUnderLine
        placeholder="새로운 코디명을 입력해주세요."
        onChange={handleCodyNameChange}
        value={codyName}
      />
      <div className={`${styles.board} ${classNameBySelectedCount ? styles[classNameBySelectedCount] : ''}`}>
        {Object.keys(selectedClothes).map((category) => {
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleRemoveClothes(category)}
              className={styles['image-container']}
            >
              <Image
                src={selectedClothes[category as keyof ISelectedClothes]?.image!}
                alt=""
                fill
                className={styles.clothes}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CodyBoard;

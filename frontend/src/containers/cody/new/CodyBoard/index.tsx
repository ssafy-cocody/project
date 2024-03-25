'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/cody/new/CodyBoard/Board.module.scss';
import { ISelectedClothes } from '@/containers/cody/new/type';
import { Category, IClothes } from '@/types/clothes';

interface Props {
  handleModal: () => void;
  selectedClothes: ISelectedClothes;
  setDeleteClothes: Dispatch<SetStateAction<IClothes | undefined>>;
}

const CodyBoard = ({ handleModal, selectedClothes, setDeleteClothes }: Props) => {
  return (
    <div className={styles['board-container']}>
      <TextInputWithUnderLine label="새로운 코디명" />
      <div className={styles.board}>
        {!!selectedClothes[Category.TOP] && (
          <button
            type="button"
            onClick={() => {
              handleModal();
              setDeleteClothes(selectedClothes[Category.TOP]);
            }}
            className={`${styles.top} ${styles['image-container']}`}
          >
            <Image src={selectedClothes[Category.TOP]?.clothesImage!} alt="" fill className={styles.clothes} />
          </button>
        )}
        {!!selectedClothes[Category.OUTER] && (
          <button
            type="button"
            onClick={() => {
              handleModal();
              setDeleteClothes(selectedClothes[Category.OUTER]);
            }}
            className={`${styles.outer} ${styles['image-container']}`}
          >
            <Image src={selectedClothes[Category.OUTER]?.clothesImage!} alt="" fill className={styles.clothes} />
          </button>
        )}
        {!!selectedClothes[Category.BOTTOM] && (
          <button
            type="button"
            onClick={() => {
              handleModal();
              setDeleteClothes(selectedClothes[Category.BOTTOM]);
            }}
            className={`${styles.bottom} ${styles['image-container']}`}
          >
            <Image src={selectedClothes[Category.BOTTOM]?.clothesImage!} alt="" fill className={styles.clothes} />
          </button>
        )}
        {!!selectedClothes[Category.SHOES] && (
          <button
            type="button"
            onClick={() => {
              handleModal();
              setDeleteClothes(selectedClothes[Category.SHOES]);
            }}
            className={`${styles.shoes} ${styles['image-container']}`}
          >
            <Image src={selectedClothes[Category.SHOES]?.clothesImage!} alt="" fill className={styles.clothes} />
          </button>
        )}
      </div>
    </div>
  );
};
export default CodyBoard;

'use client';

import Image from 'next/image';

import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/cody/new/CodyBoard/Board.module.scss';

interface Props {
  handleModal: () => void;
}

const CodyBoard = ({ handleModal }: Props) => {
  return (
    <div className={styles['board-container']}>
      <TextInputWithUnderLine label="새로운 코디명" />
      <div className={styles.board}>
        <button type="button" onClick={handleModal} className={`${styles.top} ${styles['image-container']}`}>
          <Image src="/images/clothes/top.png" alt="" fill className={styles.clothes} />
        </button>
        <button type="button" onClick={handleModal} className={`${styles.outer} ${styles['image-container']}`}>
          <Image src="/images/clothes/cardigan.png" alt="" fill className={styles.clothes} />
        </button>
        <button type="button" onClick={handleModal} className={`${styles.bottom} ${styles['image-container']}`}>
          <Image src="/images/clothes/pants.png" alt="" fill className={styles.clothes} />
        </button>
        <button type="button" onClick={handleModal} className={`${styles.shoes} ${styles['image-container']}`}>
          <Image src="/images/clothes/shoes.png" alt="" fill className={styles.clothes} />
        </button>
      </div>
    </div>
  );
};
export default CodyBoard;

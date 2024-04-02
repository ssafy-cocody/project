import { Dispatch, SetStateAction } from 'react';

import styles from '@/components/ClothesTab/ClothesTab.module.scss';
import { ClosetCategory } from '@/types/clothes';

interface Props {
  currentCategory: keyof typeof ClosetCategory;
  setCurrentCategory: Dispatch<SetStateAction<keyof typeof ClosetCategory>>;
}

const ClothesTap = ({ currentCategory, setCurrentCategory }: Props) => {
  return (
    <div className={styles['tab-container']}>
      {Object.entries(ClosetCategory).map(([categoryKey, categoryValue]) => {
        return (
          <button
            onClick={() => setCurrentCategory(categoryKey as keyof typeof ClosetCategory)}
            type="button"
            key={categoryKey}
            className={`${styles.tab} ${currentCategory === categoryKey ? styles['selected-category'] : ''}`}
          >
            {categoryValue}
          </button>
        );
      })}
    </div>
  );
};

export default ClothesTap;

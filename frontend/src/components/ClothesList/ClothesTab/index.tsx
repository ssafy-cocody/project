import { useState } from 'react';

import styles from '@/components/ClothesList/ClothesTab/ClothesTab.module.scss';

import { Category } from '../type';

const ClothesTap = () => {
  const [selectedCategory] = useState<string>(Category.ALL);
  return (
    <div className={styles['tab-container']}>
      {Object.entries(Category).map(([categoryKey, categoryValue]) => {
        return (
          <div
            key={categoryKey}
            className={`${styles.tab} ${selectedCategory === categoryValue ? styles['selected-category'] : ''}`}
          >
            {categoryValue}
          </div>
        );
      })}
    </div>
  );
};

export default ClothesTap;

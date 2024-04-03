import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

import { CheckIcon } from '@/../../public/svgs';
import styles from '@/containers/calendar/Outfit/ClothesPicker/ClothesPicker.module.scss';
import { ClosetCategory, ClothesCategory, IClothes, ISelectedClothes } from '@/types/clothes';

interface ClothesPickerProps {
  clothesByCategory: Record<string, IClothes[]>;
  onSelectClothes: (selected: ISelectedClothes) => void;
}

const ClothesPicker = ({ clothesByCategory, onSelectClothes }: ClothesPickerProps) => {
  const [selected, setSelected] = useState<ISelectedClothes>({});

  const handleClickItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newSelected: ISelectedClothes = { ...selected };
    const selectedCategory = e.target.value as keyof ISelectedClothes;
    newSelected[selectedCategory] = { clothesId: Number(e.target.id) };

    setSelected(newSelected);
    onSelectClothes(newSelected);
  };

  const categories = Object.keys(clothesByCategory).map(
    (category) => ClothesCategory[category as keyof typeof ClothesCategory],
  );

  return (
    <div className={styles['clothes-picker']}>
      {categories.map((category) => {
        const hasCategory = clothesByCategory[category].length > 0;

        if (!hasCategory) return '';

        return (
          <div key={category} className={styles['clothes-by-category']}>
            <div className={styles.category}>{ClosetCategory[category]}</div>
            <div className={styles.clothes}>
              {clothesByCategory[category].map(({ imageUrl: image, clothesId }: IClothes, index) => {
                return (
                  <div className={styles['clothes-image-container']} key={clothesId}>
                    <label htmlFor={clothesId.toString()}>
                      <Image src={image!} alt={`${category}${index + 1}`} fill className={styles['clothes-image']} />
                      <div
                        className={`${styles['checked-icon-overlay']} ${selected[category]?.clothesId === clothesId ? styles.visible : ''}`}
                      />
                      <div
                        className={`${styles['checked-icon']} ${selected[category]?.clothesId === clothesId ? styles.visible : ''}`}
                      >
                        <CheckIcon />
                      </div>
                    </label>
                    <input
                      type="radio"
                      id={clothesId.toString()}
                      value={category}
                      radioGroup={category}
                      onChange={handleClickItem}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClothesPicker;

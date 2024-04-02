import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

import { CheckIcon } from '@/../../public/svgs';
import styles from '@/containers/calendar/Outfit/ClothesPicker/ClothesPicker.module.scss';
import { IClothes, ISelectedClothes } from '@/types/clothes';

interface ClothesPickerProps {
  clothesByCategory: Record<string, IClothes[]>;
  onSelectClothes: (selected: ISelectedClothes) => void;
}

const ClothesPicker = ({ clothesByCategory, onSelectClothes }: ClothesPickerProps) => {
  const [selected, setSelected] = useState<ISelectedClothes>({});

  const categories = Object.keys(clothesByCategory).map((category) => category);

  const handleClickItem = (e: ChangeEvent<HTMLInputElement>) => {
    const newSelected: ISelectedClothes = { ...selected };
    newSelected[e.target.value] = { clothesId: Number(e.target.id) };
    setSelected(newSelected);
    onSelectClothes(newSelected);
  };

  return (
    <div className={styles['clothes-picker']}>
      {categories.map((category) => {
        return (
          <div key={category} className={styles['clothes-by-category']}>
            <div className={styles.category}>{category}</div>
            <div className={styles.clothes}>
              {Object.hasOwn(clothesByCategory, category) &&
                clothesByCategory[category].map(({ image, clothesId }: IClothes, index) => {
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
                        value={category.toString()}
                        radioGroup={category.toString()}
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

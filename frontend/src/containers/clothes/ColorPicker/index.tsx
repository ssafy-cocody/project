import { ChangeEvent, useState } from 'react';

import styles from '@/containers/clothes/ColorPicker/ColorPicker.module.scss';

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
  };

  return (
    <div className={styles.picker}>
      <label htmlFor="color" />
      <input type="color" name="" id="color" onChange={handleChange} value={selectedColor} />
    </div>
  );
};

export default ColorPicker;

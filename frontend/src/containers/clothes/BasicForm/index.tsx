'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/BasicForm/BasicForm.module.scss';
import ColorSelect from '@/containers/clothes/BasicForm/ColorSelect';
import { ClothesCategory, Color } from '@/types/clothes';

interface BasicFormProps {
  onClickButton: () => void;
  onChange: ({ key, value }: { key: string; value: string }) => void;
  category?: string;
  name?: string;
  color?: keyof typeof Color;
  image?: string;
  readOnly?: boolean;
}

const CLOTHES_OPTIONS = [
  {
    text: '상의',
    value: ClothesCategory.TOP,
  },
  { text: '하의', value: ClothesCategory.BOTTOM },
  { text: '원피스', value: ClothesCategory.ONEPIECE },
  { text: '아우터', value: ClothesCategory.OUTER },
  { text: '신발', value: ClothesCategory.SHOES },
];

const BasicForm = ({ onClickButton, onChange: handleChange, readOnly, image, ...initValue }: BasicFormProps) => {
  const [formInput, setFormInput] = useState({
    category: initValue.category || '',
    name: initValue.name || '',
    color: initValue.color || '',
  });
  const [isValid, setIsValid] = useState(!Object.values(formInput).some((v) => v === ''));

  const handleFormChange = ({ key, value }: { key: string; value: string }) => {
    const newValue = {
      ...formInput,
      [key]: value,
    };
    setFormInput(newValue);
    handleChange({ key, value });

    setIsValid(!Object.values(newValue).some((v) => v === ''));
  };

  return (
    <>
      <div className={styles.clothes}>
        <img src={image} alt="" />
      </div>

      <div className={styles['form-container']}>
        <form action="">
          <SelectInput
            required
            label="카테고리"
            options={CLOTHES_OPTIONS}
            disabled={readOnly}
            value={formInput.category}
            onChange={(e) => handleFormChange({ key: 'category', value: e.target.value })}
          />
          <TextInput
            required
            label="상품명"
            readOnly={readOnly}
            value={formInput.name}
            onChange={(e) => handleFormChange({ key: 'name', value: e.target.value })}
          />
          <ColorSelect
            color={formInput.color}
            disabled={readOnly}
            onChange={(color) => handleFormChange({ key: 'color', value: color })}
          />
          <Button onClick={onClickButton} disabled={!isValid}>
            다음
          </Button>
        </form>
      </div>
    </>
  );
};
export default BasicForm;

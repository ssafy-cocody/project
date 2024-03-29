'use client';

import Image from 'next/image';

import Button from '@/components/Button';
import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/BasicForm/BasicForm.module.scss';
import ColorSelect from '@/containers/clothes/BasicForm/ColorSelect';
import { ClothesCategory } from '@/types/clothes';

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

const BasicForm = ({
  onClickButton,
  onChange: handleChange,
}: {
  onClickButton: () => void;
  onChange: ({ key, value }: { key: string; value: string }) => void;
}) => {
  return (
    <>
      <div className={styles.clothes}>
        <Image src="/images/test1.jpg" fill alt="" />
      </div>

      <div className={styles['form-container']}>
        <form action="">
          <SelectInput
            required
            label="카테고리"
            options={CLOTHES_OPTIONS}
            value="상의"
            onChange={(e) => handleChange({ key: 'category', value: e.target.value })}
          />
          <TextInput required label="상품명" onChange={(e) => handleChange({ key: 'name', value: e.target.value })} />
          {/* TODO: 색상은 1개만 선택 가능 */}
          <ColorSelect onChange={(color) => handleChange({ key: 'color', value: color })} />
          <Button onClick={onClickButton}>다음</Button>
        </form>
      </div>
    </>
  );
};
export default BasicForm;

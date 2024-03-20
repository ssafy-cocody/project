'use client';

import Image from 'next/image';

import Button from '@/components/Button';
import SelectInput from '@/components/SelectInput';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/BasicForm/BasicForm.module.scss';
import ColorSelect from '@/containers/clothes/BasicForm/ColorSelect';

const CLOTHES_CATEGORIES = [
  {
    text: '상의',
  },
  { text: '하의' },
  { text: '원피스' },
  { text: '아우터' },
  { text: '신발' },
];

const CLOTHES_OPTIONS = CLOTHES_CATEGORIES.map(({ text }) => ({ value: text, text }));

const BasicForm = ({ onClickButton }: { onClickButton: () => void }) => {
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
            onChange={(e) => console.log(e.target.value)}
          />
          <TextInput required label="상품명" />
          {/* TODO: 색상은 1개만 선택 가능 */}
          <ColorSelect />
          <Button onClick={onClickButton}>다음</Button>
        </form>
      </div>
    </>
  );
};
export default BasicForm;

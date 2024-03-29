import { useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/AdditionalForm/AdditionalForm.module.scss';

const AdditionalForm = ({
  onClickButton,
  onChange: handleChange,
}: {
  onClickButton: () => void;
  onChange: ({ key, value }: { key: string; value: string }) => void;
}) => {
  const [price, setPrice] = useState('');

  const additionalFormInput = [
    {
      label: '브랜드',
      key: 'brand',
    },
    {
      label: '품번',
      key: 'productNo',
    },
    {
      label: '가격',
      key: 'price',
      value: price,
    },
    {
      label: '쇼핑몰 링크',
      key: 'link',
    },
  ];

  return (
    <div className={styles['form-container']}>
      <form action="">
        {additionalFormInput.map(({ label, key, value }) => (
          <TextInput
            key={key}
            label={label}
            value={value}
            onChange={(e) => {
              // price는 숫자만 입력 가능
              if (key === 'price') {
                // eslint-disable-next-line no-underscore-dangle
                const _price = Number(e.target.value);
                if (e.target.value.length === 0) {
                  setPrice('');
                  return;
                }
                if (Number.isNaN(_price)) return;

                setPrice(e.target.value);
              }
              handleChange({
                key,
                value: e.target.value,
              });
            }}
          />
        ))}
        <div className={styles['button-wrapper']}>
          <Button onClick={onClickButton}>다음</Button>
        </div>
      </form>
    </div>
  );
};
export default AdditionalForm;

import { useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/AdditionalForm/AdditionalForm.module.scss';

interface AdditionalFormProps {
  onClickButton: () => void;
  onChange: ({ key, value }: { key: string; value: string }) => void;
  brand?: string;
  productNo?: string;
  price?: number;
  link?: string;
}

const AdditionalForm = ({
  onClickButton,
  onChange: handleChange,
  brand: initBrand,
  productNo: initProductNo,
  price: initPrice,
  link: initLink,
}: AdditionalFormProps) => {
  const [input, setInput] = useState({
    brand: initBrand,
    productNo: initProductNo,
    price: initPrice?.toString(),
    link: initLink,
  });

  const additionalFormInput = [
    {
      label: '브랜드',
      key: 'brand',
      value: input.brand,
      // readOnly: !!initBrand,
    },
    {
      label: '품번',
      key: 'productNo',
      value: input.productNo,
      // readOnly: !!initProductNo,
    },
    {
      label: '가격',
      key: 'price',
      value: input.price,
      // readOnly: !!initPrice,
    },
    {
      label: '쇼핑몰 링크',
      key: 'link',
      value: input.link,
      // readOnly: !!initLink,
    },
  ];

  const handleChangeInput = ({ key, value }: { key: string; value: string }) => {
    setInput((prev) => ({ ...prev, [key]: value }));

    handleChange({
      key,
      value,
    });
  };

  return (
    <div className={styles['form-container']}>
      <form action="">
        {additionalFormInput.map(({ label, key, value }) => (
          <TextInput
            key={key}
            name={key}
            label={label}
            value={value}
            onChange={(e) => {
              // price는 숫자만 입력 가능
              if (key === 'price') {
                // eslint-disable-next-line no-underscore-dangle
                const _price = Number(e.target.value);
                if (e.target.value.length === 0) {
                  setInput((prev) => ({ ...prev, price: '' }));
                  return;
                }
                if (Number.isNaN(_price)) return;

                setInput((prev) => ({ ...prev, price: e.target.value }));
              }
              handleChangeInput({
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

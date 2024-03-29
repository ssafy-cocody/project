import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/AdditionalForm/AdditionalForm.module.scss';

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
  },
  {
    label: '쇼핑몰 링크',
    key: 'link',
  },
];

const AdditionalForm = ({
  onClickButton,
  onChange: handleChange,
}: {
  onClickButton: () => void;
  onChange: ({ key, value }: { key: string; value: string }) => void;
}) => {
  return (
    <div className={styles['form-container']}>
      <form action="">
        {additionalFormInput.map(({ label, key }) => (
          <TextInput
            key={key}
            label={label}
            onChange={(e) =>
              handleChange({
                key,
                value: e.target.value,
              })
            }
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

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import styles from '@/containers/clothes/AdditionalForm/AdditionalForm.module.scss';

const AdditionalForm = ({ onClickButton }: { onClickButton: () => void }) => {
  return (
    <div className={styles['form-container']}>
      <form action="">
        <TextInput label="브랜드" />
        <TextInput label="품번" />
        <TextInput label="가격" />
        <TextInput label="쇼핑몰 링크" />
        <div className={styles['button-wrapper']}>
          <Button onClick={onClickButton}>다음</Button>
        </div>
      </form>
    </div>
  );
};
export default AdditionalForm;

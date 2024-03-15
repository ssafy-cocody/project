import styles from '@/components/TextInput/styles.module.scss';
import { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  describe?: string;
}

const TextInput = ({ label, describe, name, ...props }: TextInputProps) => {
  const errorMessage = '';

  return (
    <div className={styles.input}>
      <label htmlFor={name}>{label}</label>
      <input name={name} {...props} />
      {describe && <p className={styles.desc}>{describe}</p>}
      {errorMessage && <p className={styles['error-messages']}>난 애러에용</p>}
    </div>
  );
};

export default TextInput;

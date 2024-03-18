import { InputHTMLAttributes } from 'react';

import styles from '@/components/TextInput/styles.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  describe?: string;
}

const TextInput = ({ label, describe, id, name, ...props }: TextInputProps) => {
  const errorMessage = '';

  return (
    <div className={styles.input}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} {...props} />
      {describe && <p className={styles.desc}>{describe}</p>}
      {errorMessage && <p className={styles['error-messages']}>난 애러에용</p>}
    </div>
  );
};

export default TextInput;

import { InputHTMLAttributes } from 'react';

import Label, { LabelProps } from '@/components/Label';
import styles from '@/components/TextInput/styles.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>, LabelProps {
  describe?: string;
}

const TextInput = ({ label, describe, id, name, required, ...props }: TextInputProps) => {
  const errorMessage = '';

  return (
    <div className={styles.input}>
      <Label label={label} htmlFor={id} required={required} />
      <input id={id} name={name} required={required} {...props} />
      {describe && <p className={styles.desc}>{describe}</p>}
      {errorMessage && <p className={styles['error-messages']}>난 애러에용</p>}
    </div>
  );
};

export default TextInput;

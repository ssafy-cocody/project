import { InputHTMLAttributes } from 'react';

import styles from '@/components/TextInputWithUnderLine/TextInputWithUnderLine.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const TextInputWithUnderLine = ({ label, id, name, readOnly, value, ...props }: TextInputProps) => {
  return (
    <div className={styles.input}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles['input-container']}>
        <input id={id} name={name} value={value} readOnly={readOnly} {...props} />
        {!readOnly && <div className={styles.pencil} />}
      </div>
    </div>
  );
};

export default TextInputWithUnderLine;

import { ChangeEvent, InputHTMLAttributes, useState } from 'react';

import styles from '@/components/TextInputWithUnderLine/TextInputWithUnderLine.module.scss';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  handleChange?: (value: string) => void;
}

const TextInputWithUnderLine = ({
  label,
  handleChange,
  id,
  name,
  readOnly,
  value: initValue = '',
  ...props
}: TextInputProps) => {
  const [value, setValue] = useState(initValue.toString());

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (handleChange) {
      handleChange(newValue);
    }
  };

  return (
    <div className={styles.input}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles['input-container']}>
        <input id={id} name={name} {...props} value={value} onChange={onChange} readOnly={readOnly} />
        {!readOnly && <div className={styles.pencil} />}
      </div>
    </div>
  );
};

export default TextInputWithUnderLine;

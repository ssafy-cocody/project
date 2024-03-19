import { ChangeEvent, InputHTMLAttributes, useState } from 'react';

import Label, { LabelProps } from '@/components/Label';
import styles from '@/components/TextInputWithSearchButton/TextInputWithSearchButton.module.scss';

interface TextInputWithSearchButtonProps extends InputHTMLAttributes<HTMLInputElement>, LabelProps {
  onClickSearchButton?: ({ text }: { text: string }) => void;
}

const TextInputWithSearchButton = ({
  label,
  id,
  name,
  required,
  onClickSearchButton,
  onChange,
  ...props
}: TextInputWithSearchButtonProps) => {
  const [text, setText] = useState('');
  const errorMessage = '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);

    setText(e.target.value);
  };

  const handleClick = () => {
    if (onClickSearchButton) onClickSearchButton({ text });
  };

  return (
    <div className={styles.input}>
      <Label label={label} htmlFor={id} required={required} />
      <div className={styles['input-wrapper']}>
        <input id={id} name={name} required={required} {...props} onChange={handleChange} />
        {errorMessage && <p className={styles['error-messages']}>난 애러에용</p>}
        <button className={styles.search} type="button" onClick={handleClick}>
          검색
        </button>
      </div>
    </div>
  );
};
export default TextInputWithSearchButton;

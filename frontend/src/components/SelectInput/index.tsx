import { ChangeEvent, SelectHTMLAttributes, useState } from 'react';

import Label from '@/components/Label';
import styles from '@/components/SelectInput/SelectInput.module.scss';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: {
    value: string;
    text: string;
  }[];
}

const SelectInput = ({ label, options, value: initValue = '', onChange, ...props }: SelectInputProps) => {
  const [selectedValue, setSelectedValue] = useState(initValue);
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
    setSelectedValue(e.target.value.toString());
  };

  return (
    <>
      {label && <Label label={label} />}
      <select className={styles.select} value={selectedValue} {...props} onChange={handleChange}>
        <option value="">카테고리를 선택하세요.</option>
        {options?.length &&
          options.map(({ value, text }) => {
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
      </select>
    </>
  );
};
export default SelectInput;

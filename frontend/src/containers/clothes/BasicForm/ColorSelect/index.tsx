import { useState } from 'react';
import styled from 'styled-components';

import Label from '@/components/Label';
import styles from '@/containers/clothes/BasicForm/ColorSelect/ColorSelect.module.scss';
import { Color } from '@/types/clothes';

const ColorBox = styled.label<{ color?: string; $isSelected?: boolean }>`
  min-width: 48px;
  width: 48px;
  aspect-ratio: 1;
  border: 1px solid var(--color-lightGray);
  box-sizing: border-box;
  border-radius: 4px;

  box-shadow: ${({ $isSelected }) => ($isSelected ? '0 0 0 2px inset var(--color-main)' : 'none')};
  background: ${({ color }) => color};
`;

const ColorOptions = Object.entries(Color).map(([name, colorCode]) => ({ value: name, colorCode }));

const ColorSelect = ({
  color: initColor,
  disabled,
  onChange: handleChange,
}: {
  color?: keyof typeof Color;
  disabled?: boolean;
  onChange: (color: string) => void;
}) => {
  const [color, setColor] = useState(initColor);

  return (
    <div className={styles['picker-container']}>
      <Label required label="색상" />
      <div className={styles.picker}>
        {disabled && <ColorBox color={color} $isSelected />}
        {!disabled &&
          ColorOptions.map(({ colorCode: backgroundColor, value }) => {
            const id = value;
            const isSelected = color === value;

            return (
              <ColorBox htmlFor={id} key={id} color={backgroundColor} $isSelected={isSelected}>
                <input
                  type="radio"
                  name="color"
                  id={id}
                  value={value}
                  onChange={(e) => {
                    const newcolor = e.target.value.toString() as keyof typeof Color;
                    setColor(newcolor);
                    handleChange(newcolor);
                  }}
                />
              </ColorBox>
            );
          })}
        {/* <ColorPicker /> */}
      </div>
      <span className={styles.desc}>색상을 선택해 주세요.</span>
    </div>
  );
};

export default ColorSelect;

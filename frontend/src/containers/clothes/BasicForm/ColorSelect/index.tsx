import { useState } from 'react';
import styled from 'styled-components';

import Label from '@/components/Label';
import styles from '@/containers/clothes/BasicForm/ColorSelect/ColorSelect.module.scss';
import ColorPicker from '@/containers/clothes/ColorPicker';

const ColorBox = styled.label<{ color: string; $isSelected?: boolean }>`
  width: 48px;
  height: 48px;
  border: 1px solid var(--color-lightGray);
  box-sizing: border-box;
  border-radius: 4px;

  box-shadow: ${({ $isSelected }) => ($isSelected ? '0 0 0 2px inset var(--color-main)' : 'none')};
  background: ${({ color }) => color};
`;

const MOCK_COLORS = [
  { color: '#fff', id: '#fff' },
  {
    color: '#000',
    id: '#000',
  },
];

const ColorSelect = ({ onChange: handleChange }: { onChange: (color: string) => void }) => {
  const [color, setColor] = useState('');

  return (
    <div className={styles['picker-container']}>
      <Label required label="색상" />
      <div className={styles.picker}>
        {MOCK_COLORS.map(({ color: backgroundColor, id }) => {
          const isSelected = color === backgroundColor.toString();

          return (
            <ColorBox htmlFor={id} key={id} color={backgroundColor} $isSelected={isSelected}>
              <input
                type="radio"
                name="color"
                id={id}
                value={backgroundColor.toString()}
                onChange={(e) => {
                  const { value } = e.target;
                  const newcolor = value.toString();
                  setColor(newcolor);
                  handleChange(newcolor);
                }}
              />
            </ColorBox>
          );
        })}
        <ColorPicker />
      </div>
      <span className={styles.desc}>색상을 선택해 주세요.</span>
    </div>
  );
};

export default ColorSelect;

import { ButtonHTMLAttributes } from 'react';

import styles from './SaveButton.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SaveButton = ({ children, ...props }: Props) => {
  return (
    <button className={styles['save-button']} type="button" {...props}>
      {children}
    </button>
  );
};

export default SaveButton;

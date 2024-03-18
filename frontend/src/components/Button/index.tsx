import { ButtonHTMLAttributes } from 'react';

import style from '@/components/Button/Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'white';
  children: React.ReactNode;
}

const Button = ({ variant, children, type, ...props }: ButtonProps) => {
  const buttonType = type || 'button';
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={variant === 'white' ? style.white : style.default} type={buttonType} {...props}>
      {children}
    </button>
  );
};
export default Button;

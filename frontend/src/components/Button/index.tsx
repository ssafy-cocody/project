import { ButtonHTMLAttributes } from 'react';
import style from '@/components/Button/Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'white';
  children: React.ReactNode;
}

const Button = ({ variant, children, ...props }: ButtonProps) => {
  return (
    <>
      <button className={variant === 'white' ? style.white : style.default} {...props}>
        {children}
      </button>
    </>
  );
};
export default Button;

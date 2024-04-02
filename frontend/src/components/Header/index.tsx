'use client';

import { useRouter } from 'next/navigation';

import { LeftArrow } from '@/../public/svgs';
import styles from '@/components/Header/Header.module.scss';
import { HeaderProps } from '@/components/Header/type';

const Header = ({ title, RightComponent, onClickPreviousButton, hasPreviousLink }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className={styles.header}>
      {hasPreviousLink && (
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className={styles['previous-button']}
        >
          <LeftArrow />
        </button>
      )}
      {onClickPreviousButton ? (
        <button className={styles['previous-button']} type="button" onClick={onClickPreviousButton}>
          <LeftArrow />
        </button>
      ) : null}
      <div className={styles['header-title']}>{title}</div>
      {RightComponent && <div className={styles['right-button']}>{RightComponent}</div>}
    </header>
  );
};

export default Header;

'use client';

import Link from 'next/link';

import { LeftArrow } from '@/../public/svgs';
import styles from '@/components/Header/Header.module.scss';
import { HeaderProps } from '@/components/Header/type';

const Header = ({ previousLink, title, RightComponent, onClickPreviousButton }: HeaderProps) => {
  return (
    <header className={styles.header}>
      {previousLink ? (
        <Link href={previousLink} className={styles['previous-button']}>
          <LeftArrow />
        </Link>
      ) : null}
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

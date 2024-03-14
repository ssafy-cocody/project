'use client';

import Link from 'next/link';
import { LeftArrow } from '@/../public/svgs';
import { HeaderProps } from './type';
import styles from './Header.module.scss';

const Header = ({ previousLink, title, RightComponent }: HeaderProps) => {
  return (
    <header>
      {previousLink ? (
        <Link href={previousLink}>
          <div className={styles['previous-button']}>
            <LeftArrow />
          </div>
        </Link>
      ) : null}
      <div className={styles['header-title']}>{title}</div>
      {RightComponent}
    </header>
  );
};

export default Header;

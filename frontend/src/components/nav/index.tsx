'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CalendarIcon, ClosetIcon, HomeIcon, MypageIcon } from '@/../public/svgs';

import styles from './Nav.module.scss';

const Nav = ({ className }: { className?: string }) => {
  const path = usePathname();

  return (
    <nav className={`${styles.container} ${className}`}>
      <Link href="/" className={styles.navigation}>
        <HomeIcon fill={path === '/' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/' ? 'var(--color-main)' : 'black',
          }}
          className={styles['navigation-text']}
        >
          홈
        </span>
      </Link>
      <Link href="/closet" className={styles.navigation}>
        <ClosetIcon fill={path === '/closet' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/closet' ? 'var(--color-main)' : 'black',
          }}
          className={styles['navigation-text']}
        >
          옷장
        </span>
      </Link>
      <Link href="/calendar" className={styles.navigation}>
        <CalendarIcon fill={path === '/calendar' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/calendar' ? 'var(--color-main)' : 'black',
          }}
          className={styles['navigation-text']}
        >
          캘린더
        </span>
      </Link>
      <Link href="/mypage" className={styles.navigation}>
        <MypageIcon fill={path === '/mypage' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/mypage' ? 'var(--color-main)' : 'black',
          }}
          className={styles['navigation-text']}
        >
          마이
        </span>
      </Link>
    </nav>
  );
};

export default Nav;

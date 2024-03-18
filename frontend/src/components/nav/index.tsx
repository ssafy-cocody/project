'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CalendarIcon, ClosetIcon, HomeIcon, MypageIcon } from '@/../public/svgs';

import styles from './Nav.module.scss';

const Nav = () => {
  const path = usePathname();

  return (
    <nav className={styles.container}>
      <Link href="/" className={styles.navigation}>
        <HomeIcon className={styles.icon} fill={path === '/' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/' ? 'var(--color-main)' : 'black',
          }}
        >
          홈
        </span>
      </Link>
      <Link href="/closet" className={styles.navigation}>
        <ClosetIcon className={styles.icon} fill={path === '/closet' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/closet' ? 'var(--color-main)' : 'black',
          }}
        >
          옷장
        </span>
      </Link>
      <Link href="/calendar" className={styles.navigation}>
        <CalendarIcon className={styles.icon} fill={path === '/calendar' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/calendar' ? 'var(--color-main)' : 'black',
          }}
        >
          캘린더
        </span>
      </Link>
      <Link href="/mypage" className={styles.navigation}>
        <MypageIcon className={styles.icon} fill={path === '/mypage' ? 'var(--color-main)' : 'black'} />
        <span
          style={{
            color: path === '/mypage' ? 'var(--color-main)' : 'black',
          }}
        >
          마이
        </span>
      </Link>
    </nav>
  );
};

export default Nav;

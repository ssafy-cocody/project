'use client';

import Link from 'next/link';

import styles from '@/containers/mypage/Menu/Menu.module.scss';

const Menu = () => {
  const menus = [{ text: '내 정보 수정', href: '/mypage/profile' }];

  const handleLogout = () => {};
  return (
    <>
      <div className={styles['menu-container']}>
        <ul>
          {menus.map(({ text, href }) => (
            <Link href={href} key={text}>
              <li>{text}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div className={styles.logout}>
        <button type="button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </>
  );
};

export default Menu;

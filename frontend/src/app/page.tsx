'use client';

import Image from 'next/image';
import Nav from '@/components/nav';
import styles from '@/containers/home/Home.module.scss';

export default function Home() {
  return (
    <>
      <main>
        <header className={styles['home-header']}>
          <Image src="/images/logo.png" alt="Co.Cody 로고" width={130} height={40} />
        </header>
        <div className={styles['home-content']}>
          <div
            style={{
              width: '300px',
              height: '300px',
            }}
          >
            안녕?1
          </div>
          <div
            style={{
              width: '300px',
              height: '300px',
            }}
          >
            안녕?2
          </div>
          <div
            style={{
              width: '300px',
              height: '300px',
            }}
          >
            안녕?3
          </div>
          <div
            style={{
              width: '300px',
              height: '300px',
              backgroundColor: 'var(--color-green)',
            }}
          >
            안녕?4
          </div>
          <div
            style={{
              width: '300px',
              height: '300px',
            }}
          >
            안녕?5
          </div>
        </div>
        <div className={styles['home-navigation']}>
          <Nav></Nav>
        </div>
      </main>
    </>
  );
}

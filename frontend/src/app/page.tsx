'use client';

import Image from 'next/image';
import Nav from '@/components/nav';
import RecommendViewer from '@/containers/home/RecommendViewer';
import RecommendTab from '@/containers/home/RecommendTab';
import RecommendItems from '@/containers/home/RecommendItems';
import styles from '@/containers/home/Home.module.scss';

export default function Home() {
  return (
    <>
      <main>
        <header className={styles['home-header']}>
          <Image src="/images/logo.png" alt="Co.Cody 로고" width={130} height={40} />
        </header>
        <div className={styles['home-content']}>
          <RecommendViewer />
          <RecommendTab />
          <RecommendItems />
        </div>
        <div className={styles['home-navigation']}>
          <Nav></Nav>
        </div>
      </main>
    </>
  );
}

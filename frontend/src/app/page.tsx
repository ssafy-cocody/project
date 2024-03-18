'use client';

import Image from 'next/image';

import Nav from '@/components/nav';
import styles from '@/containers/home/Home.module.scss';
import MyCodyPreview from '@/containers/home/MyCodyPreview';
import RecommendItems from '@/containers/home/RecommendItems';
import RecommendTab from '@/containers/home/RecommendTab';
import RecommendViewer from '@/containers/home/RecommendViewer';

const Home = () => {
  return (
    <main>
      <header className={styles['home-header']}>
        <Image src="/images/logo.png" alt="Co.Cody 로고" width={130} height={40} />
      </header>
      <div className={styles['home-content']}>
        <RecommendViewer />
        <RecommendTab />
        <RecommendItems />
        <MyCodyPreview />
      </div>
      <div className={styles['home-navigation']}>
        <Nav />
      </div>
    </main>
  );
};

export default Home;

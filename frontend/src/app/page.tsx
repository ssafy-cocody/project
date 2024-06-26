'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import Nav from '@/components/Nav';
import styles from '@/containers/home/Home.module.scss';
import MyCodyPreview from '@/containers/home/MyCodyPreview';
import RecommendItems from '@/containers/home/RecommendItems';
import RecommendTab from '@/containers/home/RecommendTab';
import RecommendViewer from '@/containers/home/RecommendViewer';
import { IRecommendCody } from '@/types/recommend';

const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCody, setSelectedCody] = useState<IRecommendCody>({ codyId: 0, codyImage: '/images/logo.png' });

  return (
    <main ref={scrollRef}>
      <header className={styles['home-header']}>
        <Image src="/images/logo.png" alt="Co.Cody 로고" width={130} height={40} />
      </header>
      <div className={styles['home-content']}>
        <RecommendViewer selectedCody={selectedCody} />
        <RecommendTab selectedCody={selectedCody} setSelectedCody={setSelectedCody} />
        <RecommendItems />
        <MyCodyPreview />
      </div>
      <Nav />
    </main>
  );
};

export default Home;

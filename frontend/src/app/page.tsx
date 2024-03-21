'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import Nav from '@/components/Nav';
import styles from '@/containers/home/Home.module.scss';
import MyCodyPreview from '@/containers/home/MyCodyPreview';
import RecommendItems from '@/containers/home/RecommendItems';
import RecommendTab from '@/containers/home/RecommendTab';
import RecommendViewer from '@/containers/home/RecommendViewer';
import useScrollDirection from '@/hooks/useScrollDirection';

const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToTop, setScrolled] = useState<boolean>(false);
  const [isNavShow, setNavShow] = useState<boolean>(true);

  useScrollDirection(
    scrollRef,
    () => {
      setScrolled(false);
      setTimeout(() => setNavShow(false), 500);
    },
    () => {
      setNavShow(true);
      setScrolled(true);
    },
  );

  return (
    <main ref={scrollRef}>
      <header className={styles['home-header']}>
        <Image src="/images/logo.png" alt="Co.Cody 로고" width={130} height={40} />
      </header>
      <div className={styles['home-content']}>
        <RecommendViewer />
        <RecommendTab />
        <RecommendItems />
        <MyCodyPreview />
      </div>
      {isNavShow && <Nav className={`${isScrolledToTop ? styles.scrollToTop : styles.scrollToBottom}`} />}
    </main>
  );
};

export default Home;

'use client';

import { useRef, useState } from 'react';

import Background from '@/components/Background';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import Calendar from '@/containers/calendar/Calendar';
import styles from '@/containers/calendar/Calendar.module.scss';
import useScrollDirection from '@/hooks/useScrollDirection';

const Page = () => {
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
    <>
      <Background $backgroundColor="skyBlue" />
      <Header title="캘린더" />
      <main className={styles.calendar}>
        <Calendar />
      </main>
      {isNavShow && <Nav className={`${isScrolledToTop ? styles.scrollToTop : styles.scrollToBottom}`} />}
    </>
  );
};

export default Page;

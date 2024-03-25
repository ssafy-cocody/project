'use client';

import Background from '@/components/Background';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import Calendar from '@/containers/calendar/Calendar';

const Page = () => {
  return (
    <>
      <Background $backgroundColor="skyBlue" />
      <Header title="캘린더" />
      <main>
        <Calendar />
      </main>
      <Nav />
    </>
  );
};

export default Page;

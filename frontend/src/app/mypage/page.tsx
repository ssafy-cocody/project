import Background from '@/components/Background';
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import Menu from '@/containers/mypage/Menu';

const Page = () => {
  return (
    <>
      <Background $backgroundColor="skyBlue" />
      <Header title="마이페이지" />
      <main>
        <Menu />
      </main>
      <Nav />
    </>
  );
};

export default Page;

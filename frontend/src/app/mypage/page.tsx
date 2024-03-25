import Background from '@/components/background';
import Header from '@/components/Header';
import Nav from '@/components/nav';
import Menu from '@/containers/mypage/Menu';

const Page = () => {
  return (
    <>
      <Header title="마이페이지" />
      <Menu />
      <Background $backgroundColor="skyBlue" />
      <Nav />
    </>
  );
};

export default Page;

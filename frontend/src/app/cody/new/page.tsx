import Background from '@/components/background';
import Header from '@/components/Header';
import Nav from '@/components/nav';
import SaveButton from '@/containers/cody/new/saveButton';

const Page = () => {
  return (
    <>
      <Background $backgroundColor="purple" />
      <Header previousLink="/cody" title="내 코디 만들기" RightComponent={<SaveButton />} />
      <main />
      <Nav />
    </>
  );
};

export default Page;

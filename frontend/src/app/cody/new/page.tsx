import Header from '@/components/header';
import Nav from '@/components/nav';
import Background from '@/components/background';
import SaveButton from '@/containers/cody/new/saveButton';

export default function Page() {
  return (
    <>
      <Background $backgroundColor={'purple'} />
      <Header previousLink="/cody" title="내 코디 만들기" RightComponent={<SaveButton />}></Header>
      <main></main>
      <Nav></Nav>
    </>
  );
}

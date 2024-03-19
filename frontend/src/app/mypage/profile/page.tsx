import Background from '@/components/background';
import Header from '@/components/Header';
import ProfileCard from '@/containers/mypage/profile/ProfileCard';
import styles from '@/containers/mypage/profile/ProfileLayout.module.scss';

const Page = () => {
  return (
    <>
      <Header previousLink="/mypage" title="내 정보 수정" RightComponent="저장" />
      <div className={styles.container}>
        <ProfileCard />
      </div>
      <Background $backgroundColor="skyBlue" />
    </>
  );
};
export default Page;

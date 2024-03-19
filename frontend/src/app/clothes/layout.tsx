import Background from '@/components/background';
import Header from '@/components/Header';
import styles from '@/containers/clothes/ClothesLayout.module.scss';

const ClothesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header previousLink="/closet" title="옷 등록" />
      <div className={styles.container}>{children}</div>
      <Background $backgroundColor="yellow" />
    </>
  );
};

export default ClothesLayout;

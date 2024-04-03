import styles from '@/components/LoadingFullScreen/LoadingFullScreen.module.scss';

const LoadingFullScreen = ({ text, isLoading }: { text: JSX.Element; isLoading?: boolean }) => {
  if (!isLoading) return '';

  return (
    <div className={styles.container}>
      <div className={styles['text-container']}>
        <span className="star">⋆₊</span>
        <div className={styles.text}> {text} </div>
        <span className="star">₊⁺</span>
      </div>
    </div>
  );
};

export default LoadingFullScreen;

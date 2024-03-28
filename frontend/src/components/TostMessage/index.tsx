import styles from '@/components/TostMessage/TostMessage.module.scss';

const TostMessage = ({ tostMessage }: { tostMessage: string }) => {
  return (
    <div className={styles['tost-container']}>
      <span className={styles['tost-message']}>{tostMessage}</span>
    </div>
  );
};

export default TostMessage;

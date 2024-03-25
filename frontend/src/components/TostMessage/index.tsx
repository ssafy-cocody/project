import styles from '@/components/TostMessage/TostMessage.module.scss';

interface Props {
  tostMessage: string;
}

const TostMessage = ({ tostMessage }: Props) => {
  return (
    <div className={styles['tost-container']}>
      <span className={styles['tost-message']}>{tostMessage}</span>
    </div>
  );
};

export default TostMessage;

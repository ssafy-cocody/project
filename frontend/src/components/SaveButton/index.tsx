import styles from './SaveButton.module.scss';

const SaveButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className={styles['save-button']} type="button">
      저장
    </button>
  );
};

export default SaveButton;

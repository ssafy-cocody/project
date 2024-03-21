import styles from './SaveButton.module.scss';

// TODO: 저장 핸들러
const SaveButton = () => {
  return (
    <button className={styles['save-button']} type="button">
      저장
    </button>
  );
};

export default SaveButton;

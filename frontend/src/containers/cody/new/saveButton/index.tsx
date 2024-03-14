import styles from './SaveButton.module.scss';

// TODO: 버튼 클릭시 바텀시트 올라오는 핸들러 필요
const SaveButton = () => {
  return <button className={styles['save-button']}>저장</button>;
};

export default SaveButton;

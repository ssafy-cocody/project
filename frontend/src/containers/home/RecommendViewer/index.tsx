import Image from 'next/image';
import { useState } from 'react';
import styles from '@/containers/home/RecommendViewer/Viewer.module.scss';

const RecommendViewer = () => {
  const [codyUrl, setCody] = useState<string>('/images/test1.jpg');
  const [title, setTitle] = useState<string>('New 코디.');
  const [description, setDescription] = useState<string>(`코코디가 추천하는\n당신의 옷장 속 새로운 코디`);

  return (
    <div className={styles['viewer-container']}>
      <Image className={styles['recommend-image']} src={codyUrl} alt={'추천 코디'} width={150} height={240}></Image>
      <div className={styles['context-area']}>
        <div className={styles['text-area']}>
          <h1 className={styles['title']}>{title}</h1>
          <h3 className={styles['sub-text']}>{description}</h3>
        </div>
        <div className={styles['button-area']}>
          <button className={styles['regist-button']}>
            <div className={styles['inner-border']}>OOTD로 등록</div>
          </button>
          <button className={styles['cody-save-button']}>내 코디로 저장</button>
        </div>
      </div>
    </div>
  );
};

export default RecommendViewer;

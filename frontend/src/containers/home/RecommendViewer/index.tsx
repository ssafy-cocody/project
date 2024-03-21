import Image from 'next/image';
import { useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import styles from '@/containers/home/RecommendViewer/Viewer.module.scss';
import useModal from '@/hooks/useModal';

const RecommendViewer = () => {
  const [codyUrl] = useState<string>('/images/test1.jpg');
  const [title] = useState<string>('New 코디.');
  const [description] = useState<string>(`코코디가 추천하는\n당신의 옷장 속 새로운 코디`);
  const [codyname] = useState<string>('');
  const { Modal, openModal } = useModal();

  const handleSaveCody = () => {
    openModal();
  };

  return (
    <>
      <div className={styles['viewer-container']}>
        <div className={styles['recommend-image']}>
          <Image src={codyUrl} alt="추천 코디" fill />
        </div>
        <div className={styles['context-area']}>
          <div className={styles['text-area']}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles['sub-text']}>{description}</h3>
          </div>
          <div className={styles['button-area']}>
            <button className={styles['regist-button']} type="button">
              <div>OOTD로 등록</div>
            </button>
            <button className={styles['cody-save-button']} type="button" onClick={handleSaveCody}>
              내 코디로 저장
            </button>
          </div>
        </div>
      </div>
      <div id="modal">
        <Modal title="코디 이름을 설정해주세요.">
          <div className={styles['modal-container']}>
            <div className={styles['ootd-image']}>
              <Image src={codyUrl} alt={title} fill />
            </div>
            <div className={styles['input-container']}>
              <TextInput label={codyname} placeholder="코디 이름" />
            </div>
            <div className={styles['button-container']}>
              <Button>
                <span className={styles['button-text']}>저장</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RecommendViewer;

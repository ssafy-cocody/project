import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import TostMessage from '@/components/TostMessage';
import styles from '@/containers/home/RecommendViewer/Viewer.module.scss';
import useModal from '@/hooks/useModal';
import { fetchPostRecommendCodyToOOTD } from '@/services/home';
import { dateDiffAtom } from '@/stores/home';
import { IRecommendCody } from '@/types/recommend';
import { getDate } from '@/utils/getDate';

interface Props {
  selectedCody: IRecommendCody;
}

const RecommendViewer = ({ selectedCody }: Props) => {
  const [title] = useState<string>('New 코디');
  const [description] = useState<string>(`코코디가 추천하는\n당신의 옷장 속\n새로운 코디`);
  const [codyname] = useState<string>('');
  const { Modal, openModal } = useModal();
  const dateDiff = useAtomValue(dateDiffAtom);
  const [isOOTDRegisted, setIsOOTDRegistered] = useState(false);

  const handleSaveCody = () => {};

  const handleRegistOOTD = () => {
    const YYYYMMDD = getDate({ dateDiff });
    const dateRequestFormat = `${YYYYMMDD.slice(0, 4)}-${YYYYMMDD.slice(4, 6)}-${YYYYMMDD.slice(4, 6)}`;

    try {
      fetchPostRecommendCodyToOOTD({ date: dateRequestFormat, codyId: selectedCody.codyId });
      setIsOOTDRegistered(true);
      setTimeout(() => setIsOOTDRegistered(false), 1000);
    } catch (error) {
      alert('OOTD 등록에 실패했습니다.');
    }
  };

  return (
    <>
      <div className={styles['viewer-container']}>
        <div className={styles['recommend-image']}>
          <Image src={selectedCody.codyImage} alt="추천 코디" fill />
        </div>
        <div className={styles['context-area']}>
          <div className={styles['text-area']}>
            <h1 className={styles.title}>{title}</h1>
            <h3 className={styles['sub-text']}>{description}</h3>
          </div>
          <div className={styles['button-area']}>
            <button className={styles['regist-button']} type="button" onClick={handleRegistOOTD}>
              <div>OOTD로 등록</div>
            </button>
            <button className={styles['cody-save-button']} type="button" onClick={openModal}>
              내 코디로 저장
            </button>
          </div>
        </div>
      </div>
      <div id="modal">
        <Modal title="코디 이름을 설정해주세요.">
          <div className={styles['modal-container']}>
            <div className={styles['ootd-image']}>
              <Image src={selectedCody.codyImage} alt={title} fill />
            </div>
            <div className={styles['input-container']}>
              <TextInput label={codyname} placeholder="코디 이름" />
            </div>
            <div className={styles['button-container']}>
              <Button onClick={handleSaveCody}>
                <span className={styles['button-text']}>저장</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      {isOOTDRegisted && <TostMessage tostMessage="OOTD로 등록되었습니다." />}
    </>
  );
};

export default RecommendViewer;

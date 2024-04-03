import { useAtom, useAtomValue } from 'jotai';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import TostMessage from '@/components/TostMessage';
import styles from '@/containers/home/RecommendViewer/Viewer.module.scss';
import useModal from '@/hooks/useModal';
import { fetchPostCreateCody, fetchPostRecommendCodyToOOTD } from '@/services/home';
import { dateDiffAtom, recommendCodyAtom } from '@/stores/home';
import { IRecommendCody } from '@/types/recommend';
import { getDate } from '@/utils/getDate';
import { getValidCodyName } from '@/utils/getValidCodyName';

interface Props {
  selectedCody: IRecommendCody;
}

const RecommendViewer = ({ selectedCody }: Props) => {
  const [title] = useState<string>('New 코디');
  const [description] = useState<string>(`코코디가 추천하는\n당신의 옷장 속\n새로운 코디`);
  const codyName = useRef<string>('');
  const { Modal, openModal, closeModal } = useModal();
  const dateDiff = useAtomValue(dateDiffAtom);
  const [tostMessage, setTostMessage] = useState('');
  const [recommendCody, setRecommendCody] = useAtom(recommendCodyAtom);

  const handleSaveCody = () => {
    if (!getValidCodyName(codyName.current)) {
      setTostMessage('코디 이름은 20글자 이하의 숫자, 한글, 영어만 가능합니다.');
      setTimeout(() => setTostMessage(''), 1000);
    } else {
      try {
        fetchPostCreateCody({ codyId: selectedCody.codyId, name: codyName.current });
        setTostMessage('코디로 등록되었습니다.');
        setTimeout(() => setTostMessage(''), 1000);
        closeModal();
      } catch (error) {
        alert('코디 등록에 실패했습니다.');
      }
    }
  };

  const handleCodyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    // codyName.current = getValidCodyName(e.target.value);
    codyName.current = e.target.value;
  };

  const handleRegistOOTD = () => {
    const YYYYMMDD = getDate({ dateDiff });
    const dateRequestFormat = `${YYYYMMDD.slice(0, 4)}-${YYYYMMDD.slice(4, 6)}-${YYYYMMDD.slice(4, 6)}`;

    try {
      fetchPostRecommendCodyToOOTD({ date: dateRequestFormat, codyId: selectedCody.codyId });
      setTostMessage('OOTD로 등록되었습니다.');
      setTimeout(() => setTostMessage(''), 1000);
      setRecommendCody(
        recommendCody.map((cody) => {
          const { codyId, isMyOotd } = cody;
          if (codyId === selectedCody.codyId) {
            return { ...cody, isMyOotd: true };
          }
          if (isMyOotd) {
            return { ...cody, isMyOotd: false };
          }
          return { ...cody };
        }),
      );
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
              <TextInput placeholder="코디명을 입력하세요" onChange={handleCodyNameChange} label="" />
            </div>
            <div className={styles['button-container']}>
              <Button onClick={handleSaveCody}>
                <span className={styles['button-text']}>저장</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      {tostMessage && <TostMessage tostMessage={tostMessage} />}
    </>
  );
};

export default RecommendViewer;

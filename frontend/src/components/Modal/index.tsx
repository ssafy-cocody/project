import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import styles from '@/components/Modal/Modal.module.scss';
import { ModalProps } from '@/components/Modal/type';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import usePreventScroll from '@/hooks/usePreventScroll';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ModalContent = ({ onClose, isOpen, isUnmount, title, subTitle, children }: ModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isModalMounted, setModalMounted] = useState<boolean>(true);

  // Modal 영역 바깥을 클릭했을 때, close 이벤트를 custom hook에 전달
  useOnClickOutside(ref, () => {
    setModalMounted(false);
    setTimeout(onClose, 600);
  });

  // Modal 영역 바깥 스크롤 방지
  usePreventScroll(isOpen);

  useEffect(() => {
    setModalMounted(true);
    // eslint-disable-next-line no-unused-expressions
    () => setModalMounted(false);
  }, []);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className={styles['modal-overlay']} />
      <div ref={ref} className={`${styles['modal-container']} ${isModalMounted ? styles.isMount : styles.isUnmount}`}>
        <h1 className={styles['modal-title-container']}>
          {title && <div className={styles['modal-title']}>{title}</div>}
          {subTitle && <div className={styles['modal-subtitle']}>{subTitle}</div>}
        </h1>
        {children}
      </div>
    </>,
    document.getElementById('modal') as HTMLElement,
  );
};

export default ModalContent;

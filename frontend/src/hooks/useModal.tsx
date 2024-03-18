import { useState } from 'react';

import ModalContent from '@/components/Modal';
import { ModalContentProps } from '@/components/Modal/type';

const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUnmount, setIsUnmount] = useState<boolean>(false);

  const openModal = () => {
    setIsUnmount(false);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsUnmount(true);

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const Modal = ({ title, subTitle, children }: ModalContentProps) => {
    return (
      <ModalContent onClose={closeModal} isOpen={isOpen} isUnmount={isUnmount} title={title} subTitle={subTitle}>
        {children}
      </ModalContent>
    );
  };

  return { Modal, openModal, closeModal };
};

export default useModal;

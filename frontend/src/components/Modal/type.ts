import { ReactNode } from 'react';

export interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  isUnmount: boolean;
  title?: string;
  subTitle?: string;
  children?: ReactNode;
}

export interface ModalContentProps {
  title?: string;
  subTitle?: string;
  children?: React.ReactNode;
}

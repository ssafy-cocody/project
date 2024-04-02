'use client';

import styled from 'styled-components';

import { BackgroundProps } from '@/components/Background/type';

const BackgroundDiv = styled.div<BackgroundProps>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: var(--zIndex-background);
  background: linear-gradient(
    0deg,
    var(--color-white) 0%,
    var(--color-white) 45%,
    var(--color-${({ $backgroundColor }) => $backgroundColor}) 100%
  );
`;

const Background = ({ $backgroundColor }: BackgroundProps) => {
  return <BackgroundDiv $backgroundColor={$backgroundColor} />;
};

export default Background;

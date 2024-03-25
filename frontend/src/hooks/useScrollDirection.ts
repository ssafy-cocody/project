import { RefObject, useEffect } from 'react';

interface Props {
  ref: RefObject<HTMLDivElement>;
  downFunc: () => void;
  upFunc: () => void;
}

const NAVIGATION_HEIGHT = 80;

const useScrollDirection = ({ ref, downFunc, upFunc }: Props) => {
  useEffect(() => {
    let scrollY = 0;

    const handler = () => {
      if (ref.current) {
        const { scrollTop, clientHeight, scrollHeight } = ref.current;
        // TODO: 끝에 도달했을 때 네비게이션 안나타남
        if (scrollTop + clientHeight >= scrollHeight - NAVIGATION_HEIGHT || scrollTop <= scrollY) {
          upFunc();
        } else {
          downFunc();
        }

        scrollY = scrollTop;
      }
    };

    ref.current?.addEventListener('scroll', handler);

    return () => ref.current?.removeEventListener('scroll', handler);
  }, []);
};

export default useScrollDirection;

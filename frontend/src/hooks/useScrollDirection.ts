import { RefObject, useEffect } from 'react';

const useScrollDirection = (ref: RefObject<HTMLDivElement>, downFunc: () => void, upFunc: () => void) => {
  useEffect(() => {
    let scrollY = 0;

    const handler = () => {
      if (ref.current) {
        const { scrollTop, clientHeight, scrollHeight } = ref.current;
        // TODO: 끝에 도달했을 때 네비게이션 안나타남
        if (scrollTop + clientHeight >= scrollHeight - 80 || scrollTop <= scrollY) {
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

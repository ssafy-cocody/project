import { RefObject, useCallback, useEffect, useState } from 'react';

interface Props {
  ref: RefObject<HTMLDivElement>;
  downFunc: () => void;
  upFunc: () => void;
}

const BOTTOM_PADDING = 16;

const useScrollDirection = ({ ref, downFunc, upFunc }: Props) => {
  const [throttle, setThrottle] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handler = useCallback(() => {
    if (throttle) return;

    setThrottle(true);
    setTimeout(() => {
      if (ref.current) {
        const { scrollTop, clientHeight, scrollHeight } = ref.current;
        if (scrollTop + clientHeight >= scrollHeight - BOTTOM_PADDING) {
          upFunc();
        } else if (scrollTop <= scrollY) {
          upFunc();
        } else {
          downFunc();
        }

        setScrollY(scrollTop);
      }
      setThrottle(false);
    }, 600);
  }, [scrollY]);

  useEffect(() => {
    ref.current?.addEventListener('scroll', handler);
    return () => ref.current?.removeEventListener('scroll', handler);
  }, [handler]);
};

export default useScrollDirection;

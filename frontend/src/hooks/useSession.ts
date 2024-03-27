import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { setAccessToken } from '@/services';
import { userAtom } from '@/stores/user';

/**
 * 클라이언트 사이드에서 session 관리
 */
const useSession = () => {
  const router = useRouter();
  const [session, setSession] = [useAtomValue(userAtom), useSetAtom(userAtom)];

  const getSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/cookie');
      const { accessToken, ...data } = await response.json();
      setAccessToken(accessToken);
      setSession(data);
    } catch (error) {
      router.push('/signin');
    }
  }, [router, setSession]);

  return { session, setSession, getSession };
};
export default useSession;

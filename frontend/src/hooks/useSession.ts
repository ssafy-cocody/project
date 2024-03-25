import { useState } from 'react';

import { IUser } from '@/types/user';

/**
 * 클라이언트 사이드에서 session 관리
 */
const useSession = () => {
  const [session, setSession] = useState<IUser>();

  return { session, setSession };
};
export default useSession;

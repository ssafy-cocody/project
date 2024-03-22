import { useState } from 'react';

import { IUser } from '@/services/auth';

const useSession = () => {
  const [session] = useState<IUser>();

  return { session };
};
export default useSession;

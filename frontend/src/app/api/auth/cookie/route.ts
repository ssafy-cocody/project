import { cookies } from 'next/headers';

import { ACCESS_TOKEN } from '@/services';
import { fetchUserInfo } from '@/services/auth';

export async function GET() {
  const { accessToken, ...data } = await fetchUserInfo();
  cookies().set({ name: ACCESS_TOKEN, value: accessToken, httpOnly: true, secure: true });

  return Response.json({
    accessToken,
    ...data,
  });
}

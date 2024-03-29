import { cookies } from 'next/headers';

import { ACCESS_TOKEN } from '@/services';
import { fetchUserInfo } from '@/services/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { accessToken, ...data } = await fetchUserInfo();

    if (!accessToken) {
      return new Response('Access token is missing', {
        status: 400,
      });
    }

    cookies().set({ name: ACCESS_TOKEN, value: accessToken, httpOnly: true, secure: true });

    return Response.json({
      accessToken,
      ...data,
    });
  } catch (error) {
    return new Response(`${error}`, {
      status: 400,
    });
  }
}

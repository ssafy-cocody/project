import { cookies } from 'next/headers';

import { ACCESS_TOKEN } from '@/services';

export const dynamic = 'force-dynamic';

const endpoint = process.env.NEXT_PUBLIC_API_PUBLIC_ENDPOINT;

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
      credentials: 'include',
      headers: {
        Cookie: cookies().toString(),
      },
    });

    if (!response.ok) {
      const error = new Error(`${response.status} headers${response.headers}`);
      return Promise.reject(error);
    }

    const { ...data } = await response.json();
    const bearerRegexp = /^Bearer\s+(.*)$/;
    const authHeader = response.headers.get('Authorization');
    const matches = authHeader!.match(bearerRegexp);
    const accessToken = matches ? matches[1] : '';

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

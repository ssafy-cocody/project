import { fetchUserInfo } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ACCESS_TOKEN = 'accessToken';

let localAccessToken = '';
const setAccessToken = (token: string) => {
  localAccessToken = token;
};

const getAccessToken = () => localAccessToken;

export { ACCESS_TOKEN, BASE_URL, getAccessToken, setAccessToken };

const HTTPMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

const handleError = (status: number, message: string) => {
  throw new Error(`${status}: ${message}`);
};

const request = async <TResponse>(path: string, config: RequestInit, body?: BodyInit): Promise<TResponse> => {
  const options = { ...config, body };

  const { accessToken } = await fetchUserInfo();
  options.headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(`${BASE_URL}/auth/v1${path}`, { ...options, credentials: 'include' });
  if (!response.ok) {
    response.json().then((res) => console.log(res));
    handleError(response.status, response.statusText);
  }

  return response.json().then((data) => data as TResponse);
};

export const api = {
  get: <TResponse>(path: string): Promise<TResponse> => request<TResponse>(path, { method: HTTPMethods.GET }),

  post: <TResponse, TBody>(path: string, bodyObject?: TBody): Promise<TResponse> => {
    const body = JSON.stringify(bodyObject);
    return request<TResponse>(path, { method: HTTPMethods.POST, body });
  },

  delete: <T>(path: string): Promise<T> => request<T>(path, { method: HTTPMethods.DELETE }),

  put: <T, U>(path: string, bodyObject?: U): Promise<T> => {
    const body = JSON.stringify(bodyObject);
    return request<T>(path, { method: HTTPMethods.PUT, body });
  },
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ACCESS_TOKEN = 'accessToken';

let accessToken = '';

const setAccessToken = (token: string) => {
  accessToken = token;
};

const getAccessToken = () => accessToken;

export { ACCESS_TOKEN, BASE_URL, getAccessToken, setAccessToken };

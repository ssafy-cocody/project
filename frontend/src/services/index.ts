const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let accessToken = '';

const setAccessToken = (token: string) => {
  accessToken = token;
};
const getAccessToken = () => accessToken;

export { BASE_URL, getAccessToken, setAccessToken };

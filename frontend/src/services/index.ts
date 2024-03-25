const BASE_URL = 'https://j10a307.p.ssafy.io/api';

let accessToken = '';

const setAccessToken = (token: string) => {
  accessToken = token;
};
const getAccessToken = () => accessToken;

export { BASE_URL, getAccessToken, setAccessToken };

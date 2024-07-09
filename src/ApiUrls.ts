const API_KEY = 'd132df112b81431a94462c56dfb36fa9';
const BASE_URL = 'https://newsapi.org/';

const ApiURL = {
  getTopHeadlineUrl(queryParams: string) {
    return `${BASE_URL}v2/top-headlines?apiKey=${API_KEY}&${queryParams}`;
  },
};

export default ApiURL;

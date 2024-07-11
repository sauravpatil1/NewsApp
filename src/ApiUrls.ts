const API_KEY = '885974aae1b9493fbcbd6b168ea8609d';
const BASE_URL = 'https://newsapi.org/';

const ApiURL = {
  getTopHeadlineUrl(queryParams: string) {
    return `${BASE_URL}v2/top-headlines?apiKey=${API_KEY}&${queryParams}`;
  },
};

export default ApiURL;

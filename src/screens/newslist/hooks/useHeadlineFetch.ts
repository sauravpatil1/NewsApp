import {useEffect, useState} from 'react';
import NetworkManager from '../../../NetworkManager';
import ApiURL from '../../../ApiUrls';
import DBNewsArticleHelper from '../../../db/utils/newsArticleHelper';

function useHeadlineFetch() {
  const [reload, setReload] = useState(false);
  const fetchAndStoreHeadline = async () => {
    const result = await NetworkManager.makeGetRequest(
      ApiURL.getTopHeadlineUrl('country=us&pageSize=100'),
    );

    await DBNewsArticleHelper.deleteNewsArticleList();
    await DBNewsArticleHelper.addNewsArticleList(result?.articles);
  };
  useEffect(() => {
    fetchAndStoreHeadline();
  }, [reload]);
  const fetchNewHeadline = () => {
    setReload(prev => !prev);
  };
  return fetchNewHeadline;
}

export default useHeadlineFetch;

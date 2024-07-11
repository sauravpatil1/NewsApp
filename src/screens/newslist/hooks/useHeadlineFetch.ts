import {useEffect, useRef, useState} from 'react';
import NetworkManager from '../../../NetworkManager';
import ApiURL from '../../../ApiUrls';
import DBNewsArticleHelper from '../../../db/utils/newsArticleHelper';
import {INewsArticle} from '../../../common/interface';

function useHeadlineFetch() {
  const [reload, setReload] = useState(false);
  const shouldFetchData = useRef<boolean>(true);
  const [isDBUpdated, setIsDBUpdated] = useState<boolean>(false);
  const fetchAndStoreHeadline = async () => {
    shouldFetchData.current = false;
    const result = await NetworkManager.makeGetRequest(
      ApiURL.getTopHeadlineUrl('country=us&pageSize=100'),
    );
    await DBNewsArticleHelper.deleteNewsArticleList();
    await DBNewsArticleHelper.addNewsArticleList(result?.articles);
    setIsDBUpdated(prev => !prev);
    shouldFetchData.current = true;
  };
  useEffect(() => {
    shouldFetchData.current && fetchAndStoreHeadline();
  }, [reload]);
  const fetchNewHeadline = () => {
    setReload(prev => !prev);
  };
  return {fetchNewHeadline, isDBUpdated};
}

export default useHeadlineFetch;

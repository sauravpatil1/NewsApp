import React, {useState, useEffect, useRef} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Header from '../../../common/components/Header';
import Colors from '../../../common/Colors';
import Constants from '../../../common/Constants';
import HeadlineCard from '../components/HeadlineCard';
import RightActionCard from '../components/RightActionCard';
import {INewsArticle} from '../../../common/interface';
import DBNewsArticleHelper from '../../../db/utils/newsArticleHelper';
import useHeadlineFetch from '../hooks/useHeadlineFetch';

function removeDuplicates(articles: INewsArticle[]): INewsArticle[] {
  const uniqueArticlesMap = new Map<string, INewsArticle>();
  articles.forEach(article => {
    uniqueArticlesMap.set(article.id, article);
  });
  return Array.from(uniqueArticlesMap.values());
}

const HeadlinesList = () => {
  const [headlines, setHeadlines] = useState<INewsArticle[]>([]);
  const [pinnedHeadlines, setPinnedHeadlines] = useState<INewsArticle[]>([]);
  const currPageIndexRef = useRef<number>(0);
  const {fetchNewHeadline: fetchNewHeadlineFromApi, isDBUpdated} =
    useHeadlineFetch();

  const setUniqueHeadlines = (newHeadline: INewsArticle[] = []) => {
    setHeadlines(prev =>
      removeDuplicates([...pinnedHeadlines, ...newHeadline, ...prev]),
    );
  };

  const fetchBatchOfHeadlineFromDB = async (count: number) => {
    const headlines = await DBNewsArticleHelper.fetchPaginatedHeadlines(
      currPageIndexRef.current,
      count,
    );
    if (headlines.length === 0) {
      fetchNewHeadlineFromApi();
      currPageIndexRef.current = 0;
    } else {
      if (count == 10) {
        setHeadlines(headlines);
        currPageIndexRef.current += 2;
      } else {
        currPageIndexRef.current++;
        setUniqueHeadlines(headlines);
      }
    }
  };

  const deleteFromList = async (id: string) => {
    setHeadlines(prev => prev.filter(currItem => currItem.id !== id));
    setPinnedHeadlines(prev => prev.filter(currItem => currItem.id !== id));
    await DBNewsArticleHelper.deleteArticleById(id);
  };

  const pinHeadline = async (item: INewsArticle) => {
    const filteredList = pinnedHeadlines.filter(
      currHeadline => item.id === currHeadline.id,
    );
    let pinned = false;
    if (filteredList.length > 0) {
      setPinnedHeadlines(prev =>
        prev.filter(currHeadline => item.id !== currHeadline.id),
      );
    } else {
      setPinnedHeadlines(prev => [item, ...prev]);
      pinned = true;
    }
    await DBNewsArticleHelper.setPinnedHeadline(item, pinned);
  };

  useEffect(() => {
    setUniqueHeadlines();
  }, [pinnedHeadlines]);

  useEffect(() => {
    fetchBatchOfHeadlineFromDB(10);
  }, [isDBUpdated]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchBatchOfHeadlineFromDB(5);
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const renderItem = ({item}: {item: INewsArticle}) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <RightActionCard
            onPinPress={() => {
              pinHeadline(item);
            }}
            onDeletePress={() => {
              deleteFromList(item.id);
              DBNewsArticleHelper.deleteArticleById(item.id);
            }}
          />
        )}
        renderLeftActions={() => null}>
        <HeadlineCard headline={item} />
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Header onRightIconPress={fetchNewHeadlineFromApi} />
      <View style={styles.divider} />
      <FlatList
        data={headlines}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  headlineContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headlineTitle: {
    fontSize: 18,
  },
  divider: {
    height: Constants.dimens.size_2,
    backgroundColor: Colors.grey,
  },
});

export default HeadlinesList;

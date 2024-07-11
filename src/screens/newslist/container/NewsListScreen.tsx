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
import Loader from '../../../common/components/Loader';

function removeDuplicates(articles: INewsArticle[]): INewsArticle[] {
  const result: INewsArticle[] = [];
  const set = new Set<string>();
  for (let i = 0; i < articles.length; i++) {
    if (!set.has(articles[i].id)) {
      result.push(articles[i]);
      set.add(articles[i].id);
    }
  }
  return result;
}

const HeadlinesList = () => {
  const [headlines, setHeadlines] = useState<INewsArticle[]>([]);
  const currPageIndexRef = useRef<number>(0);
  const {fetchNewHeadline: fetchNewHeadlineFromApi, isDBUpdated} =
    useHeadlineFetch();

  const setUniqueHeadlines = async (newHeadline: INewsArticle[] = []) => {
    const pinnedHeadlines = await DBNewsArticleHelper.getPinnedHeadlines();
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
        setUniqueHeadlines(headlines);
        currPageIndexRef.current += 2;
      } else {
        currPageIndexRef.current++;
        setUniqueHeadlines(headlines);
      }
    }
  };

  const deleteFromList = async (id: string) => {
    setHeadlines(prev => prev.filter(currItem => currItem.id !== id));
    await DBNewsArticleHelper.deleteArticleById(id);
  };

  const pinHeadline = async (item: INewsArticle) => {
    await DBNewsArticleHelper.setPinnedHeadline(item);
    await setUniqueHeadlines();
  };

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

  if (headlines.length == 0) return <Loader />;

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

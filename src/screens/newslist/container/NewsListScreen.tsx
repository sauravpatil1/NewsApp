import React, {useState, useEffect, useRef} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import withObservables from '@nozbe/with-observables';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {schemaNames} from '../../../db/strings';
import Header from '../../../common/components/Header';
import Colors from '../../../common/Colors';
import database from '../../../db/database';
import Constants from '../../../common/Constants';
import HeadlineCard from '../components/HeadlineCard';
import RightActionCard from '../components/RightActionCard';
import {INewsArticle} from '../../../common/interface';
import DBNewsArticleHelper from '../../../db/utils/newsArticleHelper';
import useHeadlineFetch from '../hooks/useHeadlineFetch';

const HeadlinesList = () => {
  const [headlines, setHeadlines] = useState<INewsArticle[]>([]);
  const [shouldResetTimer, setShouldResetTimer] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const fetchNewHeadlineFromApi = useHeadlineFetch();
  const pinnedHeadlineRef = useRef<INewsArticle[]>([]);

  const fetchBatchAndSetHeadlines = async (count: number) => {
    const fetchArticle = await DBNewsArticleHelper.fetchAndDeleteRandomArticles(
      count,
    );
    console.log('[Finder] : ', fetchArticle.length);
    if (fetchArticle.length === 0) {
      // fetchNewHeadlineFromApi();
      return;
    }
    setHeadlines(prev => [
      ...pinnedHeadlineRef.current,
      ...fetchArticle,
      ...prev,
    ]);
  };

  const deleteFromList = (id: string) => {
    setHeadlines(prev => prev.filter(currItem => currItem.id !== id));
  };

  const pinHeadline = (item: INewsArticle) => {
    pinnedHeadlineRef.current.push(item);
  };

  useEffect(() => {
    fetchBatchAndSetHeadlines(10);
  }, []);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      fetchBatchAndSetHeadlines(5);
    }, 10000);
    return () => {
      clearInterval(timerRef.current);
    };
  }, [shouldResetTimer]);

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
        onScrollBeginDrag={() => {
          fetchBatchAndSetHeadlines(5);
          setShouldResetTimer(prev => !prev);
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const enhance = withObservables([], () => ({
  headlines: database.collections
    .get(schemaNames.NEWS_ARTICLES)
    .query()
    .observe(),
}));

const EnhancedHeadlinesList = enhance(HeadlinesList);

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

export default EnhancedHeadlinesList;

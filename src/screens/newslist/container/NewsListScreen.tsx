import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import withObservables from '@nozbe/with-observables';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {schemaNames} from '../../../db/strings';
import Header from '../../../common/components/Header';
import Colors from '../../../common/Colors';
import database from '../../../db/database';
import Constants from '../../../common/Constants';
import HeadlineCard from '../components/HeadlineCard';
import ApiURL from '../../../ApiUrls';
import RightActionCard from '../components/RightActionCard';
import {INewsArticle} from '../../../common/interface';
import {Q} from '@nozbe/watermelondb';
import DBNewsArticleHelper from '../../../db/utils/newsArticleHelper';

interface IProps {
  headlines: INewsArticle[];
}

const HeadlinesList = ({headlines}: IProps) => {
  const [pinnedHeadlines, setPinnedHeadlines] = useState([]);

  useEffect(() => {
    fetchHeadlines();
    const interval = setInterval(fetchNewBatch, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchHeadlines = async () => {
    try {
      const response = await fetch(ApiURL.getTopHeadlineUrl('country=us'));
      const result = await response.json();
      await DBNewsArticleHelper.addNewsArticleList(result?.articles);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNewBatch = async () => {
    try {
      const newHeadlines = await database.collections
        .get(schemaNames.NEWS_ARTICLES)
        .query(Q.take(5))
        .fetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePin = (headline: INewsArticle) => {
    database.write(async () => {
      const headlineToPin = await database
        .get(schemaNames.NEWS_ARTICLES)
        .find(headline.id);
      await headlineToPin.destroyPermanently();
    });
  };

  const handleDelete = (headline: INewsArticle) => {
    database.write(async () => {
      const headlineToDelete = await database
        .get(schemaNames.NEWS_ARTICLES)
        .find(headline.id);
      await headlineToDelete.destroyPermanently();
    });
  };

  const renderItem = ({item, index}: {item: INewsArticle; index: number}) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <RightActionCard
            onPinPress={() => {
              handlePin(item);
            }}
            onDeletePress={() => {
              handleDelete(item);
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
      <Header onRightIconPress={fetchNewBatch} />
      <View style={styles.divider} />
      <FlatList
        data={headlines}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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

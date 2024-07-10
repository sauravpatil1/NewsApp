import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {INewsArticle} from '../../../common/interface';
import {navigateToNewsDetailScreen} from '../../../navigationUtils';
import Constants from '../../../common/Constants';
import Colors from '../../../common/Colors';

interface IProps {
  headline: INewsArticle;
}

function HeadlineCard(props: IProps) {
  const {headline} = props;
  if (!headline) return null;
  const {source, author, title, url, urlToImage, publishedAt} = headline;
  const {name} = source || {};
  const onPress = () => {
    navigateToNewsDetailScreen(url);
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.authorContainer}>
        <Text style={styles.sourceName}>{name}</Text>
        <Text style={styles.publishDate}>{publishedAt}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        {urlToImage && (
          <Image source={{uri: urlToImage}} style={styles.image} />
        )}
      </View>
      <Text style={styles.authorName}>{author}</Text>
    </Pressable>
  );
}

export default HeadlineCard;

const styles = StyleSheet.create({
  container: {
    height: Constants.dimens.size_154,
    borderBottomColor: Colors.grey,
    borderBottomWidth: Constants.dimens.size_1,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sourceName: {
    fontSize: Constants.fontSize.size_14,
    fontWeight: '400',
  },
  publishDate: {
    fontSize: Constants.fontSize.size_14,
    fontWeight: '400',
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: Constants.dimens.size_14,
  },
  title: {
    flex: 1,
    fontSize: Constants.fontSize.size_18,
    fontWeight: 'bold',
  },
  image: {
    height: Constants.dimens.size_78,
    width: Constants.dimens.size_78,
    marginStart: Constants.dimens.size_20,
    borderRadius: Constants.dimens.size_14,
  },
  authorName: {
    fontSize: Constants.fontSize.size_12,
    fontWeight: '500',
    marginTop: Constants.dimens.size_8,
  },
});

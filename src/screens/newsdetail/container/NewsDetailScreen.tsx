import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {NavigationParams} from 'react-navigation';
import Loader from '../../../common/components/Loader';
import {useState} from 'react';

interface IProps {
  route: NavigationParams;
}

function NewsDetailScreen(props: IProps) {
  const [loading, setLoading] = useState(true);
  const {url} = props.route?.params || {};
  return (
    <View style={styles.wrapper}>
      <WebView
        style={styles.container}
        source={{uri: url}}
        onLoad={() => setLoading(false)}
      />
      {loading && <Loader style={styles.loader} />}
    </View>
  );
}

export default NewsDetailScreen;

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

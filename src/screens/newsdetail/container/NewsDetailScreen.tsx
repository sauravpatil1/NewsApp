import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import {NavigationParams} from 'react-navigation';

interface IProps {
  route: NavigationParams;
}

function NewsDetailScreen(props: IProps) {
  const {url} = props.route?.params || {};
  return <WebView style={styles.container} source={{uri: url}} />;
}

export default NewsDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

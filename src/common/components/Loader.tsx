import {ActivityIndicator, StyleSheet, View, ViewStyle} from 'react-native';
import Colors from '../Colors';

interface IProps {
  style?: ViewStyle;
}

function Loader({style}: IProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={'large'} />
    </View>
  );
}

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

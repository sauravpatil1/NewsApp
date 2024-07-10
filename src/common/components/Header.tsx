import {Image, Pressable, StyleSheet, View} from 'react-native';
import Constants from '../Constants';
import {SvgXml} from 'react-native-svg';
import refreshXml from '../../assets/Refresh';

const LOGO = require('./../../assets/HeadlineLogo.png');

interface IProps {
  onRightIconPress: () => void;
}

function Header(props: IProps) {
  const {onRightIconPress} = props;
  return (
    <View style={styles.container}>
      <Image source={LOGO} style={styles.logo} />
      <Pressable style={styles.refreshIconContainer} onPress={onRightIconPress}>
        <SvgXml xml={refreshXml} />
      </Pressable>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    height: Constants.dimens.size_74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: Constants.dimens.size_32,
    width: Constants.dimens.size_112,
  },
  refreshIcon: {
    height: Constants.dimens.size_28,
    width: Constants.dimens.size_28,
  },
  refreshIconContainer: {
    marginEnd: Constants.dimens.size_20,
  },
});

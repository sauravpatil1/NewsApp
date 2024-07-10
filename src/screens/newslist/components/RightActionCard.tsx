import {Pressable, StyleSheet, Text, View} from 'react-native';
import Constants from '../../../common/Constants';
import Colors from '../../../common/Colors';
import {SvgXml} from 'react-native-svg';
import deleteXml from '../../../assets/Delete';
import pinXml from '../../../assets/Pin';

interface IProps {
  onDeletePress: () => void;
  onPinPress: () => void;
}

function RightActionCard(props: IProps) {
  const {onDeletePress, onPinPress} = props;
  return (
    <View style={styles.container}>
      <Pressable style={styles.iconContainer} onPress={onDeletePress}>
        <SvgXml xml={deleteXml} />
        <Text style={styles.text}>Delete</Text>
      </Pressable>
      <Pressable style={styles.iconContainer} onPress={onPinPress}>
        <SvgXml xml={pinXml} />
        <Text style={styles.text}>Pin</Text>
      </Pressable>
    </View>
  );
}

export default RightActionCard;

const styles = StyleSheet.create({
  container: {
    height: Constants.dimens.size_124,
    width: Constants.dimens.size_64,
    backgroundColor: Colors.pacificBlue,
    marginStart: Constants.dimens.size_12,
    borderTopLeftRadius: Constants.dimens.size_12,
    borderBottomLeftRadius: Constants.dimens.size_12,
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontSize: Constants.fontSize.size_12,
    color: Colors.white,
  },
  iconContainer: {
    alignItems: 'center',
  },
});

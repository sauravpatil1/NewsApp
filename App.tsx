import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import RootNavigation from './src/RootNavigation';
import Colors from './src/common/Colors';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import database from './src/db/database';
import SplashScreen from 'react-native-splash-screen';

function App(): React.JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <DatabaseProvider database={database}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.greyishBlack} />
        <RootNavigation />
      </SafeAreaView>
    </DatabaseProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

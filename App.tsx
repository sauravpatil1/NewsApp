import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import RootNavigation from './src/RootNavigation';
import Colors from './src/common/Colors';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import database from './src/db/database';

function App(): React.JSX.Element {
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

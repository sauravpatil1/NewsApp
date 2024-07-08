import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Constants from './common/Constants';
import NewsListScreen from './screens/newslist/container/NewsListScreen';
import {navigationRef} from './navigationUtils';

const Stack = createNativeStackNavigator();

const routeConfig = {
  [Constants.screens.newsListScreen]: {
    screen: NewsListScreen,
  },
};

const screenOptions = {header: () => null};

function RootNavigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={Constants.screens.newsListScreen}
        screenOptions={screenOptions}>
        {Object.keys(routeConfig).map(screenName => {
          const screenComponent = routeConfig[screenName].screen;
          return (
            <Stack.Screen
              name={screenName}
              component={screenComponent}
              key={screenName}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;

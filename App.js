import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import * as firebase from 'firebase';
import expo from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import reducers from './src/reducers';
import { MainStack } from './src/router';
import { StackNavigator ,  TabNavigator } from 'react-navigation';

const store = createStore(reducers, applyMiddleware(ReduxThunk));

export default class AngryJoe extends Component {

state = { loggedIn: null };

componentWillMount() {
  const firebaseConfig = {
    apiKey: "AIzaSyB0T9UAZEEix0G8sHQQCrqdjl2ZptPY-jc",
    authDomain: "angry-joe.firebaseapp.com",
    databaseURL: "https://angry-joe.firebaseio.com",
    projectId: "angry-joe",
    storageBucket: "angry-joe.appspot.com",
    messagingSenderId: "121449136315"
  };
   firebase.initializeApp(firebaseConfig);

  this.getLocationAsync();
}

async getLocationAsync() {
  const { Location, Permissions } = Expo;

  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    return Location.getCurrentPositionAsync({enableHighAccuracy: true});
  } else {
    Alert.alert(
  'Warning',
  'This app will not function without your permission! Please fix in settings',
  [
    {text: 'OK', onPress: () => console.log("first if")},
  ],
  { cancelable: false }
)
  }
}

  render() {
    return (

      <Provider store={(store)}>
      <View style={{ flex: 1 }}>
        <MainStack />
      </View>
      </Provider>
    );
  }
}

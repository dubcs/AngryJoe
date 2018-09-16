import React, { Component } from 'react';
import { createStackNavigator ,  addNavigationHelpers, createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { Button } from 'react-native-elements';
import LoginForm from './components/LoginForm';
import AngryJoeMap from './components/AngryJoeMap';
import createUser from './components/createUser';
import JoeMobileRequests from './components/JoeMobileRequests';


export const Stack = createStackNavigator({
  LoginForm: { screen: LoginForm },
  CreateUser: { screen: createUser}
},
{
  mode: 'modal',
  headerMode: 'none',
});

export const JoeStack = createStackNavigator({
  AngryJoe: {screen: AngryJoeMap},
  RequestList: {screen: JoeMobileRequests},
},
{
  mode: 'modal',
  headerMode: 'none',
});
export const MainStack = createSwitchNavigator({
  First: {screen: Stack},
  Second: {screen: JoeStack},
});


class Nav extends Component {
  render(){
    return (
      <MainStack navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.navigation,
      })}
      />
    )
  }
}

const mapStateToProps = state => ({
  navigation: state.navigation
});

export default connect(mapStateToProps)(Nav);

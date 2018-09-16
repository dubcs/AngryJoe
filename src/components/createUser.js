import React, { Component } from 'react';
import { Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { createEmailChanged,
        createPasswordChanged,
        createUsernameChanged,
        saveUser,
        createFirstNameChanged,
        createLastNameChanged,
        } from '../actions';
import { Button, Card, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const SPLASH_IMAGE = require('../images/splash.png')

class createUser extends Component {
  state = {
    loggedIn: false,
  }


onEmailChange(text) {
  this.props.createEmailChanged(text);
}
onPasswordChange(text) {
   this.props.createPasswordChanged(text);
}
onUsernameChange(text) {
   this.props.createUsernameChanged(text);
}
onFirstNameChange(text) {
  this.props.createFirstNameChanged(text);
}
onLastNameChange(text) {
  this.props.createLastNameChanged(text);
}
onButtonPress() {
 const { email, password, username, firstname, lastname } = this.props;
 this.props.saveUser({ email, password, username, firstname, lastname });
}
onNextButtonPress() {
  this.setState({loggedIn:true});
}
onBackButtonPress(){
  this.props.navigation.goBack();
}
render() {
  return(
    <KeyboardAwareScrollView style={styles.container}>
    <View style={styles.container}>
        <Card>
          <Input
            placeholder="EMAIL"
            value={this.props.email}
            onChangeText={this.onEmailChange.bind(this)}
            />
        </Card>
        <Card>
          <Input
            secureEntry
            placeholder="PASSWORD"
            secureTextEntry
            value={this.props.password}
            onChangeText={this.onPasswordChange.bind(this)}
            />
        </Card>
        <Card>
            <Input
              placeholder="USERNAME"
              value={this.props.username}
              onChangeText={this.onUsernameChange.bind(this)}
              />
        </Card>
        <Card>
            <Input
              placeholder="FIRST NAME"
              value={this.props.firstname}
              onChangeText={this.onFirstNameChange.bind(this)}
              />
        </Card>
        <Card>
            <Input
              placeholder="LAST NAME"
              value={this.props.lastname}
              onChangeText={this.onLastNameChange.bind(this)}
              />
        </Card>
        <Button
            title="CREATE USER"
            titleStyle = {{color:'black'}}
            buttonStyle = {{backgroundColor: 'red'}}
            containerStyle={{padding:15, alignSelf:'stretch'}}
            onPress={this.onButtonPress.bind(this)}
        />
          <Button
            title="go back to Login"
            titleStyle = {{color:'black', fontSize:12}}
            buttonStyle = {{backgroundColor: 'red', borderRadius:30}}
            containerStyle={{paddingTop:20, alignSelf:'center'}}
            onPress={this.onBackButtonPress.bind(this)}
          />
          </View>
          </KeyboardAwareScrollView>
  );
}
}
const mapStateToProps = state => {

  return {
    email: state.createUser.email,
    password: state.createUser.password,
    username: state.createUser.username,
    firstname: state.createUser.firstname,
    lastname: state.createUser.lastname,
    error: state.createUser.error
  };
};

const styles = {
  errorStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  container: {
   flex: 1,
   flexDirection: 'column',
   //justifyContent: 'center',
   paddingTop: 30,
   backgroundColor:'black'
 },

};
export default connect(mapStateToProps, {
      createEmailChanged,
      createPasswordChanged,
      createUsernameChanged,
      saveUser,
      createFirstNameChanged,
      createLastNameChanged,
    })(createUser);

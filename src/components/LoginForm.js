import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Text, View, ActivityIndicator, Image, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { emailChanged,
        passwordChanged,
        loginUser,
        authState,
        facebook
        } from '../actions';
import { Button, Input, Card, SocialIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const JOE_IMAGE = require('../images/angry_joe_label600.png');

class LoginForm extends Component {

state = {
  forgotPassword:false,
  loading:false,
  isLoggedin:false,
}

async componentDidMount() {
  this.setState({loading:true});
  this.props.authState();
}
componentWillReceiveProps(nextProps){
  if(nextProps.isLoggedin){
      this.props.navigation.navigate('Second');
    } else {
       this.setState({loading: false});
    }
}

onEmailChange = (text)  => {
  this.props.emailChanged(text);
}
onPasswordChange(text) {
   this.props.passwordChanged(text);
}
onButtonPress() {
  this.setState({loading:true});
  const { email, password } = this.props;
  this.props.loginUser({ email, password }, () =>{
    if (this.props.isLoggedin){
      this.props.navigation.navigate('Second');
    }
  });
}

onCreateButtonPress(){
   this.props.navigation.navigate('CreateUser');
}

onForgotButtonPress(){
   this.setState({forgotPassword:true});
}

onForgotGoBackButtonPress(){
  this.setState({forgotPassword:false});
}

onEmailEnteredButtonPress(){
  var auth = firebase.auth();
  auth.sendPasswordResetEmail(this.props.email).then(() => {
    this.setState({forgotPassword:false});

 }).catch((error) => {
    console.log("an error occurred");
 });
}
onFacebookButtonPress(){
  this.props.facebook(() => {
    if (this.props.isLoggedin) {
      this.props.navigation.navigate('Second');
    }
  });
}

render(){
  if (this.state.loading) {
    return(
      <View style={{flex:1 , justifyContent:'center', alignItems:'center',backgroundColor:'black'}}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
  return (
    <KeyboardAwareScrollView style={{flex:1, backgroundColor:'black'}}>
    <View style={{flex:1, backgroundColor:'black'}}>
    <Image
      source={JOE_IMAGE}
      style={{alignSelf:'center',
      height:150,
      width:150,
      marginTop: 40,
      marginBottom: 20,
    }}
    />
    <Card>
      <Input
        leftIcon={{ type: 'font-awesome', name: 'envelope-open' }}
        placeholder="EMAIL"
        value={this.props.email}
        onChangeText={(text) => this.onEmailChange(text)}
      />
      </Card>
      <Card>
      <Input
        leftIcon={{ type: 'font-awesome', name: 'key' }}
        secureEntry
        placeholder="PASSWORD"
        value={this.props.password}
        onChangeText={this.onPasswordChange.bind(this)}
      />
      </Card>
      <Button
        title="Login"
        titleStyle = {{color:'black'}}
        buttonStyle = {{backgroundColor: 'red'}}
        containerStyle={{paddingRight:15,paddingLeft: 15, paddingTop:20, alignSelf:'stretch'}}
        onPress={this.onButtonPress.bind(this)}
      />
      <Button
          title="Create an Account"
          titleStyle = {{color:'black'}}
          buttonStyle = {{backgroundColor: 'red'}}
          containerStyle={{paddingRight:15, paddingLeft:15, paddingTop:10,paddingBottom:20,alignSelf:'stretch'}}
          onPress={this.onCreateButtonPress.bind(this)}
      />

      <SocialIcon
        title='Sign In With Facebook'
        onPress={this.onFacebookButtonPress.bind(this)}
        button
        type='facebook'
       style={{}}
      />

      <Button
        title="forgot password"
        titleStyle = {{color:'black', fontSize:12}}
        buttonStyle = {{backgroundColor: 'red'}}
        containerStyle={{padding:20, alignSelf:'center'}}
        onPress={this.onForgotButtonPress.bind(this)}
      />
      </View>
    </KeyboardAwareScrollView>
  );
}
renderButton() {
if (this.state.forgotPassword){
  return (
    <Button
      title="Send password reset email"
      titleStyle = {{color:'silver'}}
      buttonStyle = {{backgroundColor: 'rgba(92, 99,216, 1)', borderRadius:30}}
      containerStyle={{padding:5,paddingTop:20, alignSelf:'stretch'}}
      onPress={this.onEmailEnteredButtonPress.bind(this)}
    />
  );

}
return (
   <Button
     title="Login"
     titleStyle = {{color:'silver'}}
     buttonStyle = {{backgroundColor: 'rgba(92, 99,216, 1)', borderRadius:30}}
     containerStyle={{padding:5,paddingTop:20, alignSelf:'stretch'}}
     onPress={this.onButtonPress.bind(this)}
   />
 );
}

_loadScreen = () => {
if (this.state.forgotPassword){
  return (
    <KeyboardAvoidingView style={styles.container}
      behavior="padding"
      >
      {this.renderButton()}
      <Text style={styles.errorStyle}>
      there was a problem with your login
      </Text>
      <Button
        title="go back"
        titleStyle = {{color:'silver', fontSize:12}}
        buttonStyle = {{backgroundColor: 'rgba(92, 99,216, 1)', borderRadius:30}}
        containerStyle={{padding:20, alignSelf:'center'}}
        onPress={this.onForgotGoBackButtonPress.bind(this)}
      />
      </KeyboardAvoidingView>
  );
}
return (
<View style={styles.container}>

  <Card>
    <Input
    placeholder="user@gmail.com"
    label="email"
    value={this.props.email}
    onChangeText={this.onEmailChange.bind(this)}
    />
    </Card>

    <Card>
    <Input
      secureEntry
      placeholder="password"
      label='password'
      value={this.props.password}
      onChangeText={this.onPasswordChange.bind(this)}
    />
    </Card>

        {this.renderButton()}
        <Text style={styles.errorStyle}>
        {this.props.error}
        </Text>
         <Button
             title="Create an Account"
             titleStyle = {{color:'silver'}}
             buttonStyle = {{backgroundColor: 'rgba(92, 99,216, 1)', borderRadius:30}}
             containerStyle={{padding:5, alignSelf:'stretch'}}
             onPress={this.onCreateButtonPress.bind(this)}
         />
         <Button
           title="forgot password"
           titleStyle = {{color:'silver', fontSize:12}}
           buttonStyle = {{backgroundColor: 'rgba(92, 99,216, 1)', borderRadius:30}}
           containerStyle={{padding:20, alignSelf:'center'}}
           onPress={this.onForgotButtonPress.bind(this)}
         />
    </View>
  );
}

}
const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading,
    isLoggedin: state.auth.isLoggedin,
    user: state.auth.user

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
   paddingTop: 10,
   backgroundColor:'silver'
 },

};
export default connect(mapStateToProps, { emailChanged, passwordChanged, loginUser,authState, facebook })(LoginForm);

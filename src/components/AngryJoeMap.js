import React, { Component } from 'react';
import { Text,
  View,
  Image,
  ActivityIndicator,
  WebView,
  Animated,
  Easing,
  Alert,
  AsyncStorage} from 'react-native';
import * as firebase from 'firebase';
import _ from 'lodash';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { Avatar, Button, Input, Overlay } from 'react-native-elements';
import { setVanLocation,
  getVanLocation,
  requestChange,
  submitRequest,
  requestAdmin,
  logout,
  shutOffVan,
  getToggle,
  updateVanLocation,
  updateToggle,} from '../actions'
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome';


const {Marker} = MapView;
const MARKER_IMAGE = require('../images/jo_taur300.png');
const JOE_IMAGE = require('../images/angry_joe_label600.png');
const GYM_MARKER_IMAGE = require('../images/angryjoe_s&n_logo3.png');


class AngryJoeMap extends Component {
  constructor () {
    super()
    this.spinValue = new Animated.Value(0)
  }
  state = {
    loading: true,
    showWeb:false,
    showDirection:false,
    showRequestInput:false,
    showOverlay:false,
    joeRegion: {
      latitude: 36.00658497202616,
      latitudeDelta: 0.042198005703113495,
      longitude: -115.26180398289443,
      longitudeDelta: 0.02665052464560347,
    },
    region: {
        latitude:0,
        longitude: 0,
        latitudeDelta: 0.0122,
        longitudeDelta:0.0041
      },
    userRegion:{
      latitude: 36.00658497202616,
      latitudeDelta: 0.042198005703113495,
      longitude: -115.26180398289443,
      longitudeDelta: 0.02665052464560347,
    },
  }
async componentDidMount(){

}
spin () {
  this.spinValue.setValue(0)
  Animated.timing(
    this.spinValue,
    {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear
    }
  ).start(() => this.spin())
}
async componentWillMount() {
  this.spin();
  const soundObject = new Expo.Audio.Sound();
  try {
    await soundObject.loadAsync(require('../sounds/sinta-tulo.mp3'));
    await soundObject.playAsync();
    // Your sound is playing!
  } catch (error) {
    // An error occurred!
  }
  this.props.getVanLocation();
  this.props.requestAdmin();
  this.props.getToggle();
  this.props.updateVanLocation();
  this.props.updateToggle();
  await this.setState({loading:true});
  await navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLocation = [position.coords.latitude, position.coords.longitude];
      const region = {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta:0.0041
          }
        setTimeout(() => this.setState({loading:false,
          region:this.props.joe,
          joeRegion: this.props.joe,
          userRegion: region}),3000);
        });
}
async onRegionChangeComplete(region){
  await this.setState({region});
}
async onDirectionsButtonPress(){
  await this.setState({showDirections:!this.state.showDirections});
  if (this.state.showDirections){
  await navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLocation = [position.coords.latitude, position.coords.longitude];
      const region = {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta:0.0041
          }
        setTimeout(() => this.setState({loading:false,
          region:this.props.joe,
          joeRegion: this.props.joe,
          userRegion: region}),3000);
        });
  }
}
async onShopButtonPress(){
    this.setState({showWeb:true});
}
onPromoButtonPress(){
    this.setState({showOverlay:!this.state.showOverlay});
}
async onRequestButtonPress(){
  this.setState({showRequestInput:!this.state.showRequestInput});
}
async onSetVanButtonPress(){
  await navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLocation = [position.coords.latitude, position.coords.longitude];
      const region = {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta:0.0041
          }
        this.props.setVanLocation(region);
        setTimeout(() => this.setState({loading:false,
          region: region,
          joeRegion: region,
          userRegion: region}),3000);
        });
}
async onSubmitButtonPress(){
  this.props.submitRequest(this.props.request);
}
async onRequestListButtonPress(){
  this.props.navigation.navigate('RequestList')
}
async onLogoutButtonPress(){
  //this.props.logout();
  Alert.alert(
      'Warning',
      'Are You sure you want to logout?',
    [
       {text: 'Cancel', onPress: () => console.log('Cancel Pressed'),},
       {text: 'OK', onPress: () => {

          AsyncStorage.removeItem('fb_token');
          firebase.auth().signOut().then(() => {
           this.props.navigation.navigate('First');
         }).catch((e) => console.log(e));
       },
       },
    ],
      { cancelable: false }
    )
};
onShutOffButtonPress = () => {
  this.props.shutOffVan();
}
onRequestChange(text){
  this.props.requestChange(text);
}
showRequestInput = () => {
  if (this.state.showRequestInput){
    return(
      <View style={{flexDirection:'row',marginTop: 80, position:'absolute',padding:10 }}>
        <Input
        containerStyle={{ width:300}}
          leftIcon={{ type: 'font-awesome', name: 'map-pin' }}
          placeholder="Enter your spot!"
          value={this.props.request}
          onChangeText={this.onRequestChange.bind(this)}
        />
        <Button
          buttonStyle={{height:30, backgroundColor: 'red'}}
          title="SUBMIT"
          onPress={this.onSubmitButtonPress.bind(this, this.props.request)}
          titleStyle={{ color:"black" , fontSize:12, fontWeight: 'bold'}}
        />
      </View>
    );
  }
}
showDirections = () => {
  if (this.state.showDirections){
    if (this.props.toggle){
        return(
          <MapViewDirections
            origin={{latitude: this.state.userRegion.latitude, longitude: this.state.userRegion.longitude}}
            destination={{latitude: this.props.joe.latitude, longitude: this.props.joe.longitude}}
            strokeWidth={3}
            strokeColor="red"
            apikey={'AIzaSyBf3bUbARGR94LhAHBI0N2NofYjClO5cr4'}
          />
        );
      }
      return (
        <MapViewDirections
          origin={{latitude: this.state.userRegion.latitude, longitude: this.state.userRegion.longitude}}
          destination={{ latitude:36.079481, longitude:-115.111187}}
          strokeWidth={3}
          strokeColor="red"
          apikey={'AIzaSyBf3bUbARGR94LhAHBI0N2NofYjClO5cr4'}
        />
      );
  }
}
showVanMarker = () => {
  if (this.props.toggle){
  return (
    <Marker
      coordinate={{longitude:this.props.joe.longitude, latitude:this.props.joe.latitude}}
      title={"THE ANGRY JOE MOBILE"}
      image={MARKER_IMAGE}
    />
  );
}
}
requestsButton = () => {

  if(this.props.admin){
    return (
        <View style={{alignSelf:'flex-end', position:'absolute', paddingTop: 50, paddingRight: 20}}>
          <Button
            buttonStyle={{height:30, backgroundColor: 'red', borderColor:'black', borderWidth:1}}
            title="Set Van Location"
            onPress={this.onSetVanButtonPress.bind(this)}
            titleStyle={{ color:"black" , fontSize:12, fontWeight: 'bold'}}
            containerStyle={{paddingBottom:5}}
          />
        <Button
          buttonStyle={{height:30,backgroundColor: 'red', borderColor:'black', borderWidth:1}}
          title="show request list"
          onPress={this.onRequestListButtonPress.bind(this)}
          titleStyle={{ color:"black" , fontSize:10, alignSelf:'center', justifyContent: 'center'}}
          containerStyle={{paddingBottom:5}}
        />
        <Button
          buttonStyle={{height:30,backgroundColor: 'red', borderColor:'black', borderWidth:1}}
          title="shut off Van Location"
          onPress={this.onShutOffButtonPress.bind(this)}
          titleStyle={{ color:"black" , fontSize:10, alignSelf:'center', justifyContent: 'center'}}
        />
        </View>
      );

  }
  return (
    <View style={{alignSelf:'center', position:'absolute', paddingTop: 50,
     paddingRight: 20}}>
      <Button
        buttonStyle={{height:30, backgroundColor: 'red', borderColor:'black', borderWidth:1}}
        title="Request THE JOE MOBILE!"
        onPress={this.onRequestButtonPress.bind(this)}
        titleStyle={{ color:"black" , fontSize:12, fontWeight: 'bold'}}
      />
    </View>
  );

}
render(){
  console.ignoredYellowBox = ['Setting a timer'];
  const spin = this.spinValue.interpolate({
   inputRange: [0, 1],
   outputRange: ['0deg', '360deg']
 })
  if (this.state.loading) {
    return(
      <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor:'black'}}>
        <Animated.Image
          style={{
            width: 227,
            height: 200,
            transform: [{rotate: spin}] }}
            source={JOE_IMAGE}
        />
      </View>
    );
  }
  if (this.state.showWeb){
    return(

      <View style={{flex: 1, alignSelf: 'stretch',backgroundColor:'black'}}>
      <WebView
        source={{uri: 'http://www.mcssl.com/store/4e16fe30907a419596fd6fb6b11d90'}}
        style={{marginTop:20, backgroundColor:'black'}}
        />
        <View style={{alignSelf:'flex-end', position:'absolute', paddingTop: 50, paddingRight: 20}}>
          <Button
            buttonStyle={{height:30, backgroundColor: 'red'}}
            title="Back To App!"
            onPress={() => this.setState({showWeb:false})}
            titleStyle={{ color:"black" , fontSize:12, fontWeight: 'bold'}}
          />
        </View>
      </View>
    );

  }
    return (
      <View style={{ flex: 1 , alignSelf: 'stretch'}}>
      <MapView
        showsUserLocation={true}
        followUserLocation={true}
        style={{ flex: 1 , alignSelf: 'stretch'}}
        onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
        loadingEnabled={true}
        region={this.state.region}
      >
      <Marker
        coordinate={{longitude:-115.111187, latitude:36.079481}}
        title={"2900 E. Patrick Ln #4b, Las Vegas, NV 89120"}
        image={GYM_MARKER_IMAGE}
      />
      {this.showVanMarker()}
      {this.showDirections()}
      </MapView>
      <View style={{alignSelf:'flex-start', position:'absolute', paddingLeft: 5, paddingTop:20,
       paddingRight: 20}}>
      <Button

        buttonStyle={{height:30, width: 50,backgroundColor: 'red', borderColor:'black', borderWidth:1}}
        title="Logout"
        onPress={this.onLogoutButtonPress.bind(this)}
        titleStyle={{ color:"black" , fontSize:10, alignSelf:'center', justifyContent: 'center'}}
      />
      </View>
      {this.requestsButton()}
      {this.showRequestInput()}
      <Overlay
        isVisible={this.state.showOverlay}
        overlayBackgroundColor="red"
        onBackdropPress={() => this.setState({showOverlay: false})}
        width={200}
        height={200}
      >
        <Text>Thanks for supporting Angry Joe!  Please check back soon</Text>
      </Overlay>
    <View style={styles.imageStyle}>
      <Button
        buttonStyle={{ height:30, backgroundColor: 'black'}}
        title="QUICKEST ROUTE TO THE ANGRY JOE MOBILE"
        onPress={this.onDirectionsButtonPress.bind(this)}
        titleStyle={{ color:"red", fontSize: 12, fontWeight: 'bold' }}
        containerStyle={{ marginTop: 10 }}
      />
      <Button
          buttonStyle={{ height:30, backgroundColor: 'black'}}
          title="CHECK PROMO"
          onPress={this.onPromoButtonPress.bind(this)}
          titleStyle={{ color:"red", fontSize: 12 , fontWeight:'bold'}}
          containerStyle={{ marginTop: 10 }}
      />
      <Button
        buttonStyle={{ height:40, backgroundColor: 'red'}}
        title="SHOP NOW!"
        onPress={this.onShopButtonPress.bind(this)}
        titleStyle={{ color:"black", fontSize: 18 , fontWeight:'bold'}}
        containerStyle={{ marginTop: 10 }}
      />
      </View>

      </View>
    );
  }

}
 const mapStateToProps = state => {
if (state.joeMap.request){
   return {
     request:state.joeMap.request
   };
  }
  const { joe, admin, toggle } = state.joeMap;
  if (joe || admin || toggle) {
    return { joe, admin, toggle };
      }

};

const styles = {
  imageStyle: {
    position: 'absolute',
    bottom:20,
    left:10,
    right:10,
  },

};

export default connect(mapStateToProps, {setVanLocation,
  getVanLocation,
  requestChange,
  submitRequest,
  requestAdmin,
  logout,
  shutOffVan,
  getToggle,
  updateVanLocation,
  updateToggle})(AngryJoeMap);

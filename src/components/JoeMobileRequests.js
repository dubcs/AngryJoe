import firebase from 'firebase';
import _ from 'lodash';
import React, { Component } from 'react';
import { Text, View, FlatList} from 'react-native';
import { connect } from 'react-redux';
import {Card, Button } from 'react-native-elements';
import { getRequests } from '../actions';


class JoeMobileRequests extends Component {
  componentDidMount() {
    this.props.getRequests();

  }
  onBackButtonPress = () => {
    this.props.navigation.goBack();
  }
   renderFlatListItem(item) {
     return (
       <View >
        <Card>
            <Text>{item.location} + {item.firstname} {item.lastname}
            </Text>
            </Card>
       </View>
     )
   }
  render() {
console.ignoredYellowBox = ['Setting a timer'];
    return (
      <View>
        <View style={{paddingTop:100}}>
          <FlatList
            extraData={this.state}
            data={this.props.requests}
            renderItem={({item}) => this.renderFlatListItem(item)}
            keyExtractor={(item, index) => (String(item.key) )}
          />
        </View>
        <View style={{alignSelf:'flex-end', position:'absolute', paddingTop: 50, paddingRight: 20}}>
          <Button
            buttonStyle={{height:30, backgroundColor: 'red', borderColor:'black', borderWidth:1}}
            title="back"
            onPress={this.onBackButtonPress.bind(this)}
            titleStyle={{ color:"black" , fontSize:12, fontWeight: 'bold'}}
            containerStyle={{paddingBottom:5}}
          />
          </View>
          </View>
    );
  }
}


const mapStateToProps = state => {
var requests = [];
var objectArray = _.values(state.requests);
objectArray = _.flatten(objectArray);
  objectArray.map((request) => {
    const {
      email,
      key,
      firstname,
      lastname,
      location,
    } = request;
requests.push({
  email,
  key,
  firstname,
  lastname,
  location,
  });
});
return {requests};
};


export default connect(mapStateToProps, { getRequests })(JoeMobileRequests);

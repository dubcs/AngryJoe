import * as firebase from 'firebase';
import { Alert, AsyncStorage } from 'react-native';
import {
  SET_VAN_LOCATION,
  GET_VAN_LOCATION,
  REQUEST_CHANGE,
  SUBMIT_REQUEST,
  REQUEST_ADMIN,
  ADMIN_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  SHUT_OFF_VAN,
  GET_TOGGLE,
  UPDATE_VAN_LOCATION,
  UPDATE_TOGGLE,
  TOGGLE_FALSE,
  TOGGLE_TRUE,
} from './types';

export const shutOffVan = () => async dispatch => {
  await firebase.database().ref(`/toggle/`).transaction((toggle) => {
    toggle = !toggle;
  return toggle;

    }, (error, committed, snapshot) => {
      if (error) {
        console.log('rerror');
      } else if (!committed) {
        console.log('transaction aborted');
      } else {
        if (snapshot.val()){
          dispatch({type: TOGGLE_TRUE});
      } else {
          dispatch({type: TOGGLE_FALSE});
      }
      }
    });

}
export const getToggle = () => async dispatch => {
  const toggleRef = firebase.database().ref(`/toggle/`);
  toggleRef.once('value').then((snapshot) => {
    if (snapshot.val()){
      dispatch({type: TOGGLE_TRUE});
    } else {
      dispatch({type: TOGGLE_FALSE});
    }
  });
}
export const logout = () => async dispatch => {
   dispatch({type: LOGOUT});

    Alert.alert(
        'Warning',
        'Are You sure you want to logout?',
      [
         {text: 'Cancel', onPress: () => console.log('Cancel Pressed'),},
         {text: 'OK', onPress: () => {
            AsyncStorage.removeItem('fb_token');
            firebase.auth().signOut().then(() => {
           });


         },
         },
      ],
        { cancelable: false }
      )
}

const logoutSuccess = (dispatch , cb) => async dispatch => {
  await AsyncStorage.removeItem('fb_token');
  firebase.auth().signOut().then(() => {
    logoutSuccess(dispatch,cb);
  });
  dispatch({type: LOGOUT});
  cb();
}

export const requestAdmin = () => async dispatch => {
  const { currentUser } = firebase.auth();

  const adminRef = firebase.database().ref(`/users/${currentUser.uid}/admin`);
  adminRef.once('value').then((snapshot) => {

    if (snapshot.val()){

      dispatch({type: ADMIN_SUCCESS, payload: snapshot.val()});
    } else {
      dispatch({type: REQUEST_ADMIN});
    }
  });
}
export const updateToggle = () => async dispatch => {
  const joeRef =  firebase.database().ref();
  joeRef.on("child_changed", (snapshot) => {
    if (snapshot.val()) {
    dispatch({type: TOGGLE_TRUE});
  } else {
    dispatch({type: TOGGLE_FALSE});
  }
  });
}
export const setVanLocation = (region) => async dispatch => {
    const joeRef =  firebase.database().ref(`/joeLocation/`);
    joeRef.update({region}).then(() => {
  }).catch((e) => console.log("there was an error"));
};
export const getVanLocation = () => async dispatch => {
  const joeRef =  firebase.database().ref(`/joeLocation/region`);
  joeRef.once('value').then((snapshot) => {
    dispatch({ type: GET_VAN_LOCATION, payload:snapshot.val()});
  }).catch((e) => console.log(e));
}

export const updateVanLocation = () => async dispatch => {
  const joeRef =  firebase.database().ref(`/joeLocation/`);
  joeRef.on("child_changed", (snapshot) => {
    dispatch({type: UPDATE_VAN_LOCATION, payload: snapshot.val()});
  });
}
export const requestChange = (text) => {
  return {
    type: REQUEST_CHANGE,
    payload: text
  };
};
export const submitRequest = (request) => async dispatch => {
  const { currentUser } = firebase.auth();
  const joeRef =  firebase.database().ref(`/joeLocationRequests/`);
  const requestKey = joeRef.push().key;
  const requestData = {
    uid: currentUser.uid,
    location: request,
    key: requestKey,

  };
  var updates = {};
  joeRef.child(requestKey).update(requestData).then(() => {
    dispatch({ type: SUBMIT_REQUEST });
    Alert.alert(
      'Thank You',
      'Your input is appreciated!',
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );
  }).catch((e) => console.log(e) );
};

import firebase from 'firebase';
import { Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  LOGIN_USER_SUCCESS,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  AUTH_STATE,
  AUTH_FAILED,
  FACEBOOK,
} from './types';

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};
export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};
export const usernameChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};
export const loginUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch(() => loginUserFail(dispatch));
  };
};

export const facebook = () => async dispatch => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('638125679855556', {
      permissions: ['public_profile', 'email']
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);

      const name  = (await response.json()).name;
      await AsyncStorage.setItem('fb_token', token);
      facebookCreateUser(dispatch, token);
    }
}
const facebookCreateUser = (dispatch, token) => {
  const credential =  firebase.auth.FacebookAuthProvider.credential(token);
  firebase.auth().signInAndRetrieveDataWithCredential(credential).then((u) => {
    console.log(u.additionalUserInfo.isNewUser);
      if(u.additionalUserInfo.isNewUser){
        const userRef = firebase.database().ref('/users/'+u.user.uid+'/').update({
              email: u.additionalUserInfo.profile.email,
              uid: u.user.uid,
              firstname: u.additionalUserInfo.profile.first_name,
              lastname: u.additionalUserInfo.profile.last_name,
        });
        loginUserSuccess(dispatch, u);
      } else {
        loginUserSuccess(dispatch, u);
      }

    });

}

const loginUserSuccess = (dispatch, user) => {
  dispatch({type: LOGIN_USER_SUCCESS, payload: user});
};


const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL, payload: null});
};
export const createUser = ({ email, password }) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user))
      .catch(() => loginUserFail(dispatch));
  };
};
const authFailed = (dispatch) => {
  dispatch({type: AUTH_FAILED, payload: null});
}

export const authState = () => async dispatch => {
    dispatch({ type: AUTH_STATE });
    const token = await AsyncStorage.getItem('fb_token');
    if (token){
      console.log('retrieved token');
      const credential =  firebase.auth.FacebookAuthProvider.credential(token);
      firebase.auth().signInAndRetrieveDataWithCredential(credential).then((user) => {
          console.log(user.user.uid)
          loginUserSuccess(dispatch, user);
      });
    } else {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('there is a user');
          loginUserSuccess(dispatch, user);
        } else {
          console.log('there is no user');
          authFailed(dispatch);
        }
      });
    }
};

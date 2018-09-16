import * as firebase from 'firebase';
import {
  CREATE_EMAIL_CHANGED,
  CREATE_PASSWORD_CHANGED,
  CREATE_USERNAME_CHANGED,
  SAVE_USER_SUCCESS,
  SAVE_USER_FAIL,
  SAVE_USER,
  CREATE_FIRST_NAME_CHANGED,
  CREATE_LAST_NAME_CHANGED,
} from './types';

export const createEmailChanged = (text) => {
  return {
    type: CREATE_EMAIL_CHANGED,
    payload: text
  };
};

export const createPasswordChanged = (text) => {
  return {
    type: CREATE_PASSWORD_CHANGED,
    payload: text
  };
};
export const createUsernameChanged = (text) => {
  return {
    type: CREATE_USERNAME_CHANGED,
    payload: text
  };
};
export const createFirstNameChanged = (text) => {
  return {
    type: CREATE_FIRST_NAME_CHANGED,
    payload: text
  };
};
export const createLastNameChanged = (text) => {
  return {
    type: CREATE_LAST_NAME_CHANGED,
    payload: text
  };
};
const saveUserFail = (dispatch, error) => {
  dispatch({
    type: SAVE_USER_FAIL,
    payload: error
   });
};

const saveUserSuccess = (dispatch, user) => async dispatch => {
//  var adaRef = firebase.database()
//  .ref(`users`)
//  .orderByChild('username')
//  .equalTo(username);
//  adaRef.once('value',(snapshot) => {
//    if (snapshot.val() === null) {
//    }
//});
  console.log(user);
};

export const saveUser = ( {email, password, username, firstname, lastname}) => async dispatch => {
    if ((!email)||(!password)||(!username)||(!firstname)||(!lastname)){
      const er = 'please fill out all fields';
      saveUserFail(dispatch, er);
      return;
    } else {
      var userIdRef = firebase.database().ref(`/users/`).orderByChild('username').equalTo(username);
          userIdRef.once('value', (snapshot) => {
              var exists = (snapshot.val() !== null);
              if (exists) {
                dispatch({ type:SAVE_USER_FAIL,  payload:"Username already exists, please try again!"});
                return;
              } else {
                firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {


                  firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                    const userRef = firebase.database().ref('/users/'+user.uid+'/').update({
                        username: username,
                        firstname: firstname,
                        lastname:lastname,
                        email:email,
                        uid: user.uid,
                        admin: false,
                      });
                      user.updateProfile({
                        displayName: username,
                      }).then(() => {
                        dispatch({type: SAVE_USER_SUCCESS, payload: user});
                      }).catch(() => {

                        dispatch({ type:SAVE_USER_FAIL,
                          payload:"There was a problem creating you account, please try again!"
                        });
                        return;
                      });
                    } else {
                      dispatch({
                        type:SAVE_USER_FAIL,
                        payload: "There was a problem creating you account, please try again!"});
                      return;
                    }
                  });
                }).catch((e) => {
                    dispatch({type: SAVE_USER});
                      const er = "There was a problem creating you account, please try again!"
                      dispatch({type:SAVE_USER_FAIL, payload: er});
                      return;
                  });


              }
        });

    }
  };
  /*        if (user) {
                const userRef = firebase.database().ref('/users/'+user.uid+'/').set({
                    username: username,
                    firstname: firstname,
                    lastname:lastname,
                    email:email,
                    uid: user.uid,
                  });
                  if (userRef){
                    console.log(userRef);
                    dispatch({
                      type: SAVE_USER_SUCCESS,
                      payload: user
                    });
                  }
              }
            } else {
                const er = "Authentication Failed, Please try again! could be duplicate email or poorly formatted"
                saveUserFail(dispatch, er);
                return;
              }
      } else {
        const er = 'Username already exists.';
        saveUserFail(dispatch, er);
        return; // Abort the transaction.
        }
    });
  };
};
*/

import firebase from 'firebase';
import { Alert } from 'react-native';
import _ from 'lodash';
import {
  GET_REQUESTS,
} from './types';

export const getRequests = () => {
  var snapper = [];
  const requestsRef = firebase.database().ref(`/joeLocationRequests/`);
  return (dispatch) => {
            requestsRef.once('value',snapshot => {
              snapshot.forEach((childSnap) => {

              userRef = firebase.database().ref(`/users/${childSnap.val().uid}`);
                userRef.once('value', snaps =>{

                const c = _.assign({},snaps.val(), childSnap.val());
                snapper.unshift(c);
                  dispatch({ type: GET_REQUESTS, payload: snapper});
                });
              });
            });
          };
};

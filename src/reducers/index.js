import { combineReducers } from 'redux';
import LoginReducers from './LoginReducers';
import NavigationReducer from './NavigationReducer';
import CreateUserReducer from './CreateUserReducer';
import AngryJoeMapReducer from './AngryJoeMapReducer';
import JoeMobileRequestsReducer from './JoeMobileRequestsReducer';


export default combineReducers({
  nav: NavigationReducer,
  auth: LoginReducers,
  createUser: CreateUserReducer,
  joeMap: AngryJoeMapReducer,
  requests: JoeMobileRequestsReducer,

});

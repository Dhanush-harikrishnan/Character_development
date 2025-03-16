import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import streak from './streak';
import reading from './reading';
import character from './character';

export default combineReducers({
  alert,
  auth,
  profile,
  streak,
  reading,
  character
});
import { combineReducers } from 'redux';
import sessionReducer from './sessionReducer';

export default combineReducers({
    session: sessionReducer
});

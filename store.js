import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export const initStore = (initialState = {}) => { 
	return createStore(
		reducer, 
		initialState, 
		composeWithDevTools(
			applyMiddleware(thunkMiddleware)
		)
	)
}

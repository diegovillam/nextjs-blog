import cookie from 'js-cookie';
import { LOGGED_IN, LOGGED_OUT } from './types';
import Auth from './../utils/Auth';

export const login = (token, user) => dispatch => {
	if (token) {
		cookie.set('id_token', token);
		dispatch({ type: LOGGED_IN, token, user });
	}
}

export const logout = () => dispatch => {
	cookie.remove('id_token');
	document.location.pathname = '/';
	dispatch({ type: LOGGED_OUT });
}

import { LOGGED_IN, LOGGED_OUT } from './../actions/types';

const initialState = {
	token: null,
	user: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case LOGGED_IN: {
			return {
				...state,
				token: action.token,
				user: action.user
			};
		}
		case LOGGED_OUT: {
			return {
				...state,
				token: null,
				user: null
			};
		}
		default: {
			return state;
		}
	}
}

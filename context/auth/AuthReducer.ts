import { IUser } from '../../interfaces';
import { AuthState } from '.';

type AuthActionType =
	| { type: 'LOGIN'; payload: IUser }
	| { type: 'LOGOUT' }
	| { type: 'REGISTER'; payload: IUser };

export const AuthReducer = (state: AuthState, action: AuthActionType) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true
			};
		case 'LOGOUT':
			return {
				...state,
				user: undefined,
				isAuthenticated: false
			};
		case 'REGISTER':
			return {
				...state,
				user: action.payload,
				isAuthenticated: true
			};
		default:
			return state;
	}
};

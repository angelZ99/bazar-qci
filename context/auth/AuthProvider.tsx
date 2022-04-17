import { FC, useReducer } from 'react';
import { IUser } from '../../interfaces';
import { AuthContext, AuthReducer } from './';
import Cookies from 'js-cookie';
import { Tracing } from 'trace_events';

export interface AuthState {
	isAuthenticated: boolean;
	user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
	isAuthenticated: false,
	user: undefined
};

interface Props {
	children: JSX.Element | JSX.Element[];
}

export const AuthProvider: FC<Props> = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);

	const loginUser = async (email: string, password: string) => {
		try {
			const data = await fetch('/api/users/login', {
				method: 'POST',
				body: JSON.stringify({ mail: email, password })
			}).then((res) => res.json());
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: 'LOGIN', payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const registerUser = async (
		firstName: string,
		lastName: string,
		userCode: number,
		email: string,
		password: string
	) => {
		try {
			const data = await fetch('/api/users/register', {
				method: 'POST',
				body: JSON.stringify({
					userCode,
					firstName,
					lastName,
					email,
					password
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => res.json());
			const { token, user } = data;
			Cookies.set('token', token);
			dispatch({ type: 'REGISTER', payload: user });
			return true;
		} catch (error) {
			return false;
		}
	};

	const logoutUser = () => {
		Cookies.remove('token');
		dispatch({ type: 'LOGOUT' });
	};

	return (
		<AuthContext.Provider
			value={{ ...state, loginUser, logoutUser, registerUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

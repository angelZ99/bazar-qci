import { FC, useReducer, useEffect } from 'react';
import Router from 'next/router';

import Cookies from 'js-cookie';

import { AuthContext, AuthReducer } from './';
import { IUser } from '../../interfaces';

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

	useEffect(() => {
		checkToken();
	}, []);

	const checkToken = async () => {
		if (!Cookies.get('token')) {
			return;
		}

		try {
			const data = await fetch('/api/auth/authenticate', {
				method: 'GET',
				credentials: 'include'
			}).then((res) => res.json());

			const { user } = data;
			if (user) {
				dispatch({ type: 'LOGIN', payload: user });
			}
		} catch (err) {
			dispatch({ type: 'LOGOUT' });
		}
	};

	const loginUser = async (email: string, password: string) => {
		try {
			const data = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			}).then((res) => res.json());

			if (data.token === undefined) {
				return false;
			}

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
			const data = await fetch('/api/auth/register', {
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

	const updateUser = () => {
		checkToken();
	};

	return (
		<AuthContext.Provider
			value={{ ...state, loginUser, logoutUser, registerUser, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

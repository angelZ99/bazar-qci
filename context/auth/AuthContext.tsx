import { createContext } from 'react';
import { IUser } from '../../interfaces';

interface AuthContext {
	isAuthenticated: boolean;
	user?: IUser;

	loginUser: (email: string, password: string) => Promise<boolean>;
	logoutUser: () => void;
	registerUser: (
		firstName: string,
		lastName: string,
		userCode: number,
		email: string,
		password: string
	) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContext);

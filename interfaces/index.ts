import { Comments, Favorites } from '@prisma/client';

export interface IUser {
	userCode: number;
	firstName: string;
	lastName: string;
	email: string;
	verified: boolean;
	role: string;
	favorites: Favorites[] | null;
	comments: Comments[] | null;
}

export interface IAdmin {}

export interface IVendor {
	vendorCode: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: number;
	rating: number;
	verified: boolean;
	role: string;
}

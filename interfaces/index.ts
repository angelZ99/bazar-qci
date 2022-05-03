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

export interface IAdmin {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	vendorCode?: number;
	phoneNumber?: string;
	rating?: number;
}

export interface IProduct {
	name: string;
	description: string;
	price: number;
	categoryId: number;
	published: boolean;
}

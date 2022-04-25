export interface IUser {
	userCode: number;
	firstName: string;
	lastName: string;
	email: string;
	verified: boolean;
	role: string;
}

export interface IAdmin {}

export interface IVendor {}